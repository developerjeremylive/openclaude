import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { ToolConfirmationPopup } from '../components/ToolConfirmationPopup';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import { openClaudeMessagesInsert } from '../utils/supabaseClient';

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: var(--bg-primary);
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 2rem 0;
  scroll-behavior: smooth;
`;

const Header = styled.header`
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-primary);
`;

const EmptyChatView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--text-secondary);
  gap: 1rem;
`;

const EmptyChatIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1rem 2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: var(--text-secondary);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;

  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
  }
`;

const ChatTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export const ChatPage: React.FC = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toolRequest, setToolRequest] = useState<{ toolName: string; toolDesc: string; options?: { value: string; label: string }[] } | null>(null);
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const currentChatIdRef = useRef(chatId);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionInitialized = useRef(false);
  const messagesRef = useRef<Message[]>([]);
  const hasSavedResponse = useRef(false);
  const currentAssistantResponse = useRef('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (chatId && chatId !== 'new') {
      setCurrentChatId(chatId);
      currentChatIdRef.current = chatId;
      fetchMessages(chatId);
    } else {
      // Redirect to /chat to trigger a new chat creation or default behavior
      // For now, we'll just keep it simple and let the Sidebar handle "New Chat"
      // If the user lands here without an ID, we can just stay in an empty state
      // or redirect to a fresh chat creation.
      setCurrentChatId(null);
      currentChatIdRef.current = null;
    }
  }, [user, chatId, navigate]);

  // Refetch messages when chatId changes
  useEffect(() => {
    if (currentChatId && currentChatId !== 'new') {
      fetchMessages();
    }
  }, [currentChatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchMessages = async (id?: string) => {
    const targetChatId = id || currentChatId;
    if (!targetChatId) return;
    const { data, error } = await supabase
      .from('livemessages')
      .select('*')
      .eq('chat_id', targetChatId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToolResponse = (value: string) => {
    socketRef.current?.emit('tool-response', { response: value });
    setToolRequest(null);
  };


  const initSocket = () => {
    socketRef.current = io('http://localhost:4000');

    socketRef.current.on('cli-output', async ({ text }) => {
      setIsLoading(false);
      currentAssistantResponse.current += text;
      // The CLI output can be streaming, so we might need to accumulate
      // For now, we treat each chunk as a part of the last assistant message
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant') {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            content: lastMsg.content + text
          };
          return newMessages;
        }
        return [...prev, { role: 'assistant', content: text }];
      });
    });

    socketRef.current.on('cli-error', ({ text }) => {
      setIsLoading(false);
      if (text.includes('[Request interrupted by user]') || text.includes('Warning: no stdin data received')) return;
      // Only show toast if it looks like a critical error
      if (text.toLowerCase().includes('error') || text.toLowerCase().includes('failed')) {
        toast.error(`CLI Error: ${text}`);
      }
    });

    socketRef.current.on('error', ({ text }) => {
      setIsLoading(false);
      toast.error(`Session Error: ${text}`);
    });

    socketRef.current.on('tool-request', ({ toolName, toolDesc }) => {
      setToolRequest({ toolName, toolDesc });
    });

    socketRef.current.on('cli-closed', async () => {
      setIsLoading(false);
      if (hasSavedResponse.current) return;

      const responseToSave = currentAssistantResponse.current;
      if (responseToSave) {
        hasSavedResponse.current = true;
        // Async save to Supabase using the accumulated ref
        openClaudeMessagesInsert({
          chat_id: currentChatIdRef.current!,
          user_id: user!.id,
          role: 'assistant',
          content: responseToSave,
          metadata: {}
        }).then(() => {
          // Notificar a la barra lateral para que actualice el contador
          window.dispatchEvent(new CustomEvent('refresh-chat-list'));
        }).catch(err => console.error('Failed to save assistant response:', err));
        currentAssistantResponse.current = '';
      }
    });

    socketRef.current.on('chat-cleared', ({ chatId }) => {
      if (chatId === currentChatIdRef.current) {
        setMessages([]);
        currentAssistantResponse.current = '';
        hasSavedResponse.current = false;
      }
    });

    socketRef.current.on('chat-switched', ({ chatId }) => {
      setCurrentChatId(chatId);
      navigate(`/chat/${chatId}`);
      currentAssistantResponse.current = '';
      hasSavedResponse.current = false;
    });

  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;
    if (isLoading) return;

    setIsLoading(true);
    hasSavedResponse.current = false;

    try {
      let activeChatId = currentChatId;
      currentAssistantResponse.current = '';
      hasSavedResponse.current = false;

      // Si es un chat nuevo, crearlo primero en Supabase

      // Si es un chat nuevo, crearlo primero en Supabase
      if (!activeChatId || activeChatId === 'new') {
        const { data: newChat, error: chatError } = await supabase
          .from('livechats')
          .insert([{
            title: text.length > 30 ? text.substring(0, 30) + '...' : text,
            user_id: user.id
          }])
          .select()
          .single();

        if (chatError) throw chatError;
        activeChatId = newChat.id;
        setCurrentChatId(activeChatId);
        currentChatIdRef.current = activeChatId;
      }

      // Guardar mensaje del usuario
      const savedMsg = await openClaudeMessagesInsert({
        chat_id: activeChatId,
        user_id: user.id,
        role: 'user',
        content: text,
        metadata: {}
      });

      if (savedMsg) {
        setMessages(prev => [...prev, { ...savedMsg, role: 'user', content: text }]);
      }

      if (!socketRef.current) {
        initSocket();
      }

      const isFirstMessage = messages.length === 0;

      if (isFirstMessage) {
        socketRef.current?.emit('start-chat', {
          chatId: activeChatId,
          userId: user.id,
          message: text,
          providerConfig: {
            apiKey: import.meta.env.VITE_API_KEY,
            baseUrl: import.meta.env.VITE_BASE_URL,
            model: import.meta.env.VITE_MODEL
          }
        });
      } else {
        socketRef.current?.emit('send-message', {
          chatId: activeChatId,
          userId: user.id,
          message: text,
          providerConfig: {
            apiKey: import.meta.env.VITE_API_KEY,
            baseUrl: import.meta.env.VITE_BASE_URL,
            model: import.meta.env.VITE_MODEL
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje. Por favor, intenta de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <ChatSidebar />
      <ChatMain>
        <Header>
          <ChatTitle>OpenClaude Chat</ChatTitle>
        </Header>
        <MessagesContainer>
          {messages.length === 0 && !isLoading ? (
            <EmptyChatView>
              <EmptyChatIcon>💬</EmptyChatIcon>
              <p>Este chat está vacío. ¡Envía un mensaje para comenzar!</p>
            </EmptyChatView>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))
          )}
          {isLoading && (
            <TypingIndicator>
              <span>OpenClaude está pensando</span>
              <Dot />
              <Dot />
              <Dot />
            </TypingIndicator>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </ChatMain>
      {toolRequest && (
        <ToolConfirmationPopup
          toolName={toolRequest.toolName}
          arguments={toolRequest.toolDesc}
          options={toolRequest.options}
          onResponse={handleToolResponse}
        />
      )}
    </PageContainer>
  );
};

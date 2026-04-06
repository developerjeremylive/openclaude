import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
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
  const [currentChatId, setCurrentChatId] = useState(chatId);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (chatId && chatId !== 'new') {
      setCurrentChatId(chatId);
      fetchMessages();
    } else {
      createNewChat();
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

  const fetchMessages = async () => {
    if (!currentChatId) return;
    const { data, error } = await supabase
      .from('livemessages')
      .select('*')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('livechats')
      .insert({
        user_id: user.id,
        title: 'Nuevo Chat'
      })
      .select()
      .single();

    if (error) {
      toast.error('Error al crear nuevo chat');
      return;
    }

    // Update the URL and state without triggering a full navigation
    window.history.pushState({}, '', `/chat/${data.id}`);
    // Force a re-render by setting a dummy state
    setCurrentChatId(data.id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initSocket = () => {
    socketRef.current = io('http://localhost:4000');

    socketRef.current.on('cli-output', async ({ text }) => {
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
      toast.error(`CLI Error: ${text}`);
    });
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChatId || currentChatId === 'new' || !user) return;

    // Save user message to Supabase
    const savedMsg = await openClaudeMessagesInsert({
      chat_id: currentChatId,
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

    // Send to bridge server
    socketRef.current?.emit('start-chat', {
      chatId: currentChatId,
      userId: user.id,
      message: text,
      providerConfig: {
        apiKey: 'YOUR_OPENROUTER_API_KEY', // This should come from user settings
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'anthropic/claude-3.5-sonnet'
      }
    });
  };

  return (
    <PageContainer>
      <ChatSidebar />
      <ChatMain>
        <Header>
          <ChatTitle>OpenClaude Chat</ChatTitle>
        </Header>
        <MessagesContainer>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} role={msg.role} content={msg.content} />
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </ChatMain>
    </PageContainer>
  );
};

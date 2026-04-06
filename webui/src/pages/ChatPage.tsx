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
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (chatId) {
      fetchMessages();
    } else {
      navigate('/chat/new');
    }
  }, [user, chatId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initSocket = () => {
    socketRef.current = io('http://localhost:3001');

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
    if (!chatId || !user) return;

    // Save user message to Supabase
    const { data: savedMsg } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role: 'user',
        content: text
      })
      .select();

    setMessages(prev => [...prev, { ...savedMsg?.[0], role: 'user', content: text }]);

    if (!socketRef.current) {
      initSocket();
    }

    // Send to bridge server
    socketRef.current?.emit('start-chat', {
      chatId,
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

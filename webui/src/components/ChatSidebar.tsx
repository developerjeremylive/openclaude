import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, MessageSquare, Trash2, User, FileText } from 'lucide-react';

const SidebarContainer = styled.div`
  width: 300px;
  height: 100vh;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
`;

const NewChatButton = styled.button`
  margin: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: var(--accent-hover);
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 1rem;
`;

const ChatItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${props => props.active ? 'var(--bg-primary)' : 'transparent'};
  border: 1px solid ${props => props.active ? 'var(--accent)' : 'transparent'};
  transition: all 0.2s;
  &:hover {
    background: var(--bg-primary);
  }
`;

const ChatInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  overflow: hidden;
`;

const ChatTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
  flex: 1;
`;

const MessageCountLabel = styled.span<{ $count: number }>`
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  background: ${props => props.$count === 0 ? 'var(--border)' : 'var(--accent)'};
  color: ${props => props.$count === 0 ? 'var(--text-secondary)' : 'white'};
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  &:hover {
    color: #ef4444;
  }
`;

const UserProfile = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ChatSidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chats, setChats] = useState<any[]>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, [user]);

  useEffect(() => {
    if (chatId && chatListRef.current) {
      const activeItem = chatListRef.current.querySelector('[data-active="true"]');
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [chatId, chats]);

  const fetchChats = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('livechats')
      .select('*, livemessages(count)')
      .order('updated_at', { ascending: false });

    if (!error && data) setChats(data);
  };

  const createNewChat = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('livechats')
      .insert({ user_id: user.id, title: 'Nuevo Chat' })
      .select();

    if (!error && data) {
      setChats([data[0], ...chats]);
      navigate(`/chat/${data[0].id}`);
    }
  };

  const deleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) return;
    const { error } = await supabase.from('chats').delete().eq('id', id);
    if (!error) {
      setChats(chats.filter(c => c.id !== id));
      if (chatId === id) navigate('/chat');
    }
  };

  return (
    <SidebarContainer>
      <NewChatButton onClick={createNewChat}>
        <Plus size={18} />
        Nuevo Chat
      </NewChatButton>

      <ChatList ref={chatListRef}>
        {chats.map(chat => {
          const messageCount = chat.livemessages?.[0]?.count || 0;
          const isEmpty = messageCount === 0;
          return (
            <ChatItem
              key={chat.id}
              active={chatId === chat.id}
              data-active={chatId === chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <ChatInfo>
                {isEmpty ? <FileText size={16} /> : <MessageSquare size={16} />}
                <ChatTitle>{chat.title}</ChatTitle>
                <MessageCountLabel $count={messageCount}>
                  {messageCount}
                </MessageCountLabel>
              </ChatInfo>
              <DeleteButton onClick={(e) => deleteChat(e, chat.id)}>
                <Trash2 size={14} />
              </DeleteButton>
            </ChatItem>
          );
        })}
      </ChatList>

      {user && (
        <UserProfile>
          <User size={20} />
          <span style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </span>
        </UserProfile>
      )}
    </SidebarContainer>
  );
};

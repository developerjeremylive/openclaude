import React, { useState } from 'react';
import styled from 'styled-components';
import { Send } from 'lucide-react';

const InputContainer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 2rem;
  background: linear-gradient(transparent, var(--bg-primary) 20%);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  max-width: 800px;
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const InputField = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 1rem;
  padding: 0.5rem;
  resize: none;
  outline: none;
  max-height: 200px;
  font-family: inherit;
`;

const SendButton = styled.button`
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: var(--accent-hover);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <InputContainer>
      <Form onSubmit={handleSubmit}>
        <InputField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          rows={1}
        />
        <SendButton type="submit" disabled={disabled || !message.trim()}>
          <Send size={20} />
        </SendButton>
      </Form>
    </InputContainer>
  );
};

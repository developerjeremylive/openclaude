import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, Terminal } from 'lucide-react';

const SHORTCUTS = [
  { cmd: '/clear', desc: 'Limpia el historial de la conversación' },
  { cmd: '/resume', desc: 'Recupera una sesión anterior' },
  { cmd: '/model', desc: 'Cambia el modelo de IA activo' },
  { cmd: '/provider', desc: 'Cambia el proveedor de IA' },
];

const InputContainer = styled.div`
  position: sticky;
  bottom: 0;
  padding: 2rem;
  background: linear-gradient(transparent, var(--bg-primary) 20%);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const FormWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
`;

const Form = styled.form`
  display: flex;
  gap: 0.75rem;
  width: 100%;
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

const ShortcutsMenu = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  padding: 0.5rem;
`;

const ShortcutItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.4rem;
  cursor: pointer;
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background: ${props => props.$active ? 'var(--bg-primary)' : 'transparent'};
  transition: all 0.1s;
  border: 1px solid ${props => props.$active ? 'var(--accent)' : 'transparent'};

  &:hover {
    background: var(--bg-primary);
    color: var(--text-primary);
  }
`;

const ShortcutCmd = styled.span`
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  color: var(--accent);
  min-width: 100px;
`;

const ShortcutDesc = styled.span`
  font-size: 0.85rem;
  opacity: 0.8;
`;

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setShowShortcuts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Detect slash at the end of the current word
    const words = value.split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('/')) {
      setShowShortcuts(true);
      setSelectedIndex(0);
    } else if (!value.includes('/')) {
      setShowShortcuts(false);
    }
  };

  const handleShortcutSelect = (shortcut: typeof SHORTCUTS[0]) => {
    const words = message.split(/\s+/);
    words[words.length - 1] = shortcut.cmd;
    setMessage(words.join(' ') + ' ');
    setShowShortcuts(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showShortcuts) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % SHORTCUTS.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + SHORTCUTS.length) % SHORTCUTS.length);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        handleShortcutSelect(SHORTCUTS[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <InputContainer>
      <FormWrapper>
        {showShortcuts && (
          <ShortcutsMenu>
            {SHORTCUTS.map((s, idx) => (
              <ShortcutItem
                key={s.cmd}
                $active={selectedIndex === idx}
                onClick={() => handleShortcutSelect(s)}
              >
                <Terminal size={14} color="var(--accent)" />
                <ShortcutCmd>{s.cmd}</ShortcutCmd>
                <ShortcutDesc>{s.desc}</ShortcutDesc>
              </ShortcutItem>
            ))}
          </ShortcutsMenu>
        )}
        <Form onSubmit={handleSubmit}>
          <InputField
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje o usa / para shortcuts..."
            rows={1}
          />
          <SendButton type="submit" disabled={disabled || !message.trim()}>
            <Send size={20} />
          </SendButton>
        </Form>
      </FormWrapper>
    </InputContainer>
  );
};

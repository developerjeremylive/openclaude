import React from 'react';
import styled from 'styled-components';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MessageWrapper = styled.div<{ role: 'user' | 'assistant' }>`
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: ${props => props.role === 'assistant' ? 'var(--bg-secondary)' : 'transparent'};
  border-radius: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;
`;

const IconContainer = styled.div<{ role: 'user' | 'assistant' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  background: ${props => props.role === 'assistant' ? 'var(--accent)' : 'var(--bg-primary)'};
  color: ${props => props.role === 'assistant' ? 'white' : 'var(--text-primary)'};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);

  p {
    margin-bottom: 1rem;
  }

  pre {
    background: #282c34;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
  }
`;

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <MessageWrapper role={role}>
      <IconContainer role={role}>
        {role === 'user' ? <User size={20} /> : <Bot size={20} />}
      </IconContainer>
      <Content>
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </Content>
    </MessageWrapper>
  );
};

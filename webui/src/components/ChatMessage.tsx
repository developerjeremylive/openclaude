import React, { useState } from 'react';
import styled from 'styled-components';
import { User, Bot, ChevronDown, ChevronUp, Brain } from 'lucide-react';
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

const ThoughtWrapper = styled.div`
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background: var(--bg-primary);
  overflow: hidden;
`;

const ThoughtHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary);
  cursor: pointer;
  user-select: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-primary);
  }
`;

const ThoughtContent = styled.div`
  padding: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
  font-style: italic;
  line-height: 1.5;
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

const ThoughtBlock: React.FC<{ content: string }> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ThoughtWrapper>
      <ThoughtHeader onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        <Brain size={14} />
        <span>Pensamiento</span>
        {isExpanded ? 'Ocultar' : 'Mostrar'}
      </ThoughtHeader>
      {isExpanded && (
        <ThoughtContent>
          <ReactMarkdown
            components={{
              code({ children }) {
                return <code>{children}</code>;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </ThoughtContent>
      )}
    </ThoughtWrapper>
  );
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const parts = content.split(/(<thought>[\s\S]*?<\/thought>)/g);

  return (
    <MessageWrapper role={role}>
      <IconContainer role={role}>
        {role === 'user' ? <User size={20} /> : <Bot size={20} />}
      </IconContainer>
      <Content>
        {parts.map((part, idx) => {
          if (part.startsWith('<thought>') && part.endsWith('</thought>')) {
            const thoughtContent = part.replace('<thought>', '').replace('</thought>', '');
            return <ThoughtBlock key={idx} content={thoughtContent} />;
          }
          return (
            <ReactMarkdown
              key={idx}
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
              {part}
            </ReactMarkdown>
          );
        })}
      </Content>
    </MessageWrapper>
  );
};

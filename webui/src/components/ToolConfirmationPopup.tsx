import React from 'react';
import styled from 'styled-components';
import { ShieldAlert, Check, X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const IconWrapper = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 0.75rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const Body = styled.div`
  margin-bottom: 2rem;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
`;

const ToolBadge = styled.span`
  background: var(--bg-primary);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-family: 'Fira Code', monospace;
  font-weight: 600;
  border: 1px solid var(--border);
  margin: 0 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.625rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  ${props => props.$variant === 'primary' ? `
    background: var(--accent);
    color: white;
    border: none;
    &:hover { background: var(--accent-hover); }
  ` : `
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
    &:hover { background: var(--bg-primary); }
  `}
`;

interface ToolConfirmationPopupProps {
  toolName: string;
  arguments: string;
  options?: { value: string; label: string }[];
  onResponse: (value: string) => void;
}

export const ToolConfirmationPopup: React.FC<ToolConfirmationPopupProps> = ({
  toolName,
  arguments: args,
  options,
  onResponse
}) => {
  return (
    <Overlay>
      <Modal>
        <Header>
          <IconWrapper>
            <ShieldAlert size={24} />
          </IconWrapper>
          <Title>Permiso de Ejecución de Herramienta</Title>
        </Header>
        <Body>
          El agente solicita ejecutar la herramienta <ToolBadge>{toolName}</ToolBadge> con los siguientes argumentos:
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--bg-primary)',
            borderRadius: '0.5rem',
            fontFamily: 'Fira Code, monospace',
            fontSize: '0.85rem',
            border: '1px solid var(--border)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {args}
          </div>
        </Body>
        <ButtonGroup>
          {options && options.length > 0 ? (
            options.map((opt, idx) => (
              <Button
                key={idx}
                $variant={opt.label.toLowerCase().includes('no') ? 'secondary' : 'primary'}
                onClick={() => onResponse(opt.value)}
              >
                {opt.label}
              </Button>
            ))
          ) : (
            <>
              <Button $variant="secondary" onClick={() => onResponse('n')}>
                <X size={16} /> Denegar
              </Button>
              <Button $variant="primary" onClick={() => onResponse('y')}>
                <Check size={16} /> Aceptar
              </Button>
            </>
          )}
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

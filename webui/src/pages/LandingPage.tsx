import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled.button`
  background: var(--accent);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 0.75rem;
  &:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 5rem;
  text-align: left;
`;

const FeatureCard = styled.div`
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
`;

const Recommendation = styled.div`
  margin-top: 6rem;
  padding: 3rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 1.5rem;
  border: 1px solid var(--accent);
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>OpenClaude WebUI</Title>
      <Subtitle>
        La potencia de Claude Code abierta a cualquier modelo, ahora con una interfaz web moderna y persistente.
      </Subtitle>

      <Button onClick={() => navigate('/auth')}>
        Empezar Ahora
      </Button>

      <Features>
        <FeatureCard>
          <h3>🔓 Totalmente Abierto</h3>
          <p>Usa OpenAI, Gemini, DeepSeek, Ollama y más de 200 modelos disponibles.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>💾 Historial de Chats</h3>
          <p>Tus conversaciones se guardan de forma segura por usuario con Supabase.</p>
        </FeatureCard>
        <FeatureCard>
          <h3>🛠️ Terminal Workflow</h3>
          <p>Mantiene la capacidad de usar herramientas de bash, edición de archivos y agentes.</p>
        </FeatureCard>
      </Features>

      <Recommendation>
        <h2 style={{ marginBottom: '1rem' }}>💡 Recomendación del Sistema</h2>
        <p style={{ fontSize: '1.1rem' }}>
          Para obtener la mejor experiencia y acceso a los modelos más potentes (como Claude 3.5 Sonnet o GPT-4o) de forma económica, recomendamos configurar <strong>OpenRouter</strong> como tu proveedor.
        </p>
        <p style={{ marginTop: '1rem', color: 'var(--accent)' }}>
          Una sola API Key para acceder a todo el ecosistema de IA.
        </p>
      </Recommendation>
    </Container>
  );
};

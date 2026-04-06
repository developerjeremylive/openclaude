import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Terminal, Shield, Database, Zap, Cpu, ArrowRight } from 'lucide-react';
import { ThreeBackground } from '../components/ThreeBackground';

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: var(--bg-primary);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const Button = styled.button`
  background: var(--accent);
  color: white;
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }
`;

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-primary);
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.2s;
  cursor: pointer;
  &:hover {
    color: var(--accent);
  }
`;

const NavButton = styled(Button)`
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border-radius: 0.5rem;
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

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: 8rem 0 4rem;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 4rem 0;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const HeroTitle = styled(Title)`
  font-size: 3.5rem;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
  }
`;

const HeroSubtitle = styled(Subtitle)`
  font-size: 1.25rem;
  text-align: left;
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    order: -1;
  }
`;

const VisualCard = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  width: 100%;
  max-width: 500px;
  position: relative;
  animation: float 6s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
`;

const VisualHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color || '#ff5f56'};
`;

const VisualLine = styled.div`
  height: 10px;
  background: ${props => props.color || 'var(--border)'};
  border-radius: 5px;
  margin-bottom: 0.75rem;
  width: ${props => props.width || '100%'};
  opacity: 0.6;
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

const Section = styled.section`
  padding: 6rem 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  text-align: left;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoParagraph = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
`;

const WorkflowContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  flex-wrap: wrap;
`;

const WorkflowStep = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: 1rem;
  width: 200px;
  text-align: center;
  position: relative;
`;

const StepNumber = styled.div`
  background: var(--accent);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 1rem;
`;

const OpenSourceBox = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%);
  border: 1px solid var(--accent);
  padding: 3rem;
  border-radius: 2rem;
  text-align: center;
  margin-top: 6rem;
`;

const Recommendation = styled.div`
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid var(--accent);
  padding: 2.5rem;
  border-radius: 1.5rem;
  margin-top: 5rem;
  text-align: left;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.1);
`;

const Footer = styled.footer`
  margin-top: 8rem;
  padding: 4rem 2rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  text-align: center;
`;

const FooterContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const FooterText = styled.p`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const FooterLink = styled.a`
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  &:hover {
    color: var(--accent-hover);
    text-decoration: underline;
  }
`;

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ThreeBackground />
      <Nav>
        <NavLogo onClick={() => navigate('/')}>
          <Terminal size={24} color="var(--accent)" />
          <span>OpenClaude</span>
        </NavLogo>
        <NavLinks>
          <NavLink onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Características
          </NavLink>
          <NavLink href="https://github.com/Gitlawb/openclaude" target="_blank" rel="noopener noreferrer">
            GitHub
          </NavLink>
          <NavLink onClick={() => alert('Próximamente: Documentación completa')}>
            Docs
          </NavLink>
        </NavLinks>
        <NavButton onClick={() => navigate('/auth')}>
          Empezar Ahora
        </NavButton>
      </Nav>

      <Container>
        <HeroSection>
          <HeroContent>
            <HeroTitle>
              La Potencia de Claude Code <br />
              <span style={{ color: 'var(--accent)' }}>en tu Navegador</span>
            </HeroTitle>
            <HeroSubtitle>
              OpenClaude WebUI libera la capacidad de agentes autónomos, ejecución de bash y edición de archivos, compatible con cualquier modelo de IA moderno.
            </HeroSubtitle>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Button onClick={() => navigate('/auth')}>
                Empezar Ahora <ArrowRight size={20} style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }} />
              </Button>
            </div>
          </HeroContent>
          <HeroVisual>
            <VisualCard>
              <VisualHeader>
                <Dot color="#ff5f56" />
                <Dot color="#ffbd2e" />
                <Dot color="#27c93f" />
              </VisualHeader>
              <VisualLine width="40%" color="var(--accent)" />
              <VisualLine width="80%" />
              <VisualLine width="60%" />
              <VisualLine width="90%" />
              <VisualLine width="30%" color="var(--accent)" />
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Terminal size={16} />
                <span>Ejecutando agente autónomo...</span>
              </div>
            </VisualCard>
          </HeroVisual>
        </HeroSection>

        <Features id="features">
          <FeatureCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Shield color="var(--accent)" size={24} />
              <h3 style={{ margin: 0 }}>Totalmente Abierto</h3>
            </div>
            <p>Usa OpenAI, Gemini, DeepSeek, Ollama y más de 200 modelos disponibles a través de OpenRouter.</p>
          </FeatureCard>
          <FeatureCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Database color="var(--accent)" size={24} />
              <h3 style={{ margin: 0 }}>Historial de Chats</h3>
            </div>
            <p>Tus conversaciones se guardan de forma segura por usuario con Supabase, permitiendo persistencia total.</p>
          </FeatureCard>
          <FeatureCard>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Cpu color="var(--accent)" size={24} />
              <h3 style={{ margin: 0 }}>Terminal Workflow</h3>
            </div>
            <p>Mantiene la capacidad de usar herramientas de bash, edición de archivos y agentes autónomos complejos.</p>
          </FeatureCard>
        </Features>

        <Section>
          <SectionTitle>¿Qué es OpenClaude?</SectionTitle>
          <SectionSubtitle>
            OpenClaude es la implementación de código abierto de un sistema de codificación agentico.
            A diferencia de los chatbots tradicionales, OpenClaude no solo sugiere código, sino que actúa
            como un ingeniero de software autónomo capaz de navegar por tu repositorio, ejecutar comandos,
            analizar errores y aplicar correcciones de forma independiente.
          </SectionSubtitle>
        </Section>

        <Section>
          <SectionTitle>El Bucle Agentico</SectionTitle>
          <SectionSubtitle>La magia de OpenClaude reside en su capacidad de iteración autónoma a través de un ciclo continuo de razonamiento y acción.</SectionSubtitle>
          <WorkflowContainer>
            <WorkflowStep>
              <StepNumber>1</StepNumber>
              <h4 style={{ marginBottom: '0.5rem' }}>Planificar</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Analiza el repositorio y diseña una estrategia de implementación paso a paso.</p>
            </WorkflowStep>
            <WorkflowStep>
              <StepNumber>2</StepNumber>
              <h4 style={{ marginBottom: '0.5rem' }}>Ejecutar</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Escribe código, crea archivos y ejecuta comandos de terminal en tiempo real.</p>
            </WorkflowStep>
            <WorkflowStep>
              <StepNumber>3</StepNumber>
              <h4 style={{ marginBottom: '0.5rem' }}>Verificar</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ejecuta tests y analiza logs para asegurar que la solución es correcta.</p>
            </WorkflowStep>
            <WorkflowStep>
              <StepNumber>4</StepNumber>
              <h4 style={{ marginBottom: '0.5rem' }}>Refinar</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Corrige errores detectados y optimiza el resultado hasta alcanzar el objetivo.</p>
            </WorkflowStep>
          </WorkflowContainer>
        </Section>

        <Section>
          <SectionTitle>Capacidades Clave</SectionTitle>
          <SectionSubtitle>Diseñado para manejar la complejidad de proyectos reales de software.</SectionSubtitle>
          <InfoGrid>
            <InfoText>
              <InfoParagraph>
                <strong>Integración Profunda con Terminal:</strong> Acceso completo a bash para ejecutar builds, scripts de migración y herramientas de CLI.
              </InfoParagraph>
              <InfoParagraph>
                <strong>Manipulación de Archivos:</strong> Capacidad de leer, escribir y editar archivos con precisión quirúrgica en cualquier parte del proyecto.
              </InfoParagraph>
              <InfoParagraph>
                <strong>Contexto Global:</strong> Indexación inteligente del código para comprender relaciones entre módulos y dependencias complejas.
              </InfoParagraph>
            </InfoText>
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Análisis de dependencias...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Aplicando fix en src/core/engine.ts...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Verificando tests unitarios...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--border)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Esperando confirmación...</span>
                </div>
              </div>
            </div>
          </InfoGrid>
        </Section>

        <OpenSourceBox>
          <SectionTitle style={{ marginBottom: '1rem' }}>La Ventaja Open Source</SectionTitle>
          <SectionSubtitle style={{ marginBottom: '2rem' }}>
            Toma el control total de tu flujo de trabajo de IA. Sin restricciones de proveedor, sin cajas negras.
          </SectionSubtitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Soberanía de Datos</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tus llaves de API y tus archivos permanecen bajo tu control.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Flexibilidad de Modelos</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cambia entre Claude, GPT, Llama o DeepSeek instantáneamente.</p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Evolución Comunitaria</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mejorado por desarrolladores, para desarrolladores.</p>
            </div>
          </div>
        </OpenSourceBox>

        <Recommendation>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Zap color="var(--accent)" size={28} />
            <h2 style={{ margin: 0 }}>Recomendación del Sistema</h2>
          </div>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            Para obtener la mejor experiencia y acceso a los modelos más potentes (como Claude 3.5 Sonnet o GPT-4o) de forma económica, recomendamos configurar <strong>OpenRouter</strong> como tu proveedor.
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--accent)', fontWeight: 600 }}>
            Una sola API Key para acceder a todo el ecosistema de IA.
          </p>
        </Recommendation>
      </Container>

      <Footer>
        <FooterContainer>
          <FooterText>
            © {new Date().getFullYear()} OpenClaude WebUI. Todos los derechos reservados.
          </FooterText>
          <FooterText>
            Creado con ❤️ por <FooterLink href="https://jeremylive.netlify.app" target="_blank" rel="noopener noreferrer">Jeremy Live</FooterLink>
          </FooterText>
        </FooterContainer>
      </Footer>
    </PageWrapper>
  );
};

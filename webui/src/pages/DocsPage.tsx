import React, { useState } from 'react';
import styled from 'styled-components';
import { Book, Terminal, Cpu, Shield, Settings, Zap, Layout, Layers, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.aside`
  width: 300px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 3rem;
  color: var(--accent);
`;

const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const NavSectionTitle = styled.h4`
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-secondary);
  letter-spacing: 0.05rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const NavItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${props => props.$active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  margin-bottom: 0.25rem;

  &:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 4rem 3rem;
  max-width: 900px;
  margin: 0 auto;
  line-height: 1.6;
`;

const MainContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
`;

const ContentBlock = styled.div`
  margin-bottom: 3rem;
`;

const Subheading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 2.5rem 0 1rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.2rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
`;

const InfoBox = styled.div`
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
`;

const CodeBlock = styled.pre`
  background: #0d0d0d;
  color: #d1d1d1;
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  margin: 1.5rem 0;
  border: 1px solid var(--border);
`;

const List = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.75rem;
  color: var(--text-secondary);
`;

const DocsFooter = styled.footer`
  padding: 3rem 2rem;
  border-top: 1px solid var(--border);
  text-align: center;
  margin-top: auto;
  background: var(--bg-secondary);
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

export const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Introducción', icon: <Book size={18} /> },
    { id: 'architecture', title: 'Arquitectura', icon: <Layers size={18} /> },
    { id: 'tools', title: 'Sistema de Herramientas', icon: <Terminal size={18} /> },
    { id: 'commands', title: 'Comandos Slash', icon: <Code size={18} /> },
    { id: 'agentic', title: 'Flujo Agentico', icon: <Zap size={18} /> },
    { id: 'setup', title: 'Configuración', icon: <Settings size={18} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <>
            <SectionTitle>Documentación de OpenClaude</SectionTitle>
            <SectionSubtitle>Guía completa sobre la implementación de código abierto del sistema de codificación agentico.</SectionSubtitle>
            <ContentBlock>
              <Subheading>¿Qué es OpenClaude?</Subheading>
              <Paragraph>
                OpenClaude es la versión de código abierto inspirada en las capacidades de Claude Code. Es un entorno de desarrollo impulsado por IA que no se limita a chatear sobre código, sino que puede <strong>actuar</strong> sobre él.
              </Paragraph>
              <Paragraph>
                Mientras que un asistente de IA tradicional te dice cómo arreglar un bug, OpenClaude analiza tu repositorio, planifica la solución, escribe el código, ejecuta los tests y verifica el resultado, todo de manera autónoma.
              </Paragraph>
              <InfoBox>
                <strong>Concepto Clave:</strong> OpenClaude transforma la IA de un "consultor" a un "colaborador activo" que tiene acceso directo a tu sistema de archivos y terminal.
              </InfoBox>
            </ContentBlock>
          </>
        );
      case 'architecture':
        return (
          <>
            <SectionTitle>Arquitectura Técnica</SectionTitle>
            <SectionSubtitle>Cómo está construido el motor detrás de la autonomía de OpenClaude.</SectionSubtitle>
            <ContentBlock>
              <Subheading>Stack Tecnológico</Subheading>
              <Paragraph>
                OpenClaude está construido sobre una base moderna diseñada para la velocidad y la seguridad:
              </Paragraph>
              <List>
                <ListItem><strong>TypeScript:</strong> Proporciona tipado fuerte para manejar la complejidad de las herramientas y comandos.</ListItem>
                <ListItem><strong>Bun:</strong> Utilizado como runtime y bundler para una ejecución ultrarrápida.</ListItem>
                <ListItem><strong>React + Ink:</strong> Permite la creación de interfaces ricas directamente en la terminal.</ListItem>
                <ListItem><strong>Zod:</strong> Validación estricta de esquemas para todas las entradas y salidas de las herramientas.</ListItem>
              </List>

              <Subheading>El Motor de Consultas (Query Engine)</Subheading>
              <Paragraph>
                El corazón de OpenClaude es el <code>QueryEngine</code>. Este componente orquesta el ciclo de vida de la conversación:
              </Paragraph>
              <List>
                <ListItem><strong>Gestión de Contexto:</strong> Combina archivos <code>CLAUDE.md</code>, el historial de chat y el estado del sistema.</ListItem>
                <ListItem><strong>Compresión de Contexto:</strong> Optimiza el uso de tokens eliminando información redundante sin perder el hilo de la tarea.</ListItem>
                <ListItem><strong>Orquestación de Herramientas:</strong> Decide qué herramienta usar basándose en la intención del usuario y el estado actual del proyecto.</ListItem>
              </List>
              <CodeBlock>
                {`// Ejemplo simplificado del flujo del QueryEngine
                while (task.status === 'in_progress') {
                  const action = await model.decideNextAction(context);
                  const result = await toolExecutor.execute(action);
                  context.update(result);
                  if (result.isFinal) break;
                }`}
              </CodeBlock>
            </ContentBlock>
          </>
        );
      case 'tools':
        return (
          <>
            <SectionTitle>Sistema de Herramientas</SectionTitle>
            <SectionSubtitle>Las capacidades que permiten a OpenClaude interactuar con el mundo real.</SectionSubtitle>
            <ContentBlock>
              <Subheading>Filosofía de Diseño</Subheading>
              <Paragraph>
                Cada herramienta en OpenClaude es un módulo independiente con una definición de esquema JSON. Esto permite que el modelo de IA sepa exactamente qué parámetros requiere y qué salida esperar.
              </Paragraph>

              <Subheading>Categorías de Herramientas</Subheading>
              <InfoBox>
                <strong>📁 Operaciones de Archivos:</strong> Herramientas para leer, escribir y editar archivos con precisión. Incluye <code>GlobTool</code> para búsquedas masivas y <code>GrepTool</code> para encontrar patrones de texto.
              </InfoBox>
              <InfoBox>
                <strong>💻 Ejecución de Código:</strong> <code>BashTool</code> y <code>PowerShellTool</code> permiten ejecutar comandos de terminal, instalar dependencias y correr tests.
              </InfoBox>
              <InfoBox>
                <strong>🌐 Web y Búsqueda:</strong> <code>WebFetchTool</code> y <code>WebSearchTool</code> permiten al agente investigar documentación externa en tiempo real.
              </InfoBox>
              <InfoBox>
                <strong>🤖 Agentes y Tareas:</strong> Herramientas para crear sub-agentes, gestionar listas de tareas y coordinar ejecuciones complejas.
              </InfoBox>
              <InfoBox>
                <strong>🔌 MCP (Model Context Protocol):</strong> Integración con servidores externos para extender las capacidades del modelo con datos y herramientas personalizadas.
              </InfoBox>
            </ContentBlock>
          </>
        );
      case 'commands':
        return (
          <>
            <SectionTitle>Comandos Slash</SectionTitle>
            <SectionSubtitle>Acciones rápidas para controlar el entorno y la sesión.</SectionSubtitle>
            <ContentBlock>
              <Subheading>Gestión de Sesión</Subheading>
              <Paragraph>
                Los comandos slash permiten interactuar con el estado interno de OpenClaude sin necesidad de describir la acción en lenguaje natural.
              </Paragraph>
              <List>
                <ListItem><code>/clear</code>: Limpia el historial de la conversación actual.</ListItem>
                <ListItem><code>/compact</code>: Reduce el tamaño del contexto para ahorrar tokens.</ListItem>
                <ListItem><code>/resume</code>: Recupera una sesión anterior para continuar el trabajo.</ListItem>
              </List>

              <Subheading>Control de Versiones y Git</Subheading>
              <Paragraph>
                OpenClaude integra profundamente las operaciones de Git para facilitar el flujo de desarrollo:
              </Paragraph>
              <List>
                <ListItem><code>/commit</code>: Crea un commit con un mensaje generado inteligentemente basado en los cambios.</ListItem>
                <ListItem><code>/diff</code>: Muestra las diferencias actuales entre el working tree y el último commit.</ListItem>
                <ListItem><code>/review</code>: Inicia un proceso de revisión de código sobre los cambios pendientes.</ListItem>
              </List>

              <Subheading>Sistema y Configuración</Subheading>
              <List>
                <ListItem><code>/config</code>: Permite ajustar los parámetros del sistema y el modelo.</ListItem>
                <ListItem><code>/permissions</code>: Gestiona los permisos de acceso a archivos y comandos de terminal.</ListItem>
                <ListItem><code>/doctor</code>: Diagnostica el estado de la instalación y las dependencias.</ListItem>
              </List>
            </ContentBlock>
          </>
        );
      case 'agentic':
        return (
          <>
            <SectionTitle>Flujo Agentico</SectionTitle>
            <SectionSubtitle>El ciclo de vida de una tarea autónoma en OpenClaude.</SectionSubtitle>
            <ContentBlock>
              <Subheading>El Bucle de Iteración</Subheading>
              <Paragraph>
                A diferencia de la generación de código lineal, OpenClaude utiliza un bucle de retroalimentación constante:
              </Paragraph>
              <List>
                <ListItem><strong>1. Planificación:</strong> El agente analiza la solicitud, explora los archivos relevantes y propone un plan de acción.</ListItem>
                <ListItem><strong>2. Ejecución:</strong> El agente aplica los cambios utilizando las herramientas de edición de archivos y la terminal.</ListItem>
                <ListItem><strong>3. Verificación:</strong> El agente ejecuta tests o comandos de validación para comprobar si la solución funciona.</ListItem>
                <ListItem><strong>4. Refinamiento:</strong> Si se encuentran errores, el agente analiza el fallo y vuelve al paso de planificación para corregirlo.</ListItem>
              </List>
              <InfoBox>
                <strong>Plan Mode:</strong> Cuando se activa el modo de plan, OpenClaude se detiene antes de ejecutar acciones destructivas para que el usuario apruebe la estrategia propuesta.
              </InfoBox>
            </ContentBlock>
          </>
        );
      case 'setup':
        return (
          <>
            <SectionTitle>Configuración y Uso</SectionTitle>
            <SectionSubtitle>Cómo poner en marcha OpenClaude en tu entorno de desarrollo.</SectionSubtitle>
            <ContentBlock>
              <Subheading>Requisitos Previos</Subheading>
              <List>
                <ListItem>Node.js v18+ o Bun (Recomendado).</ListItem>
                <ListItem>Una API Key de un proveedor compatible (OpenRouter, Anthropic, OpenAI, etc.).</ListItem>
                <ListItem>Git instalado en el sistema.</ListItem>
              </List>

              <Subheading>Instalación Rápida</Subheading>
              <CodeBlock>
                # Clonar el repositorio
                git clone https://github.com/Gitlawb/openclaude.git
                cd openclaude

                # Instalar dependencias
                npm install

                # Configurar API Key
                export OPENROUTER_API_KEY='tu_llave_aqui'

                # Iniciar la aplicación
                npm run dev
              </CodeBlock>

              <Subheading>Mejores Prácticas</Subheading>
              <Paragraph>
                Para obtener los mejores resultados, se recomienda crear un archivo <code>CLAUDE.md</code> en la raíz de tu proyecto. Este archivo debe contener:
              </Paragraph>
              <List>
                <ListItem>Guías de estilo de código específicas del proyecto.</ListItem>
                <ListItem>Comandos comunes para build y test.</ListItem>
                <ListItem>Arquitectura general del sistema para dar contexto rápido al agente.</ListItem>
              </List>
            </ContentBlock>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <Sidebar>
        <SidebarLogo onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Terminal size={24} />
          <span>OpenClaude WebUI Docs</span>
        </SidebarLogo>

        <NavSection>
          <NavSectionTitle>Guía General</NavSectionTitle>
          {sections.map(s => (
            <NavItem
              key={s.id}
              $active={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            >
              {s.icon}
              {s.title}
            </NavItem>
          ))}
        </NavSection>
      </Sidebar>

      <MainContainer>
        <ContentArea>
          {renderContent()}
        </ContentArea>
        <DocsFooter>
          <p>
            © {new Date().getFullYear()} OpenClaude WebUI. Creado con ❤️ por{' '}
            <FooterLink href="https://jeremylive.netlify.app" target="_blank" rel="noopener noreferrer">
              Jeremy Live
            </FooterLink>
          </p>
        </DocsFooter>
      </MainContainer>
    </PageWrapper>
  );
};

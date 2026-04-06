import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliPath = path.resolve(__dirname, '..', '..', 'dist', 'cli.mjs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || ''
);

const sessionConfigs = new Map<string, any>();

const handleSendMessage = async (socket: any, message: string) => {
  const config = sessionConfigs.get(socket.id);
  if (!config) {
    socket.emit('error', { text: 'No active session found.' });
    return;
  }

  // 1. Interceptar shortcuts de infraestructura (Manejados por el servidor)
  if (message.startsWith('/')) {
    const [cmd, ...args] = message.split(' ');
    const arg = args.join(' ');

    if (cmd === '/clear') {
      try {
        // Diagnóstico: Verificar si la clave API está cargada
        const apiKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || '';
        console.log(`[Debug] API Key loaded: ${apiKey ? apiKey.substring(0, 8) + '...' : 'NOT LOADED'}`);
        console.log(`[Debug] Clearing chat: ${config.chatId} for user: ${config.userId}`);

        // 1. Verificar cuántos mensajes existen realmente para este chat
        const { count } = await supabase
          .from('livemessages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', config.chatId);

        console.log(`[Debug] Total messages found for chat ${config.chatId}: ${count}`);

        // 2. Intentar borrar SOLO por chat_id (ya que service_role ignora RLS)
        const { data, error: deleteError } = await supabase
          .from('livemessages')
          .delete()
          .eq('chat_id', config.chatId)
          .select();

        if (deleteError) throw deleteError;

        console.log(`Successfully cleared ${data?.length || 0} messages for chat: ${config.chatId}`);
        socket.emit('chat-cleared', { chatId: config.chatId });
        socket.emit('cli-output', { text: `\n✅ Historial de chat limpiado (${data?.length || 0} mensajes) en la base de datos.` });
        socket.emit('cli-closed', { code: 0 });
        return;
      } catch (err) {
        console.error(`Error clearing chat ${config.chatId}:`, err);
        socket.emit('cli-error', { text: `Error clearing chat: ${err}` });
        socket.emit('cli-closed', { code: 1 });
        return;
      }
    }

    if (cmd === '/model') {
      if (arg) {
        config.model = arg;
        sessionConfigs.set(socket.id, config);
        socket.emit('cli-output', { text: `\n✅ Modelo actualizado a: ${arg}` });
        socket.emit('cli-closed', { code: 0 });
        return;
      }
      // Si no hay argumento, dejamos que el flujo continúe hacia el CLI para mostrar la lista de modelos
    }

    if (cmd === '/provider') {
      if (!arg) {
        socket.emit('cli-output', { text: '\n❌ Uso: /provider <nombre-proveedor>' });
        socket.emit('cli-closed', { code: 1 });
        return;
      }
      socket.emit('cli-output', { text: `\n✅ Proveedor actualizado a: ${arg} (Sincronizado con configuración de sesión)` });
      socket.emit('cli-closed', { code: 0 });
      return;
    }

    if (cmd === '/config') {
      const configSummary = `\n⚙️ Configuración Actual:\n- Modelo: ${config.model}\n- BaseURL: ${config.baseUrl}\n- API Key: ${config.apiKey ? '********' : 'No configurada'}`;
      socket.emit('cli-output', { text: configSummary });
      socket.emit('cli-closed', { code: 0 });
      return;
    }
  }

  // 2. Preparar el contexto (Historial)
  let fullPrompt = message;
  const isAgenticShortcut = message.startsWith('/') && (
    !['/clear', '/model', '/provider', '/config'].some(cmd => message.startsWith(cmd)) ||
    ['/model', '/provider', '/config'].includes(message)
  );

  if (!isAgenticShortcut) {
    const { data: history } = await supabase
      .from('livemessages')
      .select('role, content')
      .eq('chat_id', config.chatId)
      .order('created_at', { ascending: true });

    if (history && history.length > 0) {
      const historyContext = history
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      fullPrompt = `Contexto previo:\n${historyContext}\n\nUltimo mensaje: ${message}`;
    }
  }

  console.log(`Processing message: ${message}`);

  // 3. Ejecutar el CLI con el contexto y el directorio de trabajo correcto
  const child = spawn('node', [cliPath, '-p', fullPrompt, '-c'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      CLAUDE_CODE_USE_OPENAI: '1',
      OPENAI_API_KEY: config.apiKey,
      OPENAI_BASE_URL: config.baseUrl,
      OPENAI_MODEL: config.model,
    }
  });

  child.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(`CLI STDOUT: ${text}`);
    socket.emit('cli-output', { text });
  });

  child.stderr.on('data', (data) => {
    const text = data.toString();
    const lowerText = text.toLowerCase();
    if (lowerText.includes('interrupted by user') || lowerText.includes('no stdin data received')) return;
    console.error(`CLI STDERR: ${text}`);
    socket.emit('cli-error', { text });
  });

  child.on('error', (err) => {
    console.error('CLI process error:', err);
    socket.emit('cli-error', { text: `CLI Error: ${err.message}` });
  });

  child.on('close', (code) => {
    console.log(`CLI process exited with code ${code}`);
    socket.emit('cli-closed', { code });
  });
};


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-chat', async ({ chatId, userId, message, providerConfig }) => {
    console.log(`Starting chat for user ${userId}, chat ${chatId}`);
    // Load history from Supabase
    const { data: history } = await supabase
      .from('livemessages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    console.log(`Loaded ${history?.length || 0} messages from history`);

    // Save session config including chatId and userId
    sessionConfigs.set(socket.id, { ...providerConfig, chatId, userId });

    // Send the first message
    if (message) {
      handleSendMessage(socket, message);
    }
  });

  socket.on('send-message', async (payload) => {
    const { message, chatId, userId, providerConfig } = payload || {};

    console.log(`Received send-message event. SocketID: ${socket.id}, ChatID: ${chatId}`);

    if (!message) {
      socket.emit('error', { text: 'No message provided.' });
      return;
    }

    // Recuperación automática de sesión
    if (!sessionConfigs.has(socket.id)) {
      if (!chatId || !userId || !providerConfig) {
        console.error('Missing session metadata in send-message payload:', payload);
        socket.emit('error', { text: 'Session expired or missing. Please refresh the page.' });
        return;
      }
      console.log(`Recovering session for socket ${socket.id} using provided metadata.`);
      sessionConfigs.set(socket.id, { ...providerConfig, chatId, userId });
    }

    handleSendMessage(socket, message);
  });

  socket.on('disconnect', () => {
    sessionConfigs.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`OpenClaude Bridge Server running on port ${PORT}`);
});

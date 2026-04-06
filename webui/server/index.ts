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
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

const sessionConfigs = new Map<string, any>();

const handleSendMessage = (socket: any, message: string) => {
  const config = sessionConfigs.get(socket.id);
  if (!config) {
    socket.emit('error', { text: 'No active session found.' });
    return;
  }

  console.log(`Processing message: ${message}`);

  const child = spawn('node', [cliPath, '-p', message, '-c'], {
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

    // Save session config
    sessionConfigs.set(socket.id, providerConfig);

    // Send the first message
    if (message) {
      handleSendMessage(socket, message);
    }
  });

  socket.on('send-message', ({ message }) => {
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

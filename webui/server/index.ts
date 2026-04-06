import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { spawn } from 'child_process';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

const activeProcesses = new Map<string, any>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('start-chat', async ({ chatId, userId, message, providerConfig }) => {
    // Load history from Supabase
    const { data: history } = await supabase
      .from('livemessages')
      .select('role, content')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    // Spawn OpenClaude CLI
    // In a real scenario, we'd pass history as context to the CLI
    const child = spawn('openclaude', ['--non-interactive'], {
      env: {
        ...process.env,
        CLAUDE_CODE_USE_OPENAI: '1',
        OPENAI_API_KEY: providerConfig.apiKey,
        OPENAI_BASE_URL: providerConfig.baseUrl,
        OPENAI_MODEL: providerConfig.model,
      }
    });

    activeProcesses.set(socket.id, child);

    child.stdout.on('data', (data) => {
      socket.emit('cli-output', { text: data.toString() });
    });

    child.stderr.on('data', (data) => {
      socket.emit('cli-error', { text: data.toString() });
    });

    child.on('close', (code) => {
      socket.emit('cli-closed', { code });
      activeProcesses.delete(socket.id);
    });

    // Send the first message to the CLI
    child.stdin.write(`${message}\n`);
  });

  socket.on('send-message', ({ message }) => {
    const child = activeProcesses.get(socket.id);
    if (child) {
      child.stdin.write(`${message}\n`);
    } else {
      socket.emit('error', { text: 'No active session found.' });
    }
  });

  socket.on('disconnect', () => {
    const child = activeProcesses.get(socket.id);
    if (child) {
      child.kill();
      activeProcesses.delete(socket.id);
    }
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`OpenClaude Bridge Server running on port ${PORT}`);
});

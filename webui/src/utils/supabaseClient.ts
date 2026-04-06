import { createClient } from '@supabase/supabase-js'';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
  {
    auth: {
      localStorage: window.localStorage,
    },
  }
);

export const openClaudeMessages = supabase
  .from('livemessages')
  .select();

export const openClaudeMessagesByChat = (chatId: string) => {
  return supabase
    .from('livemessages')
    .select()
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false });
};

export const openClaudeMessagesInsert = async (data: {
  chat_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_calls?: string;
  tool_results?: string;
}) => {
  const { data, error } = await supabase
    .from('livemessages')
    .insert(data)
    .select();

  if (error) {
    console.error('Error inserting message:', error);
    return null;
  }
  return data[0];
};

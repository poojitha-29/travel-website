import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // This is just a console hint for local setup
  // eslint-disable-next-line no-console
  console.warn(
    '[admin] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. ' +
      'Admin CRUD actions will be disabled until you configure frontend .env.'
  );
}

export const supabaseAdmin =
  url && anonKey ? createClient(url, anonKey) : null;

async function ensureClient() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }
  return supabaseAdmin;
}

export async function adminList(table) {
  const client = await ensureClient();
  const { data, error } = await client.from(table).select('*').order('id');
  if (error) throw error;
  return data;
}

export async function adminInsert(table, values) {
  const client = await ensureClient();
  const { data, error } = await client.from(table).insert(values).select('*').single();
  if (error) throw error;
  return data;
}

export async function adminUpdate(table, id, values) {
  const client = await ensureClient();
  const { data, error } = await client.from(table).update(values).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function adminDelete(table, id) {
  const client = await ensureClient();
  const { error } = await client.from(table).delete().eq('id', id);
  if (error) throw error;
}


export async function adminLogin(username, password) {
  const client = await ensureClient();

  console.log("Trying login with:", username, password);

  const { data, error } = await client
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('password', password);

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error || !data || data.length === 0) {
    throw new Error("Invalid credentials");
  }

  return data[0];
}
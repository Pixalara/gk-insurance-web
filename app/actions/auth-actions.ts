// app/actions/auth-actions.ts
import { supabase } from '../utils/supabaseClient';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  // data has user and session
  return {
    user: data.user,
    session: data.session
  };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  return {
    user: data.user,
    session: data.session
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

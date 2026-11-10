import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
    !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn(
    '[Josefina Fragancias - Supabase] Advertencia: Las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY no están configuradas correctamente. Revisa tu archivo .env o la configuración de entorno en tu plataforma de despliegue (ej. Vercel).'
  );
}

// Fallback seguro para evitar excepciones de inicialización si faltan variables en tiempo de ejecución
const fallbackUrl = supabaseUrl || 'https://placeholder-project.supabase.co';
const fallbackKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(fallbackUrl, fallbackKey);

import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Ce client possède les droits administrateur (Service Role).
// Ne JAMAIS l'utiliser dans un Client Component ou le renvoyer au navigateur.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Opzione per evitare che Next.js metta in cache questa rotta in modo statico
export const dynamic = 'force-dynamic';

/**
 * Questo handler gestisce il callback di autenticazione da Supabase.
 * Quando un utente effettua il login, Supabase lo reindirizza a questo URL
 * con un 'code' nei parametri della query.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Se il codice è presente, lo scambiamo per una sessione utente
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Una volta completato il processo, reindirizziamo l'utente.
  // Qui reindirizziamo alla home page, ma in futuro potresti voler
  // reindirizzare a una dashboard protetta (es. '/dashboard').
  return NextResponse.redirect(requestUrl.origin);
}

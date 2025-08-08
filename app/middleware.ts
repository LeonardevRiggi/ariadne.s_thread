import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Questo middleware viene eseguito prima di ogni richiesta.
 * Il suo scopo è duplice:
 * 1. Aggiornare la sessione utente (fondamentale per l'autenticazione).
 * 2. Proteggere le rotte del "(dashboard)" reindirizzando gli utenti non autenticati.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Aggiorna la sessione dell'utente basandosi sui cookie.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se l'utente non è autenticato e cerca di accedere a una pagina protetta...
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    // ...lo reindirizziamo alla pagina di login.
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configurazione per specificare su quali rotte deve girare il middleware.
export const config = {
  matcher: [
    /*
     * Abbina tutte le rotte eccetto quelle che iniziano con:
     * - _next/static (file statici)
     * - _next/image (ottimizzazione immagini)
     * - favicon.ico (icona)
     * Questo migliora le performance.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

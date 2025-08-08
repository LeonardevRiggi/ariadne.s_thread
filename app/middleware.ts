import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se non c'è una sessione, l'utente viene reindirizzato alla pagina di login.
  // Questa logica viene eseguita solo per le rotte protette definite nel 'matcher' qui sotto.
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Configurazione per specificare su quali rotte deve girare il middleware.
export const config = {
  matcher: [
    /*
     * Abbina tutte le rotte all'interno delle sezioni protette della dashboard.
     * Il middleware NON verrà eseguito sulle pagine pubbliche (marketing, login, etc.).
     */
    '/account/:path*',
    '/patient/:path*',
    '/therapist/:path*',
  ],
};
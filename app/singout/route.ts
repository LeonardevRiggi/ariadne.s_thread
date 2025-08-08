import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const supabase = createRouteHandlerClient({ cookies });

  // Effettua il logout
  await supabase.auth.signOut();

  // Reindirizza l'utente alla home page
  return NextResponse.redirect(`${requestUrl.origin}`, {
    // È importante usare 303 per il reindirizzamento dopo una richiesta POST
    status: 303,
  });
}

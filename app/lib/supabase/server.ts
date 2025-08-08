import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Questo file esporta una funzione che crea un'istanza del client Supabase
 * per l'uso nei Componenti Server.
 * * A differenza del client per il browser, questo client viene creato
 * per ogni richiesta server e ha accesso ai cookie di quella richiesta,
 * permettendo di effettuare operazioni autenticate in modo sicuro sul server.
 */

// Anche qui, la tipizzazione <Database> è consigliata.
// import { Database } from '../database.types'

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({
    cookies: () => cookieStore,
  });
};

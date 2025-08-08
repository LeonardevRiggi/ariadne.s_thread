import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Questo file esporta un'istanza del client Supabase specificamente
 * configurata per l'uso nei Componenti Client (lato browser).
 * * Non è un singleton, quindi ogni componente che lo importa
 * otterrà la sua istanza, ma l'helper gestisce la logica
 * di autenticazione in modo efficiente.
 */

// La tipizzazione <Database> è opzionale ma consigliata per avere
// l'autocompletamento basato sullo schema del tuo database.
// Puoi generarla con il comando:
// npx supabase gen types typescript --project-id TUO_PROJECT_ID > lib/database.types.ts
// e poi importarla qui: import { Database } from '../database.types'

export const supabase = createClientComponentClient();

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, BookOpen, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

// Definiamo esplicitamente il tipo per le props della pagina in modo completo,
// includendo anche i searchParams. Questo risolve l'incompatibilità con i tipi interni di Next.js.
type PatientDetailPageProps = {
  params: { patientId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function PatientDetailPage({ params, searchParams }: PatientDetailPageProps) {
  const { patientId } = params;
  const supabase = createServerComponentClient({ cookies });

  // 1. Verifica la sessione del terapeuta
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  // 2. Recupera i dati del paziente
  const { data: patientProfile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', patientId)
    .single();
  
  // 3. Recupera i diari del paziente
  const { data: journalEntries, error: journalError } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  // TODO: Recuperare i task e le note di sessione

  if (profileError) {
    return <p className="text-red-500">Impossibile trovare il profilo del paziente.</p>;
  }

  return (
    <div>
      {/* Intestazione con nome paziente */}
      <div className="flex items-center mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-600">
          <User className="h-8 w-8" />
        </div>
        <h1 className="ml-4 text-4xl font-bold text-gray-800">{patientProfile.full_name}</h1>
      </div>

      {/* Layout a due colonne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Colonna sinistra: Diari */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center"><BookOpen className="mr-3"/>Diario del Paziente</h2>
          {journalEntries && journalEntries.length > 0 ? (
            journalEntries.map(entry => (
              <div key={entry.id} className="rounded-lg bg-white p-5 shadow">
                <p className="text-sm text-gray-500 mb-2">
                  {format(new Date(entry.created_at), "eeee d MMMM yyyy", { locale: it })}
                </p>
                <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 bg-white p-5 rounded-lg shadow">Nessuna voce nel diario.</p>
          )}
        </div>

        {/* Colonna destra: Compiti e Note */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-4"><CheckSquare className="mr-3"/>Compiti Assegnati</h2>
            <div className="rounded-lg bg-white p-5 shadow">
              {/* TODO: Mappare e mostrare i compiti */}
              <p className="text-gray-500">Funzionalità in arrivo.</p>
              {/* TODO: Form per assegnare un nuovo compito */}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Note di Sessione</h2>
            <div className="rounded-lg bg-white p-5 shadow">
              {/* TODO: Mappare e mostrare le note di sessione */}
              <p className="text-gray-500">Funzionalità in arrivo.</p>
              {/* TODO: Form per aggiungere una nuova nota */}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

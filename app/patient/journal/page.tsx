import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { BookOpen } from 'lucide-react';
import AddJournalEntryForm from '../../../components/AddJournalEntryForm';

// Tipizzazione per le voci del diario
type JournalEntry = {
  id: number;
  content: string;
  created_at: string;
  tags: string[] | null;
};

export default async function PatientJournalPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Recupera le voci del diario per il paziente loggato
  const { data: journalEntries, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('patient_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Errore nel recupero dei diari:", error);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Il Mio Diario</h1>

      {/* Componente per aggiungere una nuova voce */}
      <div className="mb-10">
        <AddJournalEntryForm />
      </div>

      {/* Lista delle voci del diario */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2">Le tue riflessioni</h2>
        {journalEntries && journalEntries.length > 0 ? (
          journalEntries.map((entry: JournalEntry) => (
            <div key={entry.id} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>
                    {format(new Date(entry.created_at), "eeee d MMMM yyyy 'alle' HH:mm", { locale: it })}
                  </span>
                </div>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{entry.content}</p>
              {entry.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 rounded-lg bg-white">
            <p className="text-gray-600">Non hai ancora scritto nulla.</p>
            <p className="text-sm text-gray-500 mt-2">Usa il box qui sopra per iniziare a scrivere la tua prima riflessione.</p>
          </div>
        )}
      </div>
    </div>
  );
}

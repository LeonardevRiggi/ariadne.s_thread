'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';

export default function AddJournalEntryForm() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('journal_entries')
        .insert({ content, patient_id: user.id });

      if (!error) {
        setContent('');
        // Ricarica la pagina per mostrare la nuova voce
        router.refresh();
      } else {
        console.error("Errore nell'inserimento del diario:", error);
        // Qui potresti mostrare un messaggio di errore all'utente
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Cosa ti passa per la testa?</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Scrivi qui i tuoi pensieri, le tue emozioni o gli eventi della giornata..."
          className="w-full h-32 p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition"
          disabled={isSubmitting}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="flex items-center justify-center rounded-md bg-gray-800 px-5 py-2.5 text-white font-semibold shadow-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Salvataggio...' : 'Salva Riflessione'}
          </button>
        </div>
      </form>
    </div>
  );
}

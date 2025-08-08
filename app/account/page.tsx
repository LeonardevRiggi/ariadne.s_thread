'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, LogOut, AlertCircle, CheckCircle } from 'lucide-react';

// Tipizzazione per il profilo utente
type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

export default function AccountPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Funzione per recuperare i dati del profilo
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utente non trovato.");

      setEmail(user.email || null);

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFullName(data.full_name);
      }
    } catch (error: any) {
      setError('Impossibile caricare i dati del profilo.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Carica i dati del profilo al primo render
  useEffect(() => {
    getProfile();
  }, [getProfile]);

  // Funzione per aggiornare il profilo
  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utente non trovato.");

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      setMessage('Profilo aggiornato con successo!');
    } catch (error: any) {
      setError('Errore durante l\'aggiornamento del profilo.');
    } finally {
      setLoading(false);
    }
  }

  // Funzione di Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Reindirizza alla home dopo il logout
    router.refresh();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Il Tuo Account
        </h2>

        {loading ? (
          <p className="text-center text-gray-600">Caricamento...</p>
        ) : (
          <form onSubmit={updateProfile} className="space-y-6">
            {message && (
              <div className="flex items-center rounded-md bg-green-50 p-4 text-sm text-green-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center rounded-md bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mr-2 h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            {/* Campo Email (non modificabile) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input id="email" type="email" value={email || ''} disabled className="block w-full rounded-md border-gray-300 bg-gray-100 pl-10 shadow-sm sm:text-sm" />
              </div>
            </div>

            {/* Campo Nome Completo */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <div className="relative mt-1">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName || ''}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Pulsante di Aggiornamento */}
            <div>
              <button
                type="submit"
                className="w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Aggiornamento...' : 'Aggiorna Profilo'}
              </button>
            </div>
          </form>
        )}

        <div className="my-6 w-full border-t border-gray-300" />

        {/* Pulsante di Logout */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Esci
        </button>
      </div>
    </div>
  );
}

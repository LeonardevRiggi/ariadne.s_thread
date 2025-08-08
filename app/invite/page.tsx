'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { User, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function InvitePage() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Controlla se l'utente è già loggato tramite il link magico
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setError("Link di invito non valido o scaduto. Richiedi un nuovo invito al tuo terapeuta.");
      }
    };
    checkSession();
  }, [supabase]);

  const handleCompleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAuthenticated) {
        setError("Autenticazione richiesta per completare il profilo.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    // 1. Aggiorna la password dell'utente
    const { error: passwordError } = await supabase.auth.updateUser({ password });

    if (passwordError) {
      setError(`Errore nell'impostazione della password: ${passwordError.message}`);
      setIsSubmitting(false);
      return;
    }

    // 2. Aggiorna il nome nel profilo
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id);

        if (profileError) {
            setError(`Errore nell'aggiornamento del profilo: ${profileError.message}`);
            setIsSubmitting(false);
            return;
        }
    }

    setMessage("Profilo completato con successo! Verrai reindirizzato...");
    setTimeout(() => {
      router.push('/patient/journal'); // Reindirizza alla dashboard del paziente
      router.refresh();
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Completa il tuo profilo
        </h2>
        <p className="text-center text-gray-600 mb-6">Benvenuto! Imposta una password per accedere al tuo account.</p>

        {error && (
          <div className="mb-4 flex items-center rounded-md bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-4 flex items-center rounded-md bg-green-50 p-4 text-sm text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleCompleteProfile} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                placeholder="Mario Rossi"
                disabled={!isAuthenticated || isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Nuova Password</label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                placeholder="Almeno 6 caratteri"
                disabled={!isAuthenticated || isSubmitting}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isAuthenticated || isSubmitting}
              className="flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvataggio...' : 'Salva e Accedi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

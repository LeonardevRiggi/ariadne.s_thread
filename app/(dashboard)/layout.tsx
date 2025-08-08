import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se non c'è sessione neanche qui (doppio controllo), reindirizza al login.
  if (!session) {
    redirect('/login');
  }
  
  // Recuperiamo il ruolo dell'utente per mostrare la navigazione corretta.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  const userRole = profile?.role;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 flex-shrink-0 bg-white p-6 shadow-md">
        <nav className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">TheraSync</h2>
          
          {/* Navigazione condizionale basata sul ruolo */}
          {userRole === 'THERAPIST' && (
            <Link href="/therapist/dashboard" className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Dashboard Terapeuta
            </Link>
          )}

          {userRole === 'PATIENT' && (
             <Link href="/patient/journal" className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Il Mio Diario
            </Link>
          )}
          
          <Link href="/account" className="flex items-center rounded-md p-2 text-gray-600 hover:bg-gray-100">
            <User className="mr-3 h-5 w-5" />
            Account
          </Link>
          
          {/* Il form di logout è necessario in un Server Component per chiamare una Server Action */}
          <form action="/auth/signout" method="post">
             <button type="submit" className="flex w-full items-center rounded-md p-2 text-red-600 hover:bg-red-50">
                <LogOut className="mr-3 h-5 w-5" />
                Esci
             </button>
          </form>

        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

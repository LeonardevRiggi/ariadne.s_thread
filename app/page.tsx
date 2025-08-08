import Link from 'next/link';
import { ArrowRight, UserCheck } from 'lucide-react';

/*
  Nota: Per usare le icone 'ArrowRight' e 'UserCheck',
  assicurati di aver installato lucide-react:
  npm install lucide-react
*/

export default function HomePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-8 px-4 text-center">
        
        {/* Logo o Nome App */}
        <div className="mb-4">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Ariadne's Thread
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Un filo da seguire tra una seduta e l'altra.
          </p>
        </div>

        {/* Descrizione */}
        <p className="max-w-2xl text-lg leading-8 text-gray-700 md:text-xl">
          La nostra piattaforma aiuta pazienti e terapeuti a collaborare in modo più efficace, 
          trasformando le intuizioni della terapia in progressi quotidiani.
        </p>

        {/* Call to Action */}
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/login?role=therapist" // Esempio di URL per il login del terapeuta
            className="flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Sei un terapeuta? Accedi
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/invite" // Pagina per chi ha ricevuto un invito
            className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
             Hai ricevuto un invito?
            <UserCheck className="ml-2 h-5 w-5" />
          </Link>
        </div>

      </div>

      {/* Footer minimale */}
      <footer className="absolute bottom-0 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} BeyondX. Tutti i diritti riservati.</p>
      </footer>
    </main>
  );
}

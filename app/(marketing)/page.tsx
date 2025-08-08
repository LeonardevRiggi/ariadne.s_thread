import Link from 'next/link';
import { ArrowRight, UserCheck, HeartHandshake } from 'lucide-react';

/*
  Nota: Per usare le icone, assicurati di aver installato lucide-react:
  npm install lucide-react
*/

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800">
      {/* Header */}
      <header className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-8 w-8 text-gray-800" />
          <span className="text-2xl font-bold">TheraSync</span>
        </div>
        <nav>
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Accedi
          </Link>
        </nav>
      </header>

      {/* Sezione Principale (Hero) */}
      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Un ponte tra una seduta e l'altra
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            La nostra piattaforma aiuta pazienti e terapeuti a collaborare in modo più efficace, 
            trasformando le intuizioni della terapia in progressi quotidiani.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login?role=therapist"
              className="flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform duration-150 ease-in-out hover:scale-105 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Sei un terapeuta?
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/invite"
              className="flex items-center text-base font-semibold leading-6 text-gray-900 transition-transform duration-150 ease-in-out hover:scale-105"
            >
              Hai ricevuto un invito? <UserCheck className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Altre sezioni (Features, Testimonials, etc.) possono essere aggiunte qui */}

      </main>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TheraSync. Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, PlusCircle } from 'lucide-react';

export default async function TherapistDashboard() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Query per ottenere i pazienti collegati a questo terapeuta
  const { data: patients, error } = await supabase
    .from('therapist_patient_relationships')
    .select('profiles(id, full_name, avatar_url)')
    .eq('therapist_id', session.user.id);

  if (error) {
    console.error('Error fetching patients:', error);
    // Potresti mostrare un messaggio di errore qui
  }
  
  // @ts-ignore
  const patientProfiles = patients ? patients.map(p => p.profiles) : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">I Tuoi Pazienti</h1>
        <button className="flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900">
          <PlusCircle className="mr-2 h-5 w-5" />
          Invita Paziente
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {patientProfiles && patientProfiles.length > 0 ? (
          patientProfiles.map((patient:any) => (
            patient && (
              <Link href={`/therapist/patient/${patient.id}`} key={patient.id}>
                <div className="transform cursor-pointer rounded-lg bg-white p-6 shadow transition-all hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-semibold text-gray-900">{patient.full_name}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))
        ) : (
          <p className="text-gray-600">Non hai ancora nessun paziente. Invita il primo!</p>
        )}
      </div>
    </div>
  );
}

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CheckSquare, Circle } from 'lucide-react';
import TaskItem from '../../components/TaskItem';

// Tipizzazione per un singolo task
export type Task = {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
};

export default async function PatientTasksPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Recupera i compiti per il paziente loggato
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('patient_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Errore nel recupero dei compiti:", error);
  }

  const completedTasks = tasks?.filter(task => task.is_completed) || [];
  const pendingTasks = tasks?.filter(task => !task.is_completed) || [];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">I Miei Compiti</h1>
      
      <div className="space-y-8">
        {/* Sezione Compiti da Fare */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <Circle className="mr-3 h-6 w-6 text-yellow-500" />
            Da Completare
          </h2>
          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <p className="text-gray-500 bg-white p-5 rounded-lg shadow-sm">Nessun compito da completare. Ottimo lavoro!</p>
            )}
          </div>
        </div>

        {/* Sezione Compiti Completati */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <CheckSquare className="mr-3 h-6 w-6 text-green-500" />
            Completati
          </h2>
          <div className="space-y-3">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            ) : (
              <p className="text-gray-500 bg-white p-5 rounded-lg shadow-sm">Non hai ancora completato nessun compito.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

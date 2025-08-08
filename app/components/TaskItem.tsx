'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Task } from '@/app/patient/tasks/page'; // Importa il tipo
import { Check, Circle } from 'lucide-react';

export default function TaskItem({ task }: { task: Task }) {
  const [isCompleted, setIsCompleted] = useState(task.is_completed);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    const newStatus = !isCompleted;

    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: newStatus, completed_at: newStatus ? new Date().toISOString() : null })
      .eq('id', task.id);

    if (error) {
      console.error("Errore nell'aggiornamento del compito:", error);
      // Potresti voler ripristinare lo stato o mostrare un errore
    } else {
      setIsCompleted(newStatus);
      // Ricarica i dati del server per aggiornare le liste
      router.refresh(); 
    }
    setIsUpdating(false);
  };

  return (
    <div className={`flex items-center rounded-lg bg-white p-4 shadow-sm transition-all duration-300 ${isCompleted ? 'opacity-60' : 'opacity-100'}`}>
      <button
        onClick={handleToggleComplete}
        disabled={isUpdating}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors
          ${isCompleted ? 'border-green-500 bg-green-500' : 'border-gray-400 bg-transparent'}
          ${isUpdating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {isCompleted && <Check className="h-4 w-4 text-white" />}
      </button>
      <span className={`ml-4 text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
        {task.title}
      </span>
    </div>
  );
}

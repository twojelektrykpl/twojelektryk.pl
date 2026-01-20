
export enum TaskStatus {
  PENDING = 'Oczekujące',
  IN_PROGRESS = 'W trakcie',
  COMPLETED = 'Zakończone'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  clientName: string;
  address: string;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  timeSpentMinutes?: number;
  workerNotes?: string;
  priority: 'low' | 'medium' | 'high';
  photoAfter?: string; // base64
  completedBy?: string; // New field for worker selection
}

export interface AppState {
  tasks: Task[];
  userRole: 'worker' | 'client';
}

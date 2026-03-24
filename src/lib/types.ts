export type HabitCategory = 'Health' | 'Learning' | 'Productivity' | 'Personal' | 'Other';

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  color: string;
  targetPerWeek: number;
  reminders: string[]; // array of HH:mm
  createdAt: string;
}

export interface HabitLog {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface UserProfile {
  name: string;
  avatar?: string;
  goal?: string;
}
export interface Habbit {
    id: number;
    title: string;
    date: string;
    frequency: string;
    category: string;
    progress: string;
    isOpen: boolean;
    completed: boolean;
    isSelected: boolean;
  }
  
  export type ActionMode = 'none' | 'edit' | 'delete';
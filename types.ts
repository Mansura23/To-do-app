
export type TaskStatus = 'Pending' | 'Completed';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Workspace {
  id: string;
  name: string;
  icon: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  workspaceId: string;
  categoryId?: string;
  createdAt: number;
}

export type ViewType = 'Inbox' | 'Analytics' | string; // string is workspaceId

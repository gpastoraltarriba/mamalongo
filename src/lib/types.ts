export type ListId = "todo" | "doing" | "done";

export interface Card {
  id: string;
  boardId: string;
  listId: ListId;
  title: string;              
  description?: string;
  assigneeUid?: string;       
  dueDate?: string;           
  createdAt: number;
  updatedAt: number;
}
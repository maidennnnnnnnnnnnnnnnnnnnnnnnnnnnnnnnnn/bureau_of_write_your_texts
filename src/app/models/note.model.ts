export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface BlogPost {
  id: number;
  authorId: number;
  categoryId: number;
  title: string;
  content: string;
  date: Date;
}
import { z } from 'zod';

export const ClueSchema = z.object({
  value: z.number().int().min(100).max(500),
  question: z.string().min(3),
  answer: z.string().min(1)
});

export const CategorySchema = z.object({
  title: z.string().min(1),
  clues: z.array(ClueSchema).length(5)
});

export const BoardSchema = z.object({
  categories: z.array(CategorySchema).length(5)
});

export function validateBoard(data) {
  return BoardSchema.safeParse(data);
}


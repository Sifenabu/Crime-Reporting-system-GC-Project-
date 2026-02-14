import { z } from "zod";
export const createPostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
    categoryId: z.number().optional()
});

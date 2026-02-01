import { z } from "zod";

export const noticeSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(5),
    description: z.string().min(10),
    type: z.enum(["ALERT", "NOTICE", "EVENT", "WANTED", "INFO"]),
    severity: z.enum(["HIGH", "MEDIUM", "LOW"]),
    isPublished: z.boolean(),
});

export type NoticeFormData = z.infer<typeof noticeSchema>;

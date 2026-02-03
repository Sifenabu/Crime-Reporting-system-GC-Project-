import { prisma } from "../../config/db";
export const blogRepo = {
    create: (data: any) => prisma.blogPost.create({ data }),
    findPublished: () => prisma.blogPost.findMany({ where: { status: "PUBLISHED" } })
};

// src/modules/contact/contact.repository.ts
import { prisma } from "../../config/db";

export const contactRepo = {
    create: (data: any) => prisma.contactMessage.create({ data }),
    findAll: () => prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        include: { handledBy: { select: { fullName: true } } }
    }),
    findById: (id: string) => prisma.contactMessage.findUnique({ where: { id } }),
    update: (id: string, data: any) => prisma.contactMessage.update({ where: { id }, data }),
    delete: (id: string) => prisma.contactMessage.delete({ where: { id } })
};
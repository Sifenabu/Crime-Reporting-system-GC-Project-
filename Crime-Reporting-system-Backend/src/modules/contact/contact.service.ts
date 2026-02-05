// src/modules/contact/contact.service.ts
import { contactRepo } from "./contact.repository";
import { prisma } from "../../config/db";

export async function submitContactService(payload: any) {
    // Normalize name inputs into firstName/lastName as required by the Prisma model
    let firstName = payload.firstName;
    let lastName = payload.lastName;
    if (!firstName && !lastName && payload.name) {
        const parts = String(payload.name).trim().split(/\s+/);
        firstName = parts.shift() || "";
        lastName = parts.join(" ") || "";
    }

    const createData: any = {
        firstName: firstName || "",
        lastName: lastName || "",
        email: payload.email,
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message,
    };

    const rec = await contactRepo.create(createData);

    // Notify Admins
    const admins = await prisma.user.findMany({ where: { role: { name: "ADMIN" } } });
    const senderName = `${(rec as any).firstName ?? ""} ${(rec as any).lastName ?? ""}`.trim();
    for (const a of admins) {
        await prisma.notification.create({
            data: {
                userId: a.id,
                type: "CONTACT_MESSAGE",
                title: `New Contact: ${rec.subject}`,
                body: `From: ${senderName}`,
                data: { contactId: rec.id } as any
            }
        });
    }
    return rec;
}

export async function listContactsService() {
    return contactRepo.findAll();
}

export async function getContactService(id: string) {
    return contactRepo.findById(id);
}

export async function updateContactStatusService(id: string, adminId: string, data: any) {
    return contactRepo.update(id, {
        ...data,
        handledById: adminId,
        handledAt: new Date()
    });
}

export async function deleteContactService(id: string) {
    return contactRepo.delete(id);
}

export async function replyContactService(id: string, adminId: string, message: string) {
    // In a real app, this might send an email. 
    // Here we update the status to RESOLVED and save the message as notes.
    return contactRepo.update(id, {
        status: "RESOLVED",
        notes: message,
        handledById: adminId,
        handledAt: new Date()
    });
}
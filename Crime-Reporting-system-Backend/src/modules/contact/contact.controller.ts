// src/modules/contact/contact.controller.ts
import { Request, Response } from "express";
import * as service from "./contact.service";
import { contactSchema, updateStatusSchema } from "./contact.validation";

export async function submitContactController(req: Request, res: Response) {
    try {
        const data = contactSchema.parse(req.body);
        const msg = await service.submitContactService(data);
        res.status(201).json(msg);
    } catch (err: any) {
        res.status(400).json({ error: err.errors || String(err) });
    }
}

export async function listContactsController(req: Request, res: Response) {
    try {
        const list = await service.listContactsService();
        res.json(list);
    } catch (err) {
        res.status(400).json({ error: String(err) });
    }
}

export async function getContactController(req: Request, res: Response) {
    try {
        const item = await service.getContactService(req.params.id);
        if (!item) return res.status(404).json({ error: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(400).json({ error: String(err) });
    }
}

export async function updateContactController(req: any, res: Response) {
    try {
        const data = updateStatusSchema.parse(req.body);
        const result = await service.updateContactStatusService(req.params.id, req.user.id, data);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.errors || String(err) });
    }
}

export async function deleteContactController(req: Request, res: Response) {
    try {
        await service.deleteContactService(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(400).json({ error: "Failed to delete" });
    }
}

export async function replyContactController(req: any, res: Response) {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Reply message is required" });

        const result = await service.replyContactService(req.params.id, req.user.id, message);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message || "Failed to send reply" });
    }
}
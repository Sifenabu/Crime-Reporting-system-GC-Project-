// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { loginService, registerService, meService } from "./auth.service";

export async function loginController(req: Request, res: Response) {
    try {
        const body = req.body;
        const result = await loginService(body.email, body.password);
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: String(err) });
    }
}

export async function registerController(req: Request, res: Response) {
    try {
        const body = req.body;
        const user = await registerService(body);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(400).json({ error: String(err) });
    }
}

export async function meController(req: any, res: Response) {
    try {
        const user = await meService(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: String(err) });
    }
}

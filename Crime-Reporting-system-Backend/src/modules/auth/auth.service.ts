// src/modules/auth/auth.service.ts
import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken } from "../../utils/jwt.util";
import { RoleName } from "@prisma/client";  // ← ADD THIS IMPORT

export async function registerService(data: {
    fullName?: string;
    name?: string;
    email: string;
    password: string;
    phone?: string;
}) {
    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
    if (existing) throw new Error("Email already exists");

    // Default to CITIZEN for public registration
    const citizenRole = await prisma.role.findUnique({
        where: { name: RoleName.CITIZEN }
    });

    if (!citizenRole) {
        throw new Error("System error: CITIZEN role not found. Run seed first.");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
        data: {
            fullName: data.fullName || data.name || "Citizen User",
            email: data.email.toLowerCase(),
            phone: data.phone || null,
            passwordHash,
            roleId: citizenRole.id,  // ← ALWAYS CITIZEN FOR PUBLIC REGISTRATION
        },
    });

    return { id: user.id, email: user.email, fullName: user.fullName };
}

export async function loginService(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { role: true }
    });

    if (!user) throw new Error("Invalid credentials");

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");

    const token = signToken(
        { sub: user.id, role: user.role.name as RoleName },
        "8h"
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role.name,
        },
    };
}

// meService stays the same
export async function meService(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });
    if (!user) throw new Error("User not found");
    return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name,
    };
}
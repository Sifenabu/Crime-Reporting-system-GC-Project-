// src/modules/officers/officers.service.ts
import { prisma } from "../../config/db";
import { OfficerAvailability, SkillLevel } from "@prisma/client";
import { hashPassword } from "../../utils/hash.util";

/* ===========================
   CREATE OFFICER
=========================== */
export async function createOfficer(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    badgeNumber?: string;
    rank?: string;
    availability?: OfficerAvailability;
    stationId?: number;

    // OfficerDetails
    dateOfBirth?: string;
    gender?: string;
    maritalStatus?: string;
    education?: string;
    biography?: string;
    yearsOfService?: number;
    emergencyPhone?: string;
    address?: string;

    // OfficerBrand
    displayName?: string;
    tagline?: string;
    publicBio?: string;
    achievements?: string;
    socialLinks?: any;
    profileImage?: string;
    profileImagePublicId?: string;

    // Skills
    skills?: string[];

    createdById: string;
}) {
    const hashed = await hashPassword(data.password);

    return prisma.$transaction(async (tx) => {
        /* 1️⃣ User */
        const user = await tx.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                passwordHash: hashed,
                phone: data.phone,
                role: { connect: { name: "OFFICER" } },
            },
        });

        /* 2️⃣ OfficerProfile */
        const profile = await tx.officerProfile.create({
            data: {
                userId: user.id,
                badgeNumber: data.badgeNumber,
                rank: data.rank,
                availability: data.availability ?? OfficerAvailability.OFF_DUTY,
                stationId: data.stationId != null ? Number(data.stationId) : null,
                maxActiveCases: 10,
            },
        });

        /* 3️⃣ OfficerDetails (safe create) */
        await tx.officerDetails.create({
            data: {
                officerId: profile.id,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                gender: data.gender,
                maritalStatus: data.maritalStatus as any,
                education: data.education,
                biography: data.biography,
                yearsOfService: data.yearsOfService,
                emergencyPhone: data.emergencyPhone,
                address: data.address,
            },
        });

        /* 4️⃣ OfficerBrand */
        await tx.officerBrand.create({
            data: {
                officerId: profile.id,
                displayName: data.displayName || data.fullName,
                tagline: data.tagline,
                publicBio: data.publicBio,
                achievements: data.achievements,
                socialLinks: data.socialLinks,
                profileImage: data.profileImage,
                profileImagePublicId: data.profileImagePublicId,
            },
        });

        /* 5️⃣ Reputation & Stats */
        await tx.officerReputation.create({ data: { officerId: profile.id } });
        await tx.officerCaseStats.create({ data: { officerId: profile.id } });

        /* 6️⃣ Skills (deduplicated) */
        if (data.skills?.length) {
            const uniqueSkills = [...new Set(data.skills)];
            await tx.officerSkill.createMany({
                data: uniqueSkills.map((skill) => ({
                    officerId: profile.id,
                    skill: skill as any,
                    level: SkillLevel.INTERMEDIATE,
                    certified: false,
                })),
            });
        }

        return tx.officerProfile.findUnique({
            where: { id: profile.id },
            include: {
                user: { select: { fullName: true, email: true, phone: true } },
                profileDetails: true,
                brand: true,
                skills: true,
                reputation: true,
                caseStats: true,
                station: true,
                assignments: { include: { report: true } },
            },
        });
    });
}

/* ===========================
   GET ALL OFFICERS
=========================== */
export function getOfficers() {
    return prisma.officerProfile.findMany({
        include: {
            user: { select: { fullName: true, email: true, phone: true } },
            profileDetails: true,
            brand: true,
            skills: true,
            reputation: true,
            caseStats: true,
            station: true,
            assignments: {
                where: { report: { status: { not: "CLOSED" } } },
                include: { report: true },
            },
        },
    });
}

/* ===========================
   GET SINGLE OFFICER
=========================== */
export async function getOfficer(id: string) {
    const officer = await prisma.officerProfile.findUnique({
        where: { id },
        include: {
            user: { select: { fullName: true, email: true, phone: true } },
            profileDetails: true,
            brand: true,
            skills: true,
            reputation: true,
            caseStats: true,
            station: true,
            assignments: { include: { report: true } },
        },
    });

    if (!officer) throw new Error("Officer not found");
    return officer;
}

/* ===========================
   UPDATE OFFICER (NO ROLLBACK)
=========================== */
export async function updateOfficer(officerId: string, data: any) {
    return prisma.$transaction(async (tx) => {
        /* OfficerProfile */
        await tx.officerProfile.update({
            where: { id: officerId },
            data: {
                badgeNumber: data.badgeNumber,
                rank: data.rank,
                availability: data.availability,
                stationId: data.stationId != null ? Number(data.stationId) : undefined,
            },
        });

        /* OfficerDetails (UPSERT = no rollback) */
        await tx.officerDetails.upsert({
            where: { officerId },
            update: {
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                gender: data.gender,
                maritalStatus: data.maritalStatus,
                education: data.education,
                biography: data.biography,
                yearsOfService: data.yearsOfService,
                emergencyPhone: data.emergencyPhone,
                address: data.address,
            },
            create: {
                officerId,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            },
        });

        /* OfficerBrand (UPSERT) */
        await tx.officerBrand.upsert({
            where: { officerId },
            update: {
                displayName: data.displayName,
                tagline: data.tagline,
                publicBio: data.publicBio,
                achievements: data.achievements,
                socialLinks: data.socialLinks,
                profileImage: data.profileImage,
                profileImagePublicId: data.profileImagePublicId,
            },
            create: {
                officerId,
                displayName: data.displayName,
            },
        });

        /* Skills */
        if (Array.isArray(data.skills)) {
            await tx.officerSkill.deleteMany({ where: { officerId } });

            const uniqueSkills = [...new Set(data.skills)] as string[];
            if (uniqueSkills.length) {
                await tx.officerSkill.createMany({
                    data: uniqueSkills.map((skill: string) => ({
                        officerId,
                        skill: skill as any,
                        level: SkillLevel.INTERMEDIATE,
                    })),
                });
            }
        }

        return getOfficer(officerId);
    });
}

/* ===========================
   DELETE OFFICER
=========================== */
export async function deleteOfficer(officerId: string) {
    return prisma.$transaction(async (tx) => {
        await tx.assignment.deleteMany({ where: { officerId } });
        await tx.officerSkill.deleteMany({ where: { officerId } });
        await tx.officerDetails.deleteMany({ where: { officerId } });
        await tx.officerBrand.deleteMany({ where: { officerId } });
        await tx.officerReputation.deleteMany({ where: { officerId } });
        await tx.officerCaseStats.deleteMany({ where: { officerId } });

        const profile = await tx.officerProfile.delete({ where: { id: officerId } });
        await tx.user.delete({ where: { id: profile.userId } });

        return { success: true };
    });
}

/* ===========================
   CASE HELPERS
=========================== */
export async function incrementActiveCases(officerId: string) {
    await prisma.officerCaseStats.update({
        where: { officerId },
        data: {
            activeCases: { increment: 1 },
            lastAssignedAt: new Date(),
        },
    });
}

export async function closeCaseForOfficer(officerId: string) {
    await prisma.officerCaseStats.update({
        where: { officerId },
        data: {
            activeCases: { decrement: 1 },
            closedCases: { increment: 1 },
            lastClosedAt: new Date(),
        },
    });
}

export async function getOnDutyOfficers() {
    const officers = await prisma.officerProfile.findMany({
        where: {
            availability: "ON_DUTY",
        },
        select: {
            id: true,
            activeCaseCount: true,
            user: {
                select: {
                    fullName: true,
                },
            },
            reputation: {
                select: {
                    rating: true,
                },
            },
        },
    });

    // Transform to match frontend Officer interface
    return officers.map(o => ({
        id: o.id,
        user: o.user,
        activeCaseCount: o.activeCaseCount,
        reputation: o.reputation || { rating: 0 }, // fallback if null
    }));
}

// import { prisma } from "../../config/db";
// import { OfficerAvailability } from "@prisma/client";
// import { hashPassword } from "../../utils/hash.util";

// export async function createOfficer(data: {
//     fullName: string;
//     email: string;
//     password: string;
//     phone?: string;
//     badgeNumber: string;
//     rank: string;
//     availability: OfficerAvailability;
//     currentLat?: number;
//     currentLng?: number;
//     maxActiveCases?: number;
// }) {
//     const hashed = await hashPassword(data.password);

//     const user = await prisma.user.create({
//         data: {
//             fullName: data.fullName,
//             email: data.email,
//             passwordHash: hashed,
//             phone: data.phone,
//             role: { connect: { name: "OFFICER" } },
//         },
//     });

//     const profile = await prisma.officerProfile.create({
//         data: {
//             userId: user.id,
//             badgeNumber: data.badgeNumber,
//             rank: data.rank,
//             availability: data.availability,
//             currentLat: data.currentLat,
//             currentLng: data.currentLng,
//             maxActiveCases: data.maxActiveCases || 10,
//         },
//     });

//     return { user, profile };
// }

// export async function getOfficers() {
//     return prisma.officerProfile.findMany({
//         include: {
//             user: { select: { id: true, fullName: true, email: true, phone: true, role: true } },
//             assignments: true,  // for case count
//         },
//     });
// }

// export async function getOfficer(officerId: string) {
//     const profile = await prisma.officerProfile.findUnique({
//         where: { id: officerId },
//         include: {
//             user: { select: { id: true, fullName: true, email: true, phone: true, role: true } },
//             assignments: true,  // for case count
//         },
//     });

//     if (!profile) throw new Error("Officer not found");

//     const caseCount = profile.assignments.length;

//     return { ...profile, caseCount };
// }

// export async function updateOfficer(officerId: string, data: {
//     badgeNumber?: string;
//     rank?: string;
//     availability?: OfficerAvailability;
//     currentLat?: number;
//     currentLng?: number;
//     maxActiveCases?: number;
// }) {
//     return prisma.officerProfile.update({
//         where: { id: officerId },
//         data,
//     });
// }

// export async function deleteOfficer(officerId: string) {
//     const profile = await prisma.officerProfile.findUnique({ where: { id: officerId } });
//     if (!profile) throw new Error("Officer not found");

//     await prisma.officerProfile.delete({ where: { id: officerId } });
//     await prisma.user.delete({ where: { id: profile.userId } });

//     return { success: true };
// }
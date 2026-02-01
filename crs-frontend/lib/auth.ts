// // Authentication utility functions for Officer Portal

// export interface OfficerUser {
//     [x: string]: string | null;
//     id: string
//     email: string
//     fullName: string
//     token: string;
//     role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "OFFICER"
// }

// // Check if user is authenticated
// export function isAuthenticated(): boolean {
//     if (typeof window === "undefined") return false
//     const token = localStorage.getItem("officerToken")
//     return !!token
// }

// // Get current user from localStorage
// export function getUser(): OfficerUser | null {
//     if (typeof window === "undefined") return null
//     const userStr = localStorage.getItem("officerUser")
//     if (!userStr) return null
//     try {
//         return JSON.parse(userStr) as OfficerUser
//     } catch {
//         return null
//     }
// }

// // Get auth token
// export function getToken(): string | null {
//     if (typeof window === "undefined") return null
//     return localStorage.getItem("officerToken")
// }

// // Save auth data after login
// export function saveAuthData(token: string, user: OfficerUser): void {
//     localStorage.setItem("officerToken", token)
//     localStorage.setItem("officerUser", JSON.stringify(user))
// }

// // Clear auth data on logout
// export function clearAuthData(): void {
//     localStorage.removeItem("officerToken")
//     localStorage.removeItem("officerUser")
// }

// // Logout function
// export function logout(): void {
//     clearAuthData()
//     if (typeof window !== "undefined") {
//         window.location.href = "/officer/login"
//     }
// }

// // Get user initials for avatar
// export function getUserInitials(fullName: string): string {
//     const names = fullName.split(" ")
//     if (names.length >= 2) {
//         return `${names[0][0]}${names[1][0]}`.toUpperCase()
//     }
//     return fullName.substring(0, 2).toUpperCase()
// }

// // Role-based permission checks
// export function canManageOfficers(role: OfficerUser["role"]): boolean {
//     return role === "SUPER_ADMIN" || role === "ADMIN"
// }

// export function canManageReports(role: OfficerUser["role"]): boolean {
//     return role === "SUPER_ADMIN" || role === "ADMIN" || role === "OPERATOR"
// }


// // export type OfficerUser = {
// // token: string;
// // role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR";
// // };

// export function getOfficerUser(): OfficerUser | null {
//     if (typeof window === "undefined") return null;

//     const raw = localStorage.getItem("officerUser");
//     return raw ? JSON.parse(raw) : null;
// }


// lib/auth.ts - FINAL FIXED VERSION

export interface OfficerUser {
    badgeId: string | null;
    id: string;
    email: string;
    fullName: string;
    token: string;
    role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "OFFICER";
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("officerToken");
    return !!token;
}

// Get current user (now with token embedded)
export function getUser(): OfficerUser | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("officerUser");
    if (!userStr) return null;

    try {
        const user = JSON.parse(userStr) as OfficerUser;
        console.log("[getUser] Loaded:", {
            id: user.id,
            hasToken: !!user.token,
            tokenPreview: user.token ? user.token.substring(0, 20) + "..." : "MISSING",
        });
        return user;
    } catch (e) {
        console.error("[getUser] Parse error:", e);
        return null;
    }
}

// Alias for compatibility
export const getOfficerUser = getUser;

// Get token (prefer embedded, fallback to separate key)
export function getToken(): string | null {
    if (typeof window === "undefined") return null;

    // Primary: embedded in user
    const user = getUser();
    if (user?.token) return user.token;

    // Fallback: separate key
    return localStorage.getItem("officerToken");
}

// Save auth data - FIXED: always embed token inside user
export function saveAuthData(
    token: string,
    userData: {
        id: string;
        email: string;
        fullName: string;
        role: "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "OFFICER";
    }
): void {
    const fullUser: OfficerUser = {
        ...userData,
        token,
        badgeId: null
    };

    localStorage.setItem("officerToken", token);
    localStorage.setItem("officerUser", JSON.stringify(fullUser));

    console.log("[saveAuthData] SUCCESS:", {
        tokenPreview: token.substring(0, 20) + "...",
        userWithToken: fullUser,
    });
}

// Clear auth
export function clearAuthData(): void {
    localStorage.removeItem("officerToken");
    localStorage.removeItem("officerUser");
}

// Logout
export function logout(): void {
    clearAuthData();
    if (typeof window !== "undefined") {
        window.location.href = "/officer/login";
    }
}

// Initials
export function getUserInitials(fullName: string): string {
    const names = fullName.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return fullName.substring(0, 2).toUpperCase();
}

// Permissions
export function canManageOfficers(role: OfficerUser["role"]): boolean {
    return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canManageReports(role: OfficerUser["role"]): boolean {
    return role === "SUPER_ADMIN" || role === "ADMIN" || role === "OPERATOR";
}




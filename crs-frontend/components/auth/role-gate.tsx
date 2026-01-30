"use client";

import { useEffect, useState } from "react";
import { getUser, type OfficerUser } from "@/lib/auth";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const [user, setUser] = useState<OfficerUser | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Or a "Forbidden" message
  }

  return <>{children}</>;
};

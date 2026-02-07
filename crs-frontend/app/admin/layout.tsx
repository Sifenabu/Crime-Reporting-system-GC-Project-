"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { isAuthenticated, getUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check auth immediately
    const isAuth = isAuthenticated();
    const user = getUser();

    if (isAuth && user?.id) {
        // Enforce Admin Roles
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
            setIsAuthorized(true);
        } else {
             router.replace("/officer/unauthorized");
        }
    } else {
      // If not auth, kick them to login
      router.replace("/officer/login");
    }
  }, [router]);

  // While we are verifying the token, show a clean loader
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-blue-900" />
          <p className="text-sm text-muted-foreground font-medium">
            Verifying Admin Access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <OfficerSidebar />
      <main className="flex-1 ml-64 p-6 transition-all">{children}</main>
    </div>
  );
}

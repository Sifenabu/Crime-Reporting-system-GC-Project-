"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { CrimeMapView } from "@/components/map/crime-map-view";

export default function MapPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("officerUser");
    if (!storedUser) {
      router.push("/officer/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [router]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background">
      <OfficerSidebar />
      <main className="flex-1 overflow-hidden">
        <CrimeMapView />
      </main>
    </div>
  );
}

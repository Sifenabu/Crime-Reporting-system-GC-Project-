"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { getUser } from "@/lib/auth";

export function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();
  const user = getUser();

  // 1. Initial Fetch
  const { data } = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken");
      if (!token) return { unreadCount: 0 };
      
      const res = await fetch("http://localhost:4000/api/notifications?limit=1", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { unreadCount: 0 };
      return res.json();
    },
    refetchInterval: 60000, // Sync every minute as backup
  });

  useEffect(() => {
    if (data?.unreadCount !== undefined) {
      setUnreadCount(data.unreadCount);
    }
  }, [data]);

  // 2. Real-time Updates
  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("officerToken");
    const socket = io("http://localhost:4000", {
        auth: { token },
    });

    socket.on("connect", () => {
        socket.emit("joinRoom", `user_${user.id}`);
        if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
            socket.emit("joinRoom", "admin");
        }
    });

    // Increment on new notification
    socket.on("new-notification", () => {
        setUnreadCount((prev) => prev + 1);
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    // Decrement on read (optional, if implementing global sync)
    socket.on("notification-read", () => {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, queryClient]);

  if (unreadCount === 0) return null;

  return (
    <Badge 
      variant="destructive" 
      className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] bg-red-600 hover:bg-red-700"
    >
      {unreadCount > 99 ? "99+" : unreadCount}
    </Badge>
  );
}

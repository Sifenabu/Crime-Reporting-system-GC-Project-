"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Map,
  Bell,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ShieldAlert,
  Mail,
  LogOut,
  Bot,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUser, getUserInitials, logout, type OfficerUser } from "@/lib/auth";
import { toast } from "sonner";
import { NotificationBadge } from "@/components/ui/notification-badge"; // ← ADD THIS

// 1. Define allowed roles for each link
const navLinks = [
  {
    href: "/officer/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "OFFICER"],
  },
  {
    href: "/officer/reports",
    label: "Reports",
    icon: ShieldAlert,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  },
  {
    href: "/officer/cases",
    label: "Cases",
    icon: FileText,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "OFFICER"],
  },
  {
    href: "/officer/blog",
    label: "Community Blog",
    icon: BookOpen,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    href: "/officer/contact",
    label: "Contact Messages",
    icon: Mail,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  },
  {
    href: "/officer/map-two",
    label: "Map View",
    icon: Map,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "OFFICER"],
  },
  {
    href: "/officer/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR", "OFFICER"],
  },
  {
    href: "/officer/officers",
    label: "Officers",
    icon: Users,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    href: "/officer/notices",
    label: "Safety Notices",
    icon: Bell,
    roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"],
  },
  {
    href: "/officer/ai-analysis",
    label: "AI Analysis",
    icon: Bot,
    roles: ["SUPER_ADMIN"],
  },
];

export function OfficerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<OfficerUser | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
  }, []);

  // 2. Filter links based on current user's role
  const filteredLinks = useMemo(() => {
    if (!user) return [];
    return navLinks.filter((link) => link.roles.includes(user.role));
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-[#272F38] text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-blue-800">
        {!collapsed && (
          <Link href="/officer/dashboard" className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <span className="text-xl font-bold">Officer Portal</span>
          </Link>
        )}
        {collapsed && (
          <Link
            href="/officer/dashboard"
            className="flex justify-center w-full"
          >
            <Shield className="h-8 w-8" />
          </Link>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* 3. Map over filteredLinks instead of navLinks */}
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 text-white hover:bg-blue-800",
                  isActive && "bg-blue-800",
                  collapsed && "justify-center px-3"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                    <span className="text-base w-full flex items-center justify-between">
                        {link.label}
                        {link.label === "Notifications" && <NotificationBadge />}
                    </span>
                )}
                {/* Show dot if collapsed? Optional UX choice */}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Profile and Collapse sections remain the same... */}
      <div className="p-4 border-t border-blue-800">
        {!collapsed && user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 mb-2 h-auto py-3 px-3 hover:bg-blue-800"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-cyan-500 text-white font-semibold">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-blue-300 truncate capitalize">
                    {user.role.replace(/_/g, " ").toLowerCase()}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-default">
                <span className="text-xs truncate text-muted-foreground">
                  {user.email}
                </span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="w-full text-white hover:bg-blue-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}

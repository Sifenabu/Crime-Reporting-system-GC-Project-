// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useQuery } from "@tanstack/react-query";
// import {
//   FileText,
//   Clock,
//   CheckCircle2,
//   AlertTriangle,
//   TrendingUp,
//   MapPin,
//   Calendar,
//   User,
//   ArrowRight,
//   Bell,
//   AlertCircle,
//   BarChart2,
//   MessageSquare,
//   Loader2,
// } from "lucide-react";
// import { format, isToday } from "date-fns";

// interface Report {
//   id: string;
//   title: string;
//   description: string;
//   caseNumber: string;
//   status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
//   priority: "LOW" | "MEDIUM" | "HIGH";
//   lat: number | null;
//   lng: number | null;
//   createdAt: string;
//   assignedOfficer: {
//     user: {
//       fullName: string;
//     };
//   };
//   crimeType: {
//     name: string;
//   };
// }

// interface ReportsResponse {
//   success: boolean;
//   reports: Report[];
//   total: number;
//   page: number;
//   pages: number;
// }

// export default function OfficerDashboardPage() {
//   const router = useRouter();
//   const [officerName, setOfficerName] = useState("");

//   useEffect(() => {
//     const auth = localStorage.getItem("officerAuth");
//     const badgeId = localStorage.getItem("officerBadgeId");
//     if (!auth) {
//       router.push("/officer/login");
//     } else {
//       setOfficerName(`Officer ${badgeId}`);
//     }
//   }, [router]);

//   // Fetch reports from API
//   const { data: reportsData, isLoading: isLoadingReports } =
//     useQuery<ReportsResponse>({
//       queryKey: ["reports"],
//       queryFn: async () => {
//         const token = localStorage.getItem("officerToken");
//         if (!token) throw new Error("No authentication token");

//         const response = await fetch("http://localhost:4000/api/reports", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Failed to fetch reports");
//         return response.json();
//       },
//     });

//   const reports = reportsData?.reports || [];

//   // Calculate stats from real data
//   const activeCases = reports.filter(
//     (r) => r.status === "NEW" || r.status === "IN_PROGRESS"
//   ).length;

//   const pendingReviews = reports.filter((r) => r.status === "NEW").length;

//   const resolvedToday = reports.filter(
//     (r) => r.status === "RESOLVED" && isToday(new Date(r.createdAt))
//   ).length;

//   const highPriority = reports.filter((r) => r.priority === "HIGH").length;

//   const stats = [
//     {
//       label: "Active Cases",
//       value: activeCases.toString(),
//       icon: FileText,
//       color: "text-blue-600",
//     },
//     {
//       label: "Pending Reviews",
//       value: pendingReviews.toString(),
//       icon: Clock,
//       color: "text-yellow-600",
//     },
//     {
//       label: "Resolved Today",
//       value: resolvedToday.toString(),
//       icon: CheckCircle2,
//       color: "text-green-600",
//     },
//     {
//       label: "High Priority",
//       value: highPriority.toString(),
//       icon: AlertTriangle,
//       color: "text-red-600",
//     },
//   ];

//   // Recent cases: last 4, sorted by createdAt desc
//   const recentCases = reports
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )
//     .slice(0, 4);

//   // Example notifications (add real fetch if needed)
//   const notifications = [
//     {
//       id: 1,
//       message: "New high-priority theft reported in Central District",
//       time: "2 hours ago",
//       unread: true,
//     },
//     {
//       id: 2,
//       message: "Case RPT-12345678 requires immediate review",
//       time: "4 hours ago",
//       unread: false,
//     },
//     {
//       id: 3,
//       message: "System maintenance scheduled for tomorrow",
//       time: "1 day ago",
//       unread: false,
//     },
//   ];

//   // Performance metrics (calculated from data)
//   const totalCases = reports.length;
//   const resolvedCases = reports.filter(
//     (r) => r.status === "RESOLVED" || r.status === "CLOSED"
//   ).length;
//   const resolutionRate =
//     totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

//   const averageResponseTime = "15 min"; // Placeholder - calculate from data if timestamps available

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "IN_PROGRESS":
//         return (
//           <Badge variant="default" className="bg-blue-600">
//             Investigating
//           </Badge>
//         );
//       case "NEW":
//         return <Badge variant="secondary">Assigned</Badge>;
//       case "RESOLVED":
//         return (
//           <Badge variant="default" className="bg-green-600">
//             Resolved
//           </Badge>
//         );
//       case "CLOSED":
//         return <Badge variant="outline">Closed</Badge>;
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "HIGH":
//         return "text-red-600 bg-red-50 dark:bg-red-950";
//       case "MEDIUM":
//         return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
//       case "LOW":
//         return "text-blue-600 bg-blue-50 dark:bg-blue-950";
//       default:
//         return "";
//     }
//   };

//   if (isLoadingReports) {
//     return (
//       <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {officerName}</h1>
//         <p className="text-muted-foreground">
//           Here's a summary of your cases and system activity
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <Card key={index}>
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <Icon className={`h-8 w-8 ${stat.color}`} />
//                   <div className="text-3xl font-bold">{stat.value}</div>
//                 </div>
//                 <p className="text-sm text-muted-foreground">{stat.label}</p>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Recent Cases */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle>Recent Cases</CardTitle>
//                   <CardDescription>
//                     Latest cases assigned to you
//                   </CardDescription>
//                 </div>
//                 <Link href="/officer/reports">
//                   <Button variant="outline" size="sm">
//                     View All Reports
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {recentCases.map((case_) => (
//                   <Link key={case_.id} href={`/officer/reports/${case_.id}`}>
//                     <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-2">
//                             <h3 className="font-semibold">
//                               {case_.caseNumber}
//                             </h3>
//                             {getStatusBadge(case_.status)}
//                           </div>
//                           <p className="text-sm text-muted-foreground mb-2">
//                             {case_.crimeType.name}
//                           </p>
//                         </div>
//                         <div
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
//                             case_.priority
//                           )}`}
//                         >
//                           {case_.priority.toUpperCase()}
//                         </div>
//                       </div>
//                       <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-1">
//                           <MapPin className="h-4 w-4" />
//                           {case_.lat && case_.lng
//                             ? "Location Available"
//                             : "No Location"}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {new Date(case_.createdAt).toLocaleDateString()}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <User className="h-4 w-4" />
//                           {case_.assignedOfficer.user.fullName}
//                         </div>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//                 {recentCases.length === 0 && (
//                   <p className="text-center text-muted-foreground py-8">
//                     No recent cases
//                   </p>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Quick Actions */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Link href="/officer/reports">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start bg-transparent"
//                 >
//                   <FileText className="mr-2 h-4 w-4" />
//                   View All Reports
//                 </Button>
//               </Link>
//               <Link href="/officer/map">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start bg-transparent"
//                 >
//                   <MapPin className="mr-2 h-4 w-4" />
//                   Open Map View
//                 </Button>
//               </Link>
//               <Link href="/officer/notifications">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start bg-transparent"
//                 >
//                   <Bell className="mr-2 h-4 w-4" />
//                   View Notifications
//                 </Button>
//               </Link>
//               <Link href="/officer/ai-analysis">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start bg-transparent"
//                 >
//                   <AlertCircle className="mr-2 h-4 w-4" />
//                   AI Analysis Tools
//                 </Button>
//               </Link>
//               <Link href="/officer/notices">
//                 <Button
//                   variant="outline"
//                   className="w-full justify-start bg-transparent"
//                 >
//                   <AlertTriangle className="mr-2 h-4 w-4" />
//                   Safety Notices
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Recent Notifications */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Recent Notifications</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {notifications.map((notif) => (
//                 <div key={notif.id} className="flex items-start gap-3">
//                   <Bell className="h-4 w-4 text-muted-foreground mt-1" />
//                   <div>
//                     <p className="text-sm">{notif.message}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {notif.time}
//                     </p>
//                   </div>
//                   {notif.unread && (
//                     <div className="h-2 w-2 rounded-full bg-blue-600" />
//                   )}
//                 </div>
//               ))}
//               <Link href="/officer/notifications">
//                 <Button variant="link" className="w-full justify-center">
//                   View All Notifications
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>

//           {/* Performance */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Performance</CardTitle>
//               <CardDescription>This month</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm">Cases Resolved</span>
//                   <span className="text-sm font-semibold">
//                     {resolvedCases}/{totalCases}
//                   </span>
//                 </div>
//                 <div className="w-full bg-muted rounded-full h-2">
//                   <div
//                     className="bg-primary h-2 rounded-full"
//                     style={{ width: `${resolutionRate}%` }}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm">Average Response Time</span>
//                   <span className="text-sm font-semibold text-green-600">
//                     {averageResponseTime}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                   <TrendingUp className="h-3 w-3 text-green-600" />
//                   15% faster than last month
//                 </div>
//               </div>
//               <div className="pt-4 border-t">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-sm">Total Reports</span>
//                   <span className="text-sm font-semibold">{totalCases}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                   <BarChart2 className="h-3 w-3" />
//                   {
//                     reports.filter((r) => isToday(new Date(r.createdAt))).length
//                   }{" "}
//                   new today
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-sm">Open Messages</span>
//                 <span className="text-sm font-semibold">8</span>
//               </div>
//               <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <MessageSquare className="h-3 w-3" />3 unread
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getUser, type OfficerUser } from "@/lib/auth";
// import { Loader2, ShieldAlert } from "lucide-react";

// // Components
// import AdminView from "./components/AdminView";
// import OperatorView from "./components/OperatorView";
// import OfficerView from "./components/OfficerView";

// // API Fetcher
// async function fetchReports() {
//   const token =
//     typeof window !== "undefined" &&
//     (localStorage.getItem("officerToken") || localStorage.getItem("token"));

//   if (!token) throw new Error("No authentication token found");

//   const res = await fetch("http://localhost:4000/api/reports", {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   if (!res.ok) throw new Error("Failed to fetch reports");
//   return res.json();
// }

// export default function DashboardPage() {
//   const [user, setUser] = useState<OfficerUser | null>(null);

//   // 1. Fetch Data
//   const {
//     data: reportsData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["reports"],
//     queryFn: fetchReports,
//     refetchInterval: 30000, // Auto-refresh every 30 seconds for real-time updates
//   });

//   useEffect(() => {
//     const currentUser = getUser();
//     setUser(currentUser);
//   }, []);

//   // 2. Memoized Data Filtering (Ensures high performance)
//   const filteredData = useMemo(() => {
//     const reports = reportsData?.reports || [];
//     if (!user) return { admin: [], operator: [], officer: [] };

//     return {
//       // Admins see everything
//       admin: reports,
//       // Operators focus on new intakes and high priority
//       operator: reports.filter(
//         (r: any) => r.status === "NEW" || r.priority === "HIGH"
//       ),
//       // Officers only see what is assigned to their specific ID
//       officer: reports.filter(
//         (r: any) =>
//           r.assignedOfficer?.user?.id === user.id ||
//           r.assignedOfficerId === user.id
//       ),
//     };
//   }, [reportsData, user]);

//   // 3. Loading & Error States
//   if (isLoading) {
//     return (
//       <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//         <p className="text-muted-foreground animate-pulse">
//           Synchronizing secure data...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
//         <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
//         <h2 className="text-xl font-bold">Connection Error</h2>
//         <p className="text-muted-foreground">
//           Could not reach the secure server. Please log in again.
//         </p>
//       </div>
//     );
//   }

//   if (!user) return null;

//   // 4. Role-Based Render Logic
//   return (
//     <main className="container mx-auto p-6 space-y-8">
//       <header className="flex flex-col gap-1 border-b pb-6">
//         <h1 className="text-3xl font-extrabold tracking-tight">
//           System Dashboard
//         </h1>
//         <div className="flex items-center gap-2">
//           <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//           <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
//             Secure Session: {user.role.replace("_", " ")}
//           </p>
//         </div>
//       </header>

//       <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//         {/* Super Admin & Admin share the same detailed view */}
//         {(user.role === "SUPER_ADMIN" || user.role === "ADMIN") && (
//           <AdminView reports={filteredData.admin} user={user} />
//         )}

//         {/* Operator focused view */}
//         {user.role === "OPERATOR" && (
//           <OperatorView reports={filteredData.operator} user={user} />
//         )}

//         {/* Individual Officer focused view */}
//         {user.role === "OFFICER" && (
//           <OfficerView reports={filteredData.officer} user={user} />
//         )}
//       </section>
//     </main>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";

// Components
import AdminView from "./components/AdminView";
import OfficerView from "./components/OfficerView";
import OperatorView from "./components/OperatorView";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // ────────────────────────────────────────────────
  // ALL HOOKS FIRST – never put returns above this
  // ────────────────────────────────────────────────

  // 1. Auth check & user load
  useEffect(() => {
    const auth = getUser();
    if (!auth) {
      router.replace("/officer/login");
    } else {
      setUser(auth);
    }
  }, [router]);

  // 2. Reports query
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken");
      const res = await fetch("http://localhost:4000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
    enabled: !!user, // Only fetch when user is loaded
  });

  // 3. Socket.io setup – only when user exists
  // e.g., in DashboardPage.tsx or a layout component
  useEffect(() => {
    if (!user?.id) return;

    const socket = io("http://localhost:4000", {
      auth: {
        token: localStorage.getItem("officerToken"), // Optional: auth with token
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected!");
      socket.emit("joinRoom", `user_${user.id}`);
      
      // Join admin room if applicable
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        socket.emit("joinRoom", "admin");
      }
    });

    socket.on("new-notification", (notification) => {
      console.log("Realtime notification received:", notification);
      toast.success(notification.title, {
        description: notification.body,
        duration: 8000,
      });
      // Optional: refetch notifications or increment unread count in UI
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);
  // ────────────────────────────────────────────────
  // Now safe to early return (after all hooks)
  // ────────────────────────────────────────────────

  if (reportsLoading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  const reports = reportsData?.reports || [];
  const officerName = user.fullName || `Officer ${user.badgeId || "Unknown"}`;

  // Render role-based views
  return (
    <main>
      {(user.role === "SUPER_ADMIN" || user.role === "ADMIN") && (
        <AdminView reports={reports} officerName={officerName} />
      )}

      {user.role === "OFFICER" && <OfficerView reports={reports} user={user} />}

      {user.role === "OPERATOR" && (
        <OperatorView reports={reports} user={user} />
      )}
    </main>
  );
}

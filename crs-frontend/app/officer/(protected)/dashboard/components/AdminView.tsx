// "use client";

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
// } from "lucide-react";
// import { isToday } from "date-fns";

// // This is your exact code converted to a reusable Component
// export function AdminView({
//   reports,
//   officerName,
// }: {
//   reports: any[];
//   officerName: string;
// }) {
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

//   const recentCases = [...reports]
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     )
//     .slice(0, 4);

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
//   ];

//   const totalCases = reports.length;
//   const resolvedCases = reports.filter(
//     (r) => r.status === "RESOLVED" || r.status === "CLOSED"
//   ).length;
//   const resolutionRate =
//     totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "IN_PROGRESS":
//         return <Badge className="bg-blue-600">Investigating</Badge>;
//       case "NEW":
//         return <Badge variant="secondary">Assigned</Badge>;
//       case "RESOLVED":
//         return <Badge className="bg-green-600">Resolved</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Welcome back, {officerName}</h1>
//         <p className="text-muted-foreground text-purple-600 font-semibold">
//           Administrator Command Access
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, i) => (
//           <Card key={i}>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <stat.icon className={`h-8 w-8 ${stat.color}`} />
//                 <div className="text-3xl font-bold">{stat.value}</div>
//               </div>
//               <p className="text-sm text-muted-foreground">{stat.label}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Recent Cases</CardTitle>
//                 <CardDescription>Latest system-wide activity</CardDescription>
//               </div>
//               <Link href="/officer/reports">
//                 <Button variant="outline" size="sm">
//                   View All <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </Link>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {recentCases.map((c) => (
//                 <Link key={c.id} href={`/officer/reports/${c.id}`}>
//                   <div className="p-4 border rounded-lg hover:bg-accent transition-colors mb-2">
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center gap-2">
//                         <span className="font-bold">{c.caseNumber}</span>
//                         {getStatusBadge(c.status)}
//                       </div>
//                       <Badge
//                         className={
//                           c.priority === "HIGH" ? "bg-red-100 text-red-600" : ""
//                         }
//                       >
//                         {c.priority}
//                       </Badge>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Performance Metrics</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Resolution Rate</span>
//                 <span>{resolutionRate}%</span>
//               </div>
//               <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
//                 <div
//                   className="bg-primary h-full"
//                   style={{ width: `${resolutionRate}%` }}
//                 />
//               </div>
//               <div className="pt-4 flex items-center gap-2 text-xs text-muted-foreground">
//                 <TrendingUp className="h-3 w-3 text-green-600" />
//                 Global performance is optimal.
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Bell,
  AlertCircle,
  BarChart2,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { format, isToday, formatDistanceToNow } from "date-fns";
import { getUser } from "@/lib/auth";

interface Report {
  id: string;
  title: string;
  description: string;
  caseNumber: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  lat: number | null;
  lng: number | null;
  createdAt: string;
  assignedOfficer: {
    user: {
      fullName: string;
    };
  };
  crimeType: {
    name: string;
  };
}

interface ReportsResponse {
  success: boolean;
  reports: Report[];
  total: number;
  page: number;
  pages: number;
}

export default function AdminView() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [roleLabel, setRoleLabel] = useState("");

  useEffect(() => {
    const user = getUser(); // Get the full user object
    const badgeId = localStorage.getItem("officerBadgeId");

    if (!user) {
      router.push("/officer/login");
      return;
    }

    // Role-based Naming Logic
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      // For Admins, use their Full Name and add a prefix
      setDisplayName(`${user.fullName || "Administrator"}`);
      setRoleLabel(
        user.role === "SUPER_ADMIN" ? "System Super Admin" : "Precinct Admin"
      );
    } else {
      // For others, use the Badge ID
      setDisplayName(`Officer ${badgeId || user.badgeId}`);
      setRoleLabel("Field Operations");
    }
  }, [router]);

  // Fetch reports from API
  const { data: reportsData, isLoading: isLoadingReports } =
    useQuery<ReportsResponse>({
      queryKey: ["reports"],
      queryFn: async () => {
        const token = localStorage.getItem("officerToken");
        if (!token) throw new Error("No authentication token");

        const response = await fetch("http://localhost:4000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch reports");
        return response.json();
      },
    });

  const reports = reportsData?.reports || [];

  // Calculate stats from real data
  const activeCases = reports.filter(
    (r) => r.status === "NEW" || r.status === "IN_PROGRESS"
  ).length;

  const pendingReviews = reports.filter((r) => r.status === "NEW").length;

  const resolvedToday = reports.filter(
    (r) => r.status === "RESOLVED" && isToday(new Date(r.createdAt))
  ).length;

  const highPriority = reports.filter((r) => r.priority === "HIGH").length;

  const stats = [
    {
      label: "Active Cases",
      value: activeCases.toString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Pending Reviews",
      value: pendingReviews.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Resolved Today",
      value: resolvedToday.toString(),
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "High Priority",
      value: highPriority.toString(),
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  // Recent cases: last 4, sorted by createdAt desc
  const recentCases = reports
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4);

  // Fetch notifications for Admin View
  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", "admin-view"],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken");
      const res = await fetch("http://localhost:4000/api/notifications?limit=5", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return { notifications: [] };
      return res.json();
    },
  });

  const notifications = notificationsData?.notifications || [];

  // Performance metrics (calculated from data)
  const totalCases = reports.length;
  const resolvedCases = reports.filter(
    (r) => r.status === "RESOLVED" || r.status === "CLOSED"
  ).length;
  const resolutionRate =
    totalCases > 0 ? Math.round((resolvedCases / totalCases) * 100) : 0;

  // Simple average response time calc (placeholder logic until DB supported)
  // In a real app, diff `createdAt` vs `updatedAt` for resolved cases
  const averageResponseTime = "12h 30m"; 

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <Badge variant="default" className="bg-blue-600">
            Investigating
          </Badge>
        );
      case "NEW":
        return <Badge variant="secondary">Assigned</Badge>;
      case "RESOLVED":
        return (
          <Badge variant="default" className="bg-green-600">
            Resolved
          </Badge>
        );
      case "CLOSED":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "text-red-600 bg-red-50 dark:bg-red-950";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
      case "LOW":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950";
      default:
        return "";
    }
  };

  if (isLoadingReports) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* The dynamic Welcome Header */}
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Welcome back, <span className="text-blue-600">{displayName}</span>
        </h1>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[10px]"
          >
            {roleLabel}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Here's a summary of your cases and system activity
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Cases */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>
                    Latest cases assigned to you
                  </CardDescription>
                </div>
                <Link href="/officer/reports">
                  <Button variant="outline" size="sm">
                    View All Reports
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((case_) => (
                  <Link key={case_.id} href={`/officer/reports/${case_.id}`}>
                    <div className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {case_.caseNumber}
                            </h3>
                            {getStatusBadge(case_.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {case_.crimeType.name}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                            case_.priority
                          )}`}
                        >
                          {case_.priority.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {case_.lat && case_.lng
                            ? "Location Available"
                            : "No Location"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(case_.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {case_.assignedOfficer?.user?.fullName ??
                            "Not Assigned"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
                {recentCases.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No recent cases
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/officer/reports">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View All Reports
                </Button>
              </Link>
              <Link href="/officer/map-two">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Open Map View
                </Button>
              </Link>
              <Link href="/officer/notifications">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  View Notifications
                </Button>
              </Link>
              <Link href="/officer/ai-analysis">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  AI Analysis Tools
                </Button>
              </Link>
              <Link href="/officer/notices">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Safety Notices
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((notif: any) => (
                <div key={notif.id} className="flex items-start gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent notifications.</p>
              )}
              <Link href="/officer/notifications">
                <Button variant="link" className="w-full justify-center">
                  View All Notifications
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>System Metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Cases Resolved</span>
                  <span className="text-sm font-semibold">
                    {resolvedCases}/{totalCases}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${resolutionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Response Time (Est.)</span>
                  <span className="text-sm font-semibold text-green-600">
                    {averageResponseTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  Consistent performance
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Total Reports</span>
                  <span className="text-sm font-semibold">{totalCases}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BarChart2 className="h-3 w-3" />
                  {
                    reports.filter((r) => isToday(new Date(r.createdAt))).length
                  }{" "}
                  new today
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

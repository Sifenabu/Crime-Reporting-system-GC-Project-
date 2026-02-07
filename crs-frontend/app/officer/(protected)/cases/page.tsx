// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Search, Filter, MapPin, Calendar, User, Eye } from "lucide-react";

// export default function OfficerCasesPage() {
//   const router = useRouter();
//   const [searchTerm, setSearchTerm] = useState("");

//   // useEffect(() => {
//   //   const auth = localStorage.getItem("officerAuth")
//   //   if (!auth) {
//   //     router.push("/officer/login")
//   //   }
//   // }, [router])

//   const cases = [
//     {
//       id: "RPT-12345678",
//       type: "Theft",
//       location: "Main Street Market",
//       status: "investigating",
//       priority: "high",
//       date: "2024-01-20",
//       reporter: "Anonymous",
//       description: "Multiple items stolen from market stall",
//       evidence: 3,
//     },
//     {
//       id: "RPT-87654321",
//       type: "Vandalism",
//       location: "Central Park",
//       status: "assigned",
//       priority: "medium",
//       date: "2024-01-19",
//       reporter: "John Smith",
//       description: "Graffiti on park benches and walls",
//       evidence: 5,
//     },
//     {
//       id: "RPT-11223344",
//       type: "Assault",
//       location: "5th Avenue",
//       status: "investigating",
//       priority: "high",
//       date: "2024-01-18",
//       reporter: "Anonymous",
//       description: "Physical altercation between two individuals",
//       evidence: 2,
//     },
//     {
//       id: "RPT-55667788",
//       type: "Fraud",
//       location: "Downtown District",
//       status: "pending",
//       priority: "low",
//       date: "2024-01-17",
//       reporter: "Sarah Johnson",
//       description: "Suspected credit card fraud",
//       evidence: 1,
//     },
//     {
//       id: "RPT-99887766",
//       type: "Burglary",
//       location: "Residential Area",
//       status: "investigating",
//       priority: "high",
//       date: "2024-01-16",
//       reporter: "Michael Brown",
//       description: "Home break-in, valuables stolen",
//       evidence: 4,
//     },
//     {
//       id: "RPT-44556677",
//       type: "Noise Complaint",
//       location: "Oak Street",
//       status: "resolved",
//       priority: "low",
//       date: "2024-01-15",
//       reporter: "Emily Davis",
//       description: "Loud music disturbance late at night",
//       evidence: 0,
//     },
//   ];

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "investigating":
//         return <Badge variant="default">Investigating</Badge>;
//       case "assigned":
//         return <Badge variant="secondary">Assigned</Badge>;
//       case "pending":
//         return <Badge variant="outline">Pending</Badge>;
//       case "resolved":
//         return (
//           <Badge
//             variant="secondary"
//             className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
//           >
//             Resolved
//           </Badge>
//         );
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "high":
//         return "text-red-600 bg-red-50 dark:bg-red-950";
//       case "medium":
//         return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950";
//       case "low":
//         return "text-blue-600 bg-blue-50 dark:bg-blue-950";
//       default:
//         return "";
//     }
//   };

//   const filteredCases = cases.filter(
//     (case_) =>
//       case_.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       case_.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       case_.location.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-2">Case Management</h1>
//         <p className="text-muted-foreground">
//           Manage and track all assigned cases
//         </p>
//       </div>

//       {/* Filters */}
//       <Card className="mb-6">
//         <CardContent className="p-6">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by case ID, type, or location..."
//                 className="pl-10"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <Button variant="outline" className="bg-transparent">
//               <Filter className="mr-2 h-4 w-4" />
//               Filters
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Cases Grid */}
//       <div className="space-y-4">
//         {filteredCases.map((case_) => (
//           <Card key={case_.id} className="hover:shadow-md transition-shadow">
//             <CardContent className="p-6">
//               <div className="flex flex-col lg:flex-row lg:items-center gap-4">
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-semibold text-lg">{case_.id}</h3>
//                         {getStatusBadge(case_.status)}
//                         <div
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
//                             case_.priority
//                           )}`}
//                         >
//                           {case_.priority.toUpperCase()}
//                         </div>
//                       </div>
//                       <p className="text-sm font-medium text-muted-foreground mb-2">
//                         {case_.type}
//                       </p>
//                       <p className="text-sm text-muted-foreground">
//                         {case_.description}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       {case_.location}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Calendar className="h-4 w-4" />
//                       {new Date(case_.date).toLocaleDateString()}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <User className="h-4 w-4" />
//                       {case_.reporter}
//                     </div>
//                     {case_.evidence > 0 && (
//                       <div className="flex items-center gap-1">
//                         <Eye className="h-4 w-4" />
//                         {case_.evidence} Evidence Files
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex lg:flex-col gap-2">
//                   <Link
//                     href={`/officer/cases/${case_.id}`}
//                     className="flex-1 lg:flex-none"
//                   >
//                     <Button className="w-full">View Details</Button>
//                   </Link>
//                   <Button
//                     variant="outline"
//                     className="flex-1 lg:flex-none bg-transparent"
//                   >
//                     Update Status
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {filteredCases.length === 0 && (
//         <Card>
//           <CardContent className="p-12 text-center">
//             <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-xl font-semibold mb-2">No Cases Found</h3>
//             <p className="text-muted-foreground">
//               Try adjusting your search or filters
//             </p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ArrowRightLeft,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";

interface Report {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  assignedOfficer?: {
    user: { fullName: string };
  };
  location?: { city: string; subCity?: string };
}

interface Stats {
  totalAssigned: number;
  active: number;
  resolved: number;
  closed: number;
  reassigned: number;
}

export default function OfficerCasesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Get current user from localStorage (your auth method)
  const user = JSON.parse(localStorage.getItem("officerUser") || "{}");
  const token = localStorage.getItem("officerToken") || "";
  const isAdmin = ["ADMIN", "SUPER_ADMIN", "OPERATOR"].includes(user?.role);

  // Fetch reports (real API)
  const { data, isLoading, error } = useQuery({
    queryKey: ["officer-cases", user.id, isAdmin],
    queryFn: async () => {
      const url = isAdmin
        ? "http://localhost:4000/api/reports" // All cases for admin/operator/super
        : `http://localhost:4000/api/reports?assignedOfficerId=${user.id}`; // Only my cases for officer

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cases");
      const json = await res.json();
      return json.reports || []; // Adjust based on your API response shape
    },
    enabled: !!user?.id && !!token,
  });

  // Calculate stats
  const stats: Stats = data?.reduce(
    (acc: Stats, report: Report) => {
      if (report.status === "ASSIGNED" || report.status === "IN_PROGRESS") {
        acc.active++;
      }
      if (report.status === "RESOLVED") acc.resolved++;
      if (report.status === "CLOSED") acc.closed++;
      // Add reassigned count if you track it in status or another field
      acc.totalAssigned++;
      return acc;
    },
    { totalAssigned: 0, active: 0, resolved: 0, closed: 0, reassigned: 0 }
  ) || { totalAssigned: 0, active: 0, resolved: 0, closed: 0, reassigned: 0 };

  // Filter & search
  const filteredReports = (data || []).filter((report: Report) => {
    const matchesSearch =
      report.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      NEW: "destructive",
      PENDING_REVIEW: "secondary",
      APPROVED: "default",
      IN_PROGRESS: "default",
      RESOLVED: "secondary",
      CLOSED: "outline",
      REJECTED: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: "bg-red-500 text-white",
      MEDIUM: "bg-yellow-500 text-white",
      LOW: "bg-blue-500 text-white",
    };
    return colors[priority] || "bg-gray-500 text-white";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Failed to load cases</h2>
        <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Cases</h1>
        <p className="text-muted-foreground">
          {isAdmin
            ? "All active and historical cases"
            : "Cases currently assigned to you"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <Card className="border-l-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Assigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalAssigned}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active / In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-gray-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Closed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.closed}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reassigned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reassigned}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case ID, title, or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Tabs defaultValue="all" className="w-[300px]">
                <TabsList>
                  <TabsTrigger
                    value="all"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="active"
                    onClick={() => setStatusFilter("ACTIVE")}
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger
                    value="resolved"
                    onClick={() => setStatusFilter("RESOLVED")}
                  >
                    Resolved
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredReports.length > 0 ? (
          filteredReports.map((report: Report) => (
            <Card
              key={report.id}
              className="hover:shadow-md transition-all duration-200 hover:border-blue-400"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Left - Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {report.caseNumber}
                      </span>
                      {getStatusBadge(report.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          report.priority
                        )}`}
                      >
                        {report.priority}
                      </span>
                      {report.assignedOfficer && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {report.assignedOfficer.user.fullName}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-lg line-clamp-1">
                      {report.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {report.location
                          ? `${report.location.city}${
                              report.location.subCity
                                ? `, ${report.location.subCity}`
                                : ""
                            }`
                          : "No location"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(report.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-row lg:flex-col gap-3 min-w-[180px]">
                    <Link
                      href={`/officer/cases/${report.caseNumber}`}
                      className="flex-1"
                    >
                      <Button variant="default" className="w-full">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1">
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Cases Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You don't have any assigned cases yet"}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

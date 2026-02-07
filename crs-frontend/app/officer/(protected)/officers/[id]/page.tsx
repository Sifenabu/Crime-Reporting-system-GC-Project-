// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useParams, useRouter } from "next/navigation";
// import { getToken, getUserInitials } from "@/lib/auth";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Loader2 } from "lucide-react";

// interface OfficerDetail {
//   id: string;
//   badgeNumber: string;
//   rank: string;
//   availability: string;
//   user: {
//     fullName: string;
//     email: string;
//     phone: string;
//   };
//   brand?: {
//     profileImage?: string;
//     displayName?: string;
//     tagline?: string;
//     publicBio?: string;
//   };
//   profile?: {
//     dateOfBirth?: string;
//     gender?: string;
//     maritalStatus?: string;
//     education?: string;
//     emergencyPhone?: string;
//   };
//   caseStats?: {
//     activeCases: number;
//     closedCases: number;
//     totalAssigned: number;
//   };
// }

// export default function OfficerDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const officerId = params.id as string;

//   const { data: officer, isLoading, error } = useQuery({
//     queryKey: ["officer", officerId],
//     queryFn: async () => {
//       const token = getToken();
//       const response = await fetch(`http://localhost:4000/api/officers/${officerId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch officer details");
//       }
//       return response.json();
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
//       </div>
//     );
//   }

//   if (error || !officer) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex flex-col items-center justify-center space-y-4">
//           <p className="text-red-600">Failed to load officer details.</p>
//           <Button onClick={() => router.back()}>Go Back</Button>
//         </div>
//       </div>
//     );
//   }

//   // Helper to resolve detailed officer data if nested under 'officer' key from API
//   const data: OfficerDetail = officer.officer || officer; 

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <Button variant="ghost" onClick={() => router.back()} className="mb-6">
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back to Officers
//       </Button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Left Column: Profile Card */}
//         <Card className="md:col-span-1 border-t-4 border-t-cyan-500 shadow-lg">
//           <CardContent className="pt-6 flex flex-col items-center text-center">
//             <Avatar className="h-32 w-32 border-4 border-white shadow-sm mb-4">
//               <AvatarImage src={data.brand?.profileImage} />
//               <AvatarFallback className="text-2xl bg-cyan-100 text-cyan-800">
//                 {getUserInitials(data.user.fullName)}
//               </AvatarFallback>
//             </Avatar>
//             <h2 className="text-2xl font-bold text-slate-900">{data.user.fullName}</h2>
//             <p className="text-muted-foreground font-medium mb-2">{data.rank}</p>
//             <Badge className={
//                data.availability === 'ON_DUTY' ? 'bg-green-500' : 
//                data.availability === 'OFF_DUTY' ? 'bg-slate-500' : 'bg-yellow-500'
//             }>
//               {data.availability.replace('_', ' ')}
//             </Badge>
            
//             <div className="w-full mt-6 space-y-3 text-left">
//               <div className="flex items-center gap-3 text-sm text-slate-600">
//                 <Shield className="h-4 w-4 text-cyan-600" />
//                 <span>Badge: {data.badgeNumber}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-slate-600">
//                 <Mail className="h-4 w-4 text-cyan-600" />
//                 <span className="truncate" title={data.user.email}>{data.user.email}</span>
//               </div>
//               <div className="flex items-center gap-3 text-sm text-slate-600">
//                 <Phone className="h-4 w-4 text-cyan-600" />
//                 <span>{data.user.phone}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Right Column: Stats & Details */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-4">
//             <Card>
//               <CardContent className="p-4 flex flex-col items-center justify-center">
//                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Active Cases</p>
//                  <p className="text-2xl font-bold text-cyan-600">{data.caseStats?.activeCases || 0}</p>
//               </CardContent>
//             </Card>
//              <Card>
//               <CardContent className="p-4 flex flex-col items-center justify-center">
//                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Closed Cases</p>
//                  <p className="text-2xl font-bold text-green-600">{data.caseStats?.closedCases || 0}</p>
//               </CardContent>
//             </Card>
//              <Card>
//               <CardContent className="p-4 flex flex-col items-center justify-center">
//                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Assigned</p>
//                  <p className="text-2xl font-bold text-slate-600">
//                    {(data.caseStats?.activeCases || 0) + (data.caseStats?.closedCases || 0)}
//                  </p>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Additional Info Tabs/Cards */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Personal Information</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                <div>
//                  <p className="text-sm font-medium text-muted-foreground">Display Name</p>
//                  <p className="text-slate-900">{data.brand?.displayName || "-"}</p>
//                </div>
//                <div>
//                   <p className="text-sm font-medium text-muted-foreground">Education</p>
//                   <p className="text-slate-900">{data.profile?.education || "-"}</p>
//                </div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Gender</p>
//                   <p className="text-slate-900 capitalize">{data.profile?.gender?.toLowerCase() || "-"}</p>
//                </div>
//                <div>
//                   <p className="text-sm font-medium text-muted-foreground">Join Date</p>
//                   <p className="text-slate-900">-</p> 
//                </div>
//             </CardContent>
//           </Card>

//            <Card>
//             <CardHeader>
//               <CardTitle>Biography</CardTitle>
//             </CardHeader>
//             <CardContent>
//                <p className="text-sm text-slate-600 leading-relaxed">
//                  {data.brand?.publicBio || "No biography provided."}
//                </p>
//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// }
// app/officer/(dashboard)/officers/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
// Import auth helpers
import { getToken, getUser, canManageOfficers } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Award,
  TrendingUp,
  FileText,
  Loader2,
  Shield,
  User,
  Calendar,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

export default function OfficerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const officerId = params?.id as string;

  // --- Auth Logic ---
  const currentUser = getUser();
  const canEditOrDelete = currentUser
    ? canManageOfficers(currentUser.role)
    : false;

  const {
    data: officer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["officer", officerId],
    queryFn: async () => {
      const token = getToken();
      // Add Authorization header here
      const authHeader = token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch(
        `http://localhost:4000/api/officers/${officerId}`,
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in again.");
      }

      if (!response.ok) throw new Error("Failed to fetch officer");
      const result = await response.json();
      return result.officer;
    },
    enabled: !!officerId, // Only run query if ID exists
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
      </div>
    );
  }

  // Handle Unauthorized or Fetch Errors
  if (error || !officer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">
              {error instanceof Error ? error.message : "Officer Not Found"}
            </h3>
            <p className="text-muted-foreground mb-4">
              We couldn't retrieve the details for this officer.
            </p>
            <Button onClick={() => router.push("/officer/officers")}>
              Back to Officers
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "ON_DUTY":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">On Duty</Badge>
        );
      case "OFF_DUTY":
        return <Badge variant="secondary">Off Duty</Badge>;
      case "ON_LEAVE":
        return <Badge variant="outline">On Leave</Badge>;
      case "BUSY":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Busy
          </Badge>
        );
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Officers
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={officer.brand?.profileImage} />
              <AvatarFallback className="bg-blue-900 text-white text-2xl uppercase">
                {officer.user?.fullName?.substring(0, 2) || "O"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{officer.user?.fullName}</h1>
                {getAvailabilityBadge(officer.availability)}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground uppercase text-[10px]">
                    Badge:
                  </span>
                  <span className="font-mono">{officer.badgeNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground uppercase text-[10px]">
                    Rank:
                  </span>
                  <span>{officer.rank}</span>
                </div>
              </div>
            </div>

            {/* Role-Based Actions */}
            {canEditOrDelete && (
              <div className="flex gap-2">
                <Link href={`/officer/officers/edit/${officerId}`}>
                  <Button variant="outline">Edit Officer</Button>
                </Link>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="brand">Brand Info</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="cases">Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <Mail className="h-4 w-4" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Email
                  </p>
                  <p className="font-medium">{officer.user?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Phone
                  </p>
                  <p className="font-medium">{officer.user?.phone}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
                  <TrendingUp className="h-4 w-4" /> Case Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase">
                    Active
                  </p>
                  <p className="text-xl font-bold">
                    {officer.caseStats?.activeCases || 0}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase">
                    Closed
                  </p>
                  <p className="text-xl font-bold">
                    {officer.caseStats?.closedCases || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" /> Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Email
                </p>
                <p className="font-medium text-slate-800">
                  {officer.user?.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Phone
                </p>
                <p className="font-medium text-slate-800">
                  {officer.user?.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold">
                  Emergency
                </p>
                <p className="font-medium text-slate-800">
                  {officer.profileDetails?.emergencyPhone || "None"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" /> Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Active / Max Cases</span>
                <Badge variant="secondary" className="text-base">
                  {officer.caseStats?.activeCases || 0} /{" "}
                  {officer.maxActiveCases}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Resolved Cases</span>
                <span className="font-bold text-slate-800">
                  {officer.caseStats?.closedCases || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-600" /> Reputation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Avg Rating</span>
                <div className="flex items-center gap-1 font-bold text-yellow-600">
                  {officer.reputation?.rating || 0} / 5
                </div>
              </div>
              <div className="flex justify-between items-center text-green-600 font-medium">
                <span>Commendations</span>
                <span>{officer.reputation?.commendations || 0}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* PROFILE DETAILS TAB */}
        <TabsContent value="profile">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Full Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />{" "}
                  <span className="text-xs font-bold uppercase">
                    Personal Details
                  </span>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="text-slate-500">DOB:</span>{" "}
                    {officer.profileDetails?.dateOfBirth
                      ? new Date(
                          officer.profileDetails.dateOfBirth
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="text-slate-500">Gender:</span>{" "}
                    {officer.profileDetails?.gender || "N/A"}
                  </p>
                  <p>
                    <span className="text-slate-500">Marital Status:</span>{" "}
                    {officer.profileDetails?.maritalStatus || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <GraduationCap className="h-4 w-4" />{" "}
                  <span className="text-xs font-bold uppercase">
                    Professional
                  </span>
                </div>
                <div className="space-y-3">
                  <p>
                    <span className="text-slate-500">Education:</span>{" "}
                    {officer.profileDetails?.education || "N/A"}
                  </p>
                  <p>
                    <span className="text-slate-500">Service Years:</span>{" "}
                    {officer.profileDetails?.yearsOfService || 0} Years
                  </p>
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />{" "}
                  <span className="text-xs font-bold uppercase">Address</span>
                </div>
                <p className="text-slate-800">
                  {officer.profileDetails?.address || "No address on file"}
                </p>
              </div>
              <div className="md:col-span-3 border-t pt-6">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-2">
                  Biography
                </p>
                <p className="text-slate-700 leading-relaxed">
                  {officer.profileDetails?.biography ||
                    "No biography provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cases">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Case History</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Your assignments mapping logic here */}
              {!officer.assignments?.length && (
                <p className="text-muted-foreground text-center py-10">
                  No cases currently assigned.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        {/* BRAND TAB */}
        <TabsContent value="brand">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Public Brand Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <section>
                <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider">
                  Public Bio
                </h4>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border italic">
                  "{officer.brand?.publicBio || "No public bio available."}"
                </p>
              </section>
              <section>
                <h4 className="text-sm font-bold text-blue-900 mb-2 uppercase tracking-wider">
                  Achievements & Awards
                </h4>
                <div className="text-slate-700">
                  {officer.brand?.achievements || "No achievements recorded."}
                </div>
              </section>
            </CardContent>
          </Card>
        </TabsContent>
        {/* SKILLS TAB */}
        <TabsContent value="skills">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              {officer.skills?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {officer.skills.map((s: any) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {s.skill.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expertise Level: {s.level}
                        </p>
                      </div>
                      {s.certified && (
                        <Badge className="bg-cyan-600">Certified</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  No skill records found for this officer.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CASES TAB */}
        <TabsContent value="cases">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Currently Assigned Cases</CardTitle>
              <Badge variant="outline">
                {officer.assignments?.length || 0} Total
              </Badge>
            </CardHeader>
            <CardContent>
              {officer.assignments?.length > 0 ? (
                <div className="space-y-4">
                  {officer.assignments.map((assignment: any) => (
                    <Link
                      key={assignment.id}
                      href={`/officer/cases/${assignment.report.caseNumber}`}
                    >
                      <div className="group p-5 border rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <div className="flex justify-between mb-3">
                          <div>
                            <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">
                              {assignment.report.caseNumber}
                            </span>
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-700">
                              {assignment.report.title}
                            </h4>
                          </div>
                          <Badge
                            className={
                              assignment.report.priority === "HIGH"
                                ? "bg-red-500"
                                : "bg-slate-500"
                            }
                          >
                            {assignment.report.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                          {assignment.report.description}
                        </p>
                        <div className="flex gap-6 text-xs text-muted-foreground border-t pt-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />{" "}
                            {assignment.distanceKm != null
                              ? `${assignment.distanceKm.toFixed(1)} km away`
                              : "Distance not calculated"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> Assigned:{" "}
                            {new Date(
                              assignment.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                  This officer currently has no active case assignments.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
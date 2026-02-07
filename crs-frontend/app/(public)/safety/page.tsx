// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   AlertTriangle,
//   AlertCircle,
//   Info,
//   MapPin,
//   Calendar,
// } from "lucide-react";

// // Mock safety notices data
// const safetyNotices = [
//   {
//     id: 1,
//     title: "Increased Theft Reports in Market District",
//     severity: "high",
//     category: "Alert",
//     location: "Market District",
//     date: "2024-01-20",
//     description:
//       "We have received multiple reports of theft in the Market District area. Please be vigilant with your belongings and report any suspicious activity immediately.",
//     tips: [
//       "Keep valuables secure and out of sight",
//       "Be aware of your surroundings",
//       "Report suspicious individuals to police",
//       "Use well-lit and populated areas",
//     ],
//   },
//   {
//     id: 2,
//     title: "Traffic Diversion on Main Street",
//     severity: "medium",
//     category: "Notice",
//     location: "Main Street",
//     date: "2024-01-18",
//     description:
//       "Due to road construction, Main Street will be closed between 5th and 8th Avenue from January 22-30. Please use alternative routes.",
//     tips: [
//       "Use 6th Avenue as alternative route",
//       "Expect delays during peak hours",
//       "Follow temporary traffic signs",
//     ],
//   },
//   {
//     id: 3,
//     title: "Community Safety Workshop",
//     severity: "low",
//     category: "Event",
//     location: "Police Headquarters",
//     date: "2024-01-15",
//     description:
//       "Join us for a free community safety workshop on January 28th at 2:00 PM. Learn about home security, personal safety, and emergency preparedness.",
//     tips: [
//       "Free admission for all residents",
//       "Bring questions for Q&A session",
//       "Refreshments will be provided",
//       "Register at adamapolice.gov",
//     ],
//   },
//   {
//     id: 4,
//     title: "Scam Alert: Fake Police Officers",
//     severity: "high",
//     category: "Alert",
//     location: "Citywide",
//     date: "2024-01-12",
//     description:
//       "Reports of individuals impersonating police officers to demand payments. Real officers will never demand immediate payment or threaten arrest over the phone.",
//     tips: [
//       "Always ask for badge number and department",
//       "Call official police line to verify",
//       "Never provide personal information over phone",
//       "Report suspicious calls immediately",
//     ],
//   },
//   {
//     id: 5,
//     title: "Neighborhood Watch Program Launch",
//     severity: "low",
//     category: "Info",
//     location: "Residential Areas",
//     date: "2024-01-10",
//     description:
//       "We are launching a new Neighborhood Watch program to strengthen community safety. Interested residents can sign up at their local police station.",
//     tips: [
//       "Build relationships with neighbors",
//       "Report unusual activity",
//       "Attend monthly meetings",
//       "Receive crime prevention training",
//     ],
//   },
//   {
//     id: 6,
//     title: "Heavy Rainfall Warning - Flooding Risk",
//     severity: "medium",
//     category: "Warning",
//     location: "Low-lying Areas",
//     date: "2024-01-08",
//     description:
//       "Heavy rainfall expected this weekend. Residents in low-lying areas should take precautions against potential flooding.",
//     tips: [
//       "Move vehicles to higher ground",
//       "Prepare emergency supplies",
//       "Avoid driving through flooded areas",
//       "Monitor weather updates",
//     ],
//   },
// ];

// export default function SafetyPage() {
//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "high":
//         return "destructive";
//       case "medium":
//         return "default";
//       case "low":
//         return "secondary";
//       default:
//         return "outline";
//     }
//   };

//   const getSeverityIcon = (severity: string) => {
//     switch (severity) {
//       case "high":
//         return <AlertTriangle className="h-5 w-5" />;
//       case "medium":
//         return <AlertCircle className="h-5 w-5" />;
//       default:
//         return <Info className="h-5 w-5" />;
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center justify-center p-4 bg-accent/10 rounded-full mb-4">
//             <AlertTriangle className="h-10 w-10 text-accent" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             Safety Notices
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Stay informed about important safety alerts, warnings, and community
//             updates
//           </p>
//         </div>

//         {/* Stats Bar */}
//         <div className="grid grid-cols-3 gap-4 mb-8">
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-destructive">
//                 {safetyNotices.filter((n) => n.severity === "high").length}
//               </div>
//               <div className="text-sm text-muted-foreground">High Priority</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-primary">
//                 {safetyNotices.filter((n) => n.severity === "medium").length}
//               </div>
//               <div className="text-sm text-muted-foreground">
//                 Medium Priority
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4 text-center">
//               <div className="text-2xl font-bold text-secondary-foreground">
//                 {safetyNotices.filter((n) => n.severity === "low").length}
//               </div>
//               <div className="text-sm text-muted-foreground">Informational</div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Safety Notices List */}
//         <div className="space-y-6">
//           {safetyNotices.map((notice) => (
//             <Card key={notice.id} className="overflow-hidden">
//               <CardHeader className="pb-4">
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex items-start gap-3 flex-1">
//                     <div
//                       className={`p-2 rounded-lg ${
//                         notice.severity === "high"
//                           ? "bg-destructive/10"
//                           : notice.severity === "medium"
//                           ? "bg-primary/10"
//                           : "bg-secondary/50"
//                       }`}
//                     >
//                       {getSeverityIcon(notice.severity)}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <CardTitle className="text-xl">
//                           {notice.title}
//                         </CardTitle>
//                         <Badge variant={getSeverityColor(notice.severity)}>
//                           {notice.category}
//                         </Badge>
//                       </div>
//                       <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                         <div className="flex items-center gap-1">
//                           <MapPin className="h-4 w-4" />
//                           {notice.location}
//                         </div>
//                         <div className="flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {new Date(notice.date).toLocaleDateString()}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <CardDescription className="text-base">
//                   {notice.description}
//                 </CardDescription>
//                 <div className="bg-muted p-4 rounded-lg">
//                   <p className="font-semibold text-sm mb-2">Safety Tips:</p>
//                   <ul className="space-y-1">
//                     {notice.tips.map((tip, index) => (
//                       <li
//                         key={index}
//                         className="text-sm text-muted-foreground flex items-start gap-2"
//                       >
//                         <span className="text-accent mt-1">•</span>
//                         <span>{tip}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Subscribe Section */}
//         <Card className="mt-12 bg-accent/5">
//           <CardHeader className="text-center">
//             <CardTitle>Stay Updated</CardTitle>
//             <CardDescription>
//               Want to receive safety alerts directly? Sign up for notifications
//               at your local police station or follow us on social media.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="text-center">
//             <p className="text-sm text-muted-foreground">
//               For immediate emergencies, always call <strong>911</strong>
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  MapPin,
  Calendar,
  BellRing,
  ShieldCheck,
  SearchX,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface SafetyNotice {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  category: string;
  location: string;
  createdAt: string;
  description: string;
  tips: string[];
  imageUrl?: string;
}

export default function SafetyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["safety-notices"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/notices");
      if (!res.ok) throw new Error("Failed to fetch notices");
      return res.json();
    },
  });

  const safetyList: SafetyNotice[] = React.useMemo(() => {
    if (!data) return [];
    return Array.isArray(data) ? data : data.notices || data.data || [];
  }, [data]);

  const getSeverityTheme = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          color: "destructive",
          accent: "text-red-600",
          border: "border-red-100",
          bg: "bg-red-20/30",
          glow: "shadow-red-100/50",
        };
      case "medium":
        return {
          color: "default",
          accent: "text-amber-600",
          border: "border-amber-100",
          bg: "bg-amber-50/30",
          glow: "shadow-amber-200/50",
        };
      default:
        return {
          color: "secondary",
          accent: "text-blue-600",
          border: "border-blue-100",
          bg: "bg-blue-50/30",
          glow: "shadow-blue-200/50",
        };
    }
  };

  if (isError) return <ErrorState />;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Sophisticated Header Section */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[20px_20px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 rounded-full border-slate-200 bg-white text-slate-500 font-medium tracking-tight shadow-sm"
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Live Safety Network
          </Badge>
          <h1 className="text-5xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Safety{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Notices
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Protecting Adama City through transparent, real-time communication.
            Stay informed about your surroundings.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pb-24">
        {/* 2. Stats Section with "Neumorphic" touches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 ">
          {isLoading ? (
            <StatsSkeleton />
          ) : (
            <>
              <StatCard
                label="Critical Alerts"
                count={safetyList.filter((n) => n.severity === "high").length}
                color="text-red-600"
                icon={AlertTriangle}
              />
              <StatCard
                label="Active Warnings"
                count={safetyList.filter((n) => n.severity === "medium").length}
                color="text-amber-600"
                icon={AlertCircle}
              />
              <StatCard
                label="General Info"
                count={safetyList.filter((n) => n.severity === "low").length}
                color="text-blue-600"
                icon={Info}
              />
            </>
          )}
        </div>

        {/* 3. The Feed: Focus on White Space & Image Masking */}
        <div className="space-y-16">
          {isLoading ? (
            <FeedSkeleton />
          ) : (
            safetyList.map((notice) => {
              const theme = getSeverityTheme(notice.severity);
              return (
                <Card
                  key={notice.id}
                  className={`group border-none shadow-2xl ${theme.glow} rounded-[2.5rem] overflow-hidden bg-white`}
                >
                  <div className=" max-h-80 flex flex-col lg:flex-row items-stretch">
                    {/* Image with Overlays */}
                    <div className="relative w-full lg:w-105 min-h-55 bg-slate-100 overflow-hidden">
                      {notice.imageUrl ? (
                        <Image
                          src={notice.imageUrl}
                          alt={notice.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                          <ShieldCheck className="w-20 h-20 text-slate-200" />
                        </div>
                      )}
                      <div className="absolute top-8 left-8">
                        <Badge
                          variant={theme.color as any}
                          className="font-bold tracking-tighter uppercase px-4 py-1.5 rounded-xl shadow-lg"
                        >
                          {notice.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content with Layered Typography */}
                    <div className="flex-1 px-8 py-4 md:px-14 lg:px-16">
                      <div className="flex flex-wrap items-center gap-6 mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />{" "}
                          {notice.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />{" "}
                          {new Date(notice.createdAt).toDateString()}
                        </div>
                      </div>

                      <CardTitle className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                        {notice.title}
                      </CardTitle>

                      <CardDescription className="text-lg text-slate-600 leading-relaxed mb-6 max-w-2xl">
                        {notice.description}
                      </CardDescription>

                      {/* Glassmorphism Tips Box */}
                      <div
                        className={`${theme.bg} backdrop-blur-sm rounded-3xl px-8 py-4 border ${theme.border} relative overflow-hidden`}
                      >
                        <div className="relative z-10">
                          <h4
                            className={`text-xs font-black uppercase tracking-widest ${theme.accent} mb-4 flex items-center gap-2`}
                          >
                            <BellRing className="w-4 h-4" /> Recommended Action
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {notice.tips?.map((tip, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 text-sm font-semibold text-slate-700"
                              >
                                <div
                                  className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${theme.accent.replace(
                                    "text",
                                    "bg"
                                  )}`}
                                />
                                {tip}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Call to Action */}
      <div className="mt-24 p-12 md:px-20   bg-[#272F38] text-white relative overflow-hidden">
        <div className="absolute -bottom-24 -right-24 h-96 w-96 bg-gray-600/20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <BellRing className="h-12 w-12 text-blue-500 mb-8" />
          <h2 className="text-4xl md:text-3xl font-black mb-6 tracking-tighter">
            Stay informed, <br />
            stay safe.
          </h2>
          <p className="text-xl text-slate-400 mb-10 leading-relaxed">
            Subscribe to our emergency alert system to receive SMS and email
            notifications regarding critical incidents in Adama City.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-8 h-16 outline-none focus:ring-4 ring-blue-500/50 transition-all"
            />
            <button className="bg-blue-600 hover:bg-blue-700 h-16 px-10 rounded-2xl font-black flex items-center justify-center gap-2 group transition-all">
              Subscribe{" "}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components for better Clean Code ---

function StatCard({ label, count, color, icon: Icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-blue-200 transition-all">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
          {label}
        </p>
        <h3 className={`text-3xl font-black ${color} tracking-tighter`}>
          {count}
        </h3>
      </div>
      <div
        className={`p-4 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform`}
      >
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <div className="bg-red-50 p-8 rounded-[3rem] border border-red-100 mb-6">
        <SearchX className="w-16 h-16 text-red-500" />
      </div>
      <h2 className="text-3xl font-black text-slate-900">System Offline</h2>
      <p className="text-slate-500 mt-2">
        The safety database is currently unreachable. <br />
        Please try again in a moment.
      </p>
    </div>
  );
}

function StatsSkeleton() {
  return Array(3)
    .fill(0)
    .map((_, i) => (
      <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />
    ));
}

function FeedSkeleton() {
  return Array(2)
    .fill(0)
    .map((_, i) => (
      <Skeleton key={i} className="h-[400px] w-full rounded-[3rem]" />
    ));
}

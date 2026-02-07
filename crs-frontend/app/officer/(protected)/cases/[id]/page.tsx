// "use client";

// import { useEffect } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   MapPin,
//   Calendar,
//   User,
//   FileText,
//   ImageIcon,
//   Video,
//   Download,
// } from "lucide-react";

// export default function CaseDetailPage() {
//   const router = useRouter();
//   const params = useParams();
//   const caseId = params?.id as string;

//   // useEffect(() => {
//   //   const auth = localStorage.getItem("officerAuth")
//   //   if (!auth) {
//   //     router.push("/officer/login")
//   //   }
//   // }, [router])

//   // Mock case data
//   const caseData = {
//     id: caseId,
//     type: "Theft",
//     location: "Main Street Market, Stall #15",
//     coordinates: { lat: 8.54, lng: 39.27 },
//     status: "investigating",
//     priority: "high",
//     date: "2024-01-20",
//     time: "14:30",
//     reporter: {
//       name: "Anonymous",
//       contact: "Not provided",
//     },
//     description:
//       "Multiple items were stolen from the market stall including electronics and cash. The suspect was wearing a black hoodie and jeans. CCTV footage is available from nearby shops.",
//     suspects:
//       "Male, approximately 25-30 years old, 5'10\", wearing black hoodie and blue jeans, last seen heading south.",
//     witnesses:
//       "Market vendor from adjacent stall witnessed the incident. Contact: 0912-345-678",
//     evidence: [
//       { type: "image", name: "scene_photo_1.jpg", size: "2.4 MB" },
//       { type: "image", name: "scene_photo_2.jpg", size: "1.8 MB" },
//       { type: "video", name: "cctv_footage.mp4", size: "15.2 MB" },
//     ],
//     timeline: [
//       {
//         date: "2024-01-20T14:45:00",
//         status: "Submitted",
//         officer: "System",
//         note: "Report received",
//       },
//       {
//         date: "2024-01-20T15:00:00",
//         status: "Assigned",
//         officer: "Sergeant Brown",
//         note: "Case assigned to Officer Martinez",
//       },
//       {
//         date: "2024-01-20T16:30:00",
//         status: "Investigating",
//         officer: "Officer Martinez",
//         note: "Evidence collected from scene",
//       },
//       {
//         date: "2024-01-21T09:00:00",
//         status: "Investigating",
//         officer: "Officer Martinez",
//         note: "Witness interviews conducted",
//       },
//     ],
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6">
//           <Button
//             variant="ghost"
//             onClick={() => router.back()}
//             className="mb-4"
//           >
//             ← Back to Cases
//           </Button>
//           <div className="flex items-start justify-between">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Case {caseData.id}</h1>
//               <p className="text-muted-foreground">{caseData.type}</p>
//             </div>
//             <div className="flex gap-2">
//               <Badge variant="default">Investigating</Badge>
//               <Badge variant="destructive">High Priority</Badge>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-6">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Case Overview */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Case Overview</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Location
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       <p className="font-medium">{caseData.location}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Date & Time
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       <p className="font-medium">
//                         {new Date(caseData.date).toLocaleDateString()} at{" "}
//                         {caseData.time}
//                       </p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Reporter
//                     </p>
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4" />
//                       <p className="font-medium">{caseData.reporter.name}</p>
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground mb-1">
//                       Contact
//                     </p>
//                     <p className="font-medium">{caseData.reporter.contact}</p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Description */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Incident Description</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground leading-relaxed">
//                   {caseData.description}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Suspect Information */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Suspect Information</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground leading-relaxed">
//                   {caseData.suspects}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Witnesses */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Witnesses</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground leading-relaxed">
//                   {caseData.witnesses}
//                 </p>
//               </CardContent>
//             </Card>

//             {/* Evidence */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Evidence Files</CardTitle>
//                 <CardDescription>
//                   {caseData.evidence.length} files attached
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   {caseData.evidence.map((file, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center justify-between p-3 bg-muted rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         {file.type === "image" && (
//                           <ImageIcon className="h-5 w-5 text-muted-foreground" />
//                         )}
//                         {file.type === "video" && (
//                           <Video className="h-5 w-5 text-muted-foreground" />
//                         )}
//                         <div>
//                           <p className="font-medium text-sm">{file.name}</p>
//                           <p className="text-xs text-muted-foreground">
//                             {file.size}
//                           </p>
//                         </div>
//                       </div>
//                       <Button variant="ghost" size="sm">
//                         <Download className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Add Note */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Add Investigation Note</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="note">Note</Label>
//                     <Textarea
//                       id="note"
//                       placeholder="Add details about investigation progress..."
//                       className="min-h-[100px]"
//                     />
//                   </div>
//                   <Button>Add Note</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Actions */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <Button className="w-full">Update Status</Button>
//                 <Button variant="outline" className="w-full bg-transparent">
//                   <MapPin className="mr-2 h-4 w-4" />
//                   View on Map
//                 </Button>
//                 <Button variant="outline" className="w-full bg-transparent">
//                   <FileText className="mr-2 h-4 w-4" />
//                   Generate Report
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Timeline */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Case Timeline</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {caseData.timeline.map((event, index) => (
//                     <div key={index} className="flex gap-3">
//                       <div className="flex flex-col items-center">
//                         <div
//                           className={`w-2 h-2 rounded-full ${
//                             index === caseData.timeline.length - 1
//                               ? "bg-primary"
//                               : "bg-muted-foreground"
//                           }`}
//                         />
//                         {index < caseData.timeline.length - 1 && (
//                           <div className="w-0.5 h-full bg-border mt-1" />
//                         )}
//                       </div>
//                       <div className="flex-1 pb-4">
//                         <p className="font-semibold text-sm mb-1">
//                           {event.status}
//                         </p>
//                         <p className="text-xs text-muted-foreground mb-1">
//                           {new Date(event.date).toLocaleString()}
//                         </p>
//                         <p className="text-xs text-muted-foreground mb-1">
//                           by {event.officer}
//                         </p>
//                         <p className="text-sm">{event.note}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { FinalReportForm } from "@/components/officer/FinalReportForm"; // Import Added
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatDistanceToNow, format } from "date-fns";
import {
  AlertCircle,
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  Download,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface CrimeType {
  id: number;
  name: string;
  description: string;
}

interface Location {
  city: string;
  subCity: string;
  kebele: string;
}

interface AssignedOfficer {
  user: {
    fullName: string;
  };
}

interface Evidence {
  id: string;
  reportId: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO";
  url: string;
  publicId: string;
  format: string;
  sizeBytes: number;
  createdById: string | null;
  createdAt: string;
}

interface Officer {
  id: string;
  user: { fullName: string };
  activeCaseCount: number;
  reputation: { rating: number };
}

interface Report {
  id: string;
  title: string;
  description: string;
  reporterName: string | null;
  reporterPhone: string | null;
  reporterEmail: string | null;
  isAnonymous: boolean;
  crimeTypeId: number;
  status: string;
  priority: string;
  channel: string;
  locationId: string | null;
  lat: number;
  lng: number;
  aiCrimeTypeSuggestion: string | null;
  aiSeverityScore: number | null;
  aiSummary: string | null;
  createdById: string | null;
  assignedOfficerId: string | null;
  createdAt: string;
  updatedAt: string;
  caseNumber: string;
  crimeType: CrimeType;
  location: Location | null;
  assignedOfficer: AssignedOfficer | null;
  evidence: Evidence[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "default";
    case "LOW":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "destructive";
    case "PENDING_REVIEW":
      return "secondary";
    case "APPROVED":
      return "default";
    case "IN_PROGRESS":
      return "default";
    case "RESOLVED":
      return "secondary";
    case "CLOSED":
      return "outline";
    case "REJECTED":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const ReportDetailSkeleton = () => (
  <div className="space-y-6 max-w-4xl">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default function CasetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("officerUser");
    if (!storedUser) {
      router.push("/officer/login");
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    if (!user || !reportId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("officerToken") || "";
        const response = await fetch(
          `http://localhost:4000/api/reports/${reportId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Report not found");
            return;
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.report) {
          setReport(data.report);
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Error fetching report:", err);
        setError(err instanceof Error ? err.message : "Failed to load report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user, reportId]);

  // Fetch on-duty officers (only when modal is open)
  const {
    data: officersResponse,
    isLoading: officersLoading,
    error: officersError,
  } = useQuery<{ success: boolean; officers: Officer[]; count: number }>({
    queryKey: ["available-officers", assignModalOpen],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken") || "";
      const res = await fetch("http://localhost:4000/api/officers/on-duty", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Fetch officers failed:", res.status, errText);
        throw new Error(`Failed to fetch officers: ${res.status} - ${errText}`);
      }

      const body = await res.json();
      console.log("[DEBUG] Officers API response:", body); // Debug log

      if (!body.success) {
        throw new Error(body.error || "API returned failure");
      }

      return body;
    },
    enabled: assignModalOpen && !!user,
    retry: 1,
  });

  // Extract and sort officers safely
  const officersData = officersResponse?.officers || [];
  const sortedOfficers = [...officersData].sort((a, b) => {
    if (a.activeCaseCount !== b.activeCaseCount) {
      return a.activeCaseCount - b.activeCaseCount;
    }
    return b.reputation.rating - a.reputation.rating;
  });

  // Mutation to update report status (approve/reject)
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const token = localStorage.getItem("officerToken") || "";
      const res = await fetch(`http://localhost:4000/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: (data) => {
      setReport(data.report);
    },
  });

  // Mutation to assign/reassign officer
  const assignOfficerMutation = useMutation({
    mutationFn: async (officerId: string) => {
      console.log("[DEBUG] Assigning officer payload:", {
        reportId,
        officerId,
      });
      const token = localStorage.getItem("officerToken") || "";
      const res = await fetch("http://localhost:4000/api/assignments/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId, officerId }),
      });
      if (!res.ok) throw new Error("Failed to assign officer");
      return res.json();
    },
    onSuccess: () => {
      // Refetch report to show updated assigned officer
      fetch(`http://localhost:4000/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("officerToken") || ""}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.report) setReport(data.report);
        });
      setAssignModalOpen(false);
    },
  });

  const handleAddNote = async () => {
    if (!noteText.trim() || !report) return;

    try {
      setSubmittingNote(true);
      const token = localStorage.getItem("officerToken") || "";
      const response = await fetch(
        `http://localhost:4000/api/reports/${report.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes: noteText }),
        }
      );

      if (response.ok) {
        setNoteText("");
        const updatedResponse = await fetch(
          `http://localhost:4000/api/reports/${report.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await updatedResponse.json();
        if (data.success && data.report) {
          setReport(data.report);
        }
      }
    } catch (err) {
      console.error("Error adding note:", err);
    } finally {
      setSubmittingNote(false);
    }
  };

  if (!user) return null;

  const isPending = ["NEW", "PENDING_REVIEW"].includes(report?.status || "");
  const hasAssigned = !!report?.assignedOfficerId;

  return (
    <div className="flex h-screen bg-background">
      <OfficerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3">
          <div className="p-8 w-full col-span-2">
            <Button
              variant="ghost"
              onClick={() => router.push("/officer/reports")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
            </Button>

            {loading && <ReportDetailSkeleton />}

            {error && (
              <Card className="border-destructive mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error loading report</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!loading && !error && report && (
              <div className="space-y-6 max-w-4xl">
                {/* Report Header */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">
                          Case {report.caseNumber}
                        </p>
                        <h1 className="text-3xl font-bold">{report.title}</h1>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        <Badge variant={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Badge variant={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Case Overview */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg">Case Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Location
                          </p>
                          <p className="text-sm">
                            {report.location
                              ? `${report.location.city}, ${
                                  report.location.subCity || "N/A"
                                }`
                              : "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Date & Time
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(report.createdAt),
                              "MMM d, yyyy HH:mm"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <User className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Reporter
                          </p>
                          <p className="text-sm">
                            {report.isAnonymous
                              ? "Anonymous"
                              : report.reporterName || "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            Contact
                          </p>
                          <p className="text-sm">
                            {report.reporterPhone ||
                              report.reporterEmail ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Incident Description */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg">
                      Incident Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">
                      {report.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Suspect Information */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg">
                      Suspect Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">
                      {report.aiSummary ||
                        "No suspect information available at this time. Investigation in progress."}
                    </p>
                  </CardContent>
                </Card>

                {/* Witnesses */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg">Witnesses</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm leading-relaxed">
                      Witness information will be updated as the investigation
                      progresses.
                    </p>
                  </CardContent>
                </Card>

                {/* Evidence */}
                {report.evidence?.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4 border-b">
                      <CardTitle className="text-lg">Evidence Files</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {report.evidence.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-4 bg-muted rounded-lg border"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-semibold">
                                {file.publicId.split("/").pop() ||
                                  "Evidence file"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {file.type} • {formatFileSize(file.sizeBytes)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" asChild>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={file.url} download>
                                  <Download className="w-4 h-4" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Add Note */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4 border-b">
                    <CardTitle className="text-lg">
                      Add Investigation Note
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <Textarea
                      placeholder="Add your investigation notes here..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                    <Button
                      onClick={handleAddNote}
                      disabled={submittingNote || !noteText.trim()}
                      className="w-full"
                    >
                      {submittingNote ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding Note...
                        </>
                      ) : (
                        "Add Note"
                      )}
                    </Button>
                  </CardContent>
                </Card>
                {/* Evidence Section */}
                {/* ... (existing evidence section) ... */}

                {/* Final Report Section - Officer Only */}
                {report && report.status !== "CLOSED" && report.status !== "RESOLVED" && report.assignedOfficerId === user.id && (
                     <FinalReportForm reportId={report.id} />
                )}
                
              </div>
            )}
          </div>

          {/* Sidebar – Actions & Timeline */}
          <div className="w-full mt-20 flex flex-col gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-3">
                  {/* Approve/Reject */}
                  {(report?.status === "NEW" ||
                    report?.status === "PENDING_REVIEW") && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Approve/Reject{" "}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatusMutation.mutate("APPROVED")
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatusMutation.mutate("REJECTED")
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Update Status */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        disabled={updatingStatus}
                      >
                        {updatingStatus ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            Update Status{" "}
                            <ChevronDown className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      <DropdownMenuItem
                        onClick={() => updateStatusMutation.mutate("NEW")}
                      >
                        NEW
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatusMutation.mutate("IN_PROGRESS")
                        }
                      >
                        IN_PROGRESS
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStatusMutation.mutate("RESOLVED")}
                      >
                        RESOLVED
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStatusMutation.mutate("CLOSED")}
                      >
                        CLOSED
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Assign/Reassign Officer */}
                  <Dialog
                    open={assignModalOpen}
                    onOpenChange={setAssignModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        {hasAssigned ? "Reassign Officer" : "Assign Officer"}
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>
                          {hasAssigned ? "Reassign Officer" : "Assign Officer"}
                        </DialogTitle>
                        {hasAssigned && report?.assignedOfficer && (
                          <DialogDescription>
                            Currently assigned to:{" "}
                            <strong>
                              {report.assignedOfficer.user.fullName}
                            </strong>
                          </DialogDescription>
                        )}
                      </DialogHeader>

                      <div className="max-h-96 overflow-y-auto">
                        {officersLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin h-6 w-6" />
                          </div>
                        ) : officersError ? (
                          <p className="text-center py-4 text-destructive">
                            Error loading officers: {officersError.message}
                          </p>
                        ) : sortedOfficers.length === 0 ? (
                          <p className="text-center py-4 text-muted-foreground">
                            No on-duty officers available
                          </p>
                        ) : (
                          sortedOfficers.map((officer) => (
                            <div
                              key={officer.id}
                              className={`p-4 border-b flex justify-between items-center cursor-pointer hover:bg-muted ${
                                report?.assignedOfficerId === officer.id
                                  ? "bg-blue-50 border-blue-300"
                                  : ""
                              }`}
                              onClick={() =>
                                assignOfficerMutation.mutate(officer.id)
                              }
                            >
                              <div>
                                <p className="font-semibold">
                                  {officer.user.fullName}
                                  {report?.assignedOfficerId === officer.id && (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 text-xs"
                                    >
                                      Current
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Cases: {officer.activeCaseCount} | Rating:{" "}
                                  {officer.reputation.rating}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={assignOfficerMutation.isPending}
                              >
                                {report?.assignedOfficerId === officer.id
                                  ? "Reassign"
                                  : "Assign"}
                              </Button>
                            </div>
                          ))
                        )}
                      </div>

                      {assignOfficerMutation.isPending && (
                        <div className="flex justify-center py-2">
                          <Loader2 className="animate-spin h-5 w-5" />
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* View on Map */}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() =>
                      router.push(
                        `/officer/map-two?lat=${report.lat}&lng=${report.lng}`
                      )
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>

                  {/* Generate Report */}
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    disabled
                  >
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Case Timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="text-lg">Case Timeline</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {report ? (
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full mt-1.5"></div>
                        <div className="w-0.5 h-12 bg-muted my-1"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          Report Submitted
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(report.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>

                    {report.status !== "NEW" && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                          <div className="w-0.5 h-12 bg-muted my-1"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Status: {report.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(report.updatedAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {report.assignedOfficerId && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Assigned to Officer
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {report.assignedOfficer?.user?.fullName ||
                              "Unassigned"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No timeline available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

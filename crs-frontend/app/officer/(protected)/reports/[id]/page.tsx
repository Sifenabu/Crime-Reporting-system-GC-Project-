"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import FinalReportForm from "./components/FinalReportForm";

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
  statusHistory?: StatusHistoryEntry[];
}

interface StatusHistoryEntry {
  id: string;
  oldStatus: string | null;
  newStatus: string;
  comment: string | null;
  createdAt: string;
  changedBy: {
    fullName: string;
  } | null;
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

const investigationSchema = z.object({
  status: z.enum(["NEW", "PENDING_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"]),
  note: z.string().min(10, "Investigation note must be at least 10 characters"),
  decisionComment: z.string().optional(),
});

type InvestigationFormData = z.infer<typeof investigationSchema>;

export default function ReportDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;
  const queryClient = useQueryClient();

  const [user, setUser] = useState<any>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InvestigationFormData>({
    resolver: zodResolver(investigationSchema),
    defaultValues: {
      status: "IN_PROGRESS",
      note: "",
      decisionComment: "",
    },
  });

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

  // Set default status when report loads
  useEffect(() => {
    if (report) {
      // safe cast or validate status matches enum
      setValue("status", report.status as any);
    }
  }, [report, setValue]);

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

  // Mutation to update priority (NEW)
  const updatePriorityMutation = useMutation({
    mutationFn: async (newPriority: string) => {
      const token = localStorage.getItem("officerToken") || "";
      const res = await fetch(`http://localhost:4000/api/reports/${reportId}/priority`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ priority: newPriority }),
      });
      if (!res.ok) throw new Error("Failed to update priority");
      return res.json();
    },
    onSuccess: (data) => {
      setReport(data.report);
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      toast.success(`Priority updated to ${data.report.priority}`);
    },
    onError: () => {
        toast.error("Failed to update priority");
    }
  });

  // Mutation to assign/reassign officer
  const assignOfficerMutation = useMutation({
    mutationFn: async (officerId: string) => {
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

  const onSubmitInvestigation = async (data: InvestigationFormData) => {
    if (!report) return;

    try {
      const token = localStorage.getItem("officerToken") || "";
      const response = await fetch(
        `http://localhost:4000/api/reports/${report.id}/investigation`,
        {
          method: "PATCH", // Using PATCH as per plan (or POST if preferred)
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to submit investigation result");

      const result = await response.json();
      
      toast.success("Investigation updated successfully");
      reset(); // clear form
      
      // Update local state or invalidate query
      if (result.report) {
        setReport(result.report);
      }
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      
    } catch (err) {
      console.error("Error submitting investigation:", err);
      toast.error("Failed to submit investigation result");
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
                          <p className="text-sm font-medium">
                            {/* Extract plain text location from description if present */}
                            {report.description.startsWith("Location:") 
                              ? report.description.split("\n\n")[0].replace("Location: ", "")
                              : report.location
                                ? `${report.location.city}, ${report.location.subCity || ""}`
                                : "No location specified"}
                          </p>
                          {(report.lat && report.lng) && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Coordinates: {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                            </p>
                          )}
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
                          {report.isAnonymous ? (
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              Anonymous Reporter
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{report.reporterName || "Name not provided"}</p>
                              {report.reporterPhone && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {report.reporterPhone}
                                </div>
                              )}
                              {report.reporterEmail && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span className="w-3 h-3 flex items-center justify-center">@</span>
                                  {report.reporterEmail}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Hide separate Contact section since it's merged above */}
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

                {/* Investigation History */}
                {report.statusHistory && report.statusHistory.length > 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-4 border-b">
                      <CardTitle className="text-lg">Investigation History</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Timeline of status changes and investigation notes
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {report.statusHistory.map((entry, index) => (
                          <div
                            key={entry.id}
                            className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                          >
                            <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-600" />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="text-sm font-semibold">
                                    Status changed to{" "}
                                    <Badge variant={getStatusColor(entry.newStatus)} className="ml-1">
                                      {entry.newStatus}
                                    </Badge>
                                  </p>
                                  {entry.changedBy && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      By {entry.changedBy.fullName}
                                    </p>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatDistanceToNow(new Date(entry.createdAt), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                              {entry.comment && (
                                <div className="mt-2 p-3 bg-muted/50 rounded-md border">
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {entry.comment}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Investigation Result Form */}
                <Card className="border-0 shadow-sm ring-1 ring-border/50">
                  <CardHeader className="pb-4 border-b bg-slate-50/50">
                    <CardTitle className="text-lg flex items-center gap-2">
                       Investigation Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmitInvestigation)} className="space-y-6">
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Update Status
                          </label>
                          <Select 
                            onValueChange={(val) => setValue("status", val as any)}
                            defaultValue={report.status}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                              <SelectItem value="RESOLVED">Resolved</SelectItem>
                              <SelectItem value="CLOSED">Closed (No Further Action)</SelectItem>
                              <SelectItem value="REJECTED">Rejected (False Report)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Investigation Note / Summary *
                        </label>
                        <Textarea
                          placeholder="Detailed notes on findings, actions taken, and final conclusion..."
                          className="min-h-32 resize-y"
                          {...register("note")}
                        />
                        {errors.note && (
                          <p className="text-xs text-red-600">{errors.note.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Internal Decision Comment (Optional)
                        </label>
                        <Input
                          placeholder="Private remark for supervisors..."
                          {...register("decisionComment")}
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full md:w-auto min-w-[140px]"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Result"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Final Report Submission - Only for assigned officers */}
                {report.assignedOfficerId && 
                 (report.status === "IN_PROGRESS" || report.status === "RESOLVED") && (
                  <FinalReportForm 
                    reportId={report.id} 
                    onSuccess={() => {
                      // Refetch report to show updated status
                      fetch(`http://localhost:4000/api/reports/${reportId}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("officerToken") || ""}`,
                        },
                      })
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.success && data.report) setReport(data.report);
                        });
                    }}
                  />
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

                  {/* Update Priority (NEW) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        Update Priority{" "}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                      <DropdownMenuItem
                        onClick={() => updatePriorityMutation.mutate("LOW")}
                      >
                        LOW
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updatePriorityMutation.mutate("MEDIUM")}
                      >
                        MEDIUM
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updatePriorityMutation.mutate("HIGH")}
                      >
                        HIGH
                      </DropdownMenuItem>
                       <DropdownMenuItem
                        onClick={() => updatePriorityMutation.mutate("CRITICAL")}
                      >
                        CRITICAL
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

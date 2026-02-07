"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { ReportForm } from "@/components/report-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
interface Evidence {
  id: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

interface Report {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  lat: number;
  lng: number;
  location: string;
  reporterName: string | null;
  reporterEmail: string | null;
  reporterPhone: string | null;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  crimeType: {
    id: string;
    name: string;
  };
  evidence: Evidence[];
}

interface ReportsResponse {
  reports: Report[];
  total: number;
}

export default function ReportsManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const router = useRouter(); // Initialize router

  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reportsData, isLoading } = useQuery<ReportsResponse>({
    queryKey: ["reports-management"],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken");
      const response = await fetch("http://localhost:4000/api/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      return response.json();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("officerToken");
      const response = await fetch(`http://localhost:4000/api/reports/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete report");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports-management"] });
      toast.success("Report deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete report");
    },
  });

  const reports = reportsData?.reports || [];

  // Client-side filtering
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || report.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || report.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    const colors = {
      NEW: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      PENDING:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      IN_PROGRESS:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      ASSIGNED:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      CLOSED:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    };
    return (
      <Badge
        className={
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      HIGH: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      MEDIUM:
        "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      LOW: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      <Badge
        className={
          colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-700"
        }
      >
        {priority}
      </Badge>
    );
  };

  // const handleViewDetail = (report: Report) => {
  //   setSelectedReport(report);
  //   setIsDetailOpen(true);
  // };
  const handleViewDetail = (report: Report) => {
    router.push(`/officer/reports/${report.id}`);
  };
  const handleEdit = (report: Report) => {
    setEditingReport(report);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingReport(null);
    queryClient.invalidateQueries({ queryKey: ["reports-management"] });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#1F2937]">
            Reports Management
          </h1>
          <p className="text-muted-foreground">
            Manage all crime reports with full CRUD capabilities
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-[#003366] hover:bg-[#002244]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
          <CardDescription>
            Total: {filteredReports.length} reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case number, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Number</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Crime Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentReports.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentReports.map((report) => (
                    <TableRow
                      key={report.id}
                      onClick={() => handleViewDetail(report)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-mono font-semibold">
                        {report.caseNumber}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          <p className="font-medium truncate">{report.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {report.description.substring(0, 60)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{report.crimeType.name}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(report)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(report)}
                            title="Edit Report"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(report.id)}
                            title="Delete Report"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredReports.length)} of{" "}
                {filteredReports.length} reports
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-[#003366]" : ""}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Full information about the crime report
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {selectedReport.caseNumber}
                  </h3>
                  <h4 className="text-lg font-semibold text-muted-foreground">
                    {selectedReport.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedReport.status)}
                  {getPriorityBadge(selectedReport.priority)}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Crime Type
                    </p>
                    <p className="font-semibold">
                      {selectedReport.crimeType.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Location
                    </p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedReport.location}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Coordinates: {selectedReport.lat.toFixed(6)},{" "}
                      {selectedReport.lng.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Reporter
                    </p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p>
                        {selectedReport.isAnonymous
                          ? "Anonymous"
                          : selectedReport.reporterName || "N/A"}
                      </p>
                    </div>
                    {!selectedReport.isAnonymous &&
                      selectedReport.reporterEmail && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedReport.reporterEmail}
                        </p>
                      )}
                    {!selectedReport.isAnonymous &&
                      selectedReport.reporterPhone && (
                        <p className="text-sm text-muted-foreground">
                          {selectedReport.reporterPhone}
                        </p>
                      )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Reported Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>
                        {new Date(selectedReport.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </p>
                    <p>{new Date(selectedReport.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Description
                </p>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              {/* Evidence Gallery */}
              {selectedReport.evidence.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Evidence ({selectedReport.evidence.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedReport.evidence.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        {item.fileType === "IMAGE" ? (
                          <Image
                            src={item.fileUrl || "/placeholder.svg"}
                            alt="Evidence"
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        ) : item.fileType === "VIDEO" ? (
                          <video
                            src={item.fileUrl}
                            controls
                            className="w-full h-48 object-cover bg-black"
                          />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center bg-muted">
                            <p className="text-sm text-muted-foreground">
                              Document
                            </p>
                          </div>
                        )}
                        <div className="p-2 text-xs text-muted-foreground">
                          {new Date(item.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingReport ? "Edit Report" : "Create New Report"}
            </DialogTitle>
            <DialogDescription>
              {editingReport
                ? "Update the report details"
                : "Fill in the details to create a new report"}
            </DialogDescription>
          </DialogHeader>
          <ReportForm
            report={editingReport}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

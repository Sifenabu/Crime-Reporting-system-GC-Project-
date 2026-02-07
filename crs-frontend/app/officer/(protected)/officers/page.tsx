"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  getToken,
  getUser,
  canManageOfficers,
  getUserInitials,
} from "@/lib/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Eye,
  Loader2,
  UserCircle,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";

interface Officer {
  id: string;
  badgeNumber: string;
  rank: string;
  availability: string;
  user: {
    fullName: string;
    email: string;
    phone: string;
  };
  brand?: {
    profileImage?: string;
  };
  caseStats?: {
    activeCases: number;
    closedCases: number;
  };
  _count?: {
    assignments: number;
  };
}



export default function OfficersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // --- Auth & Permissions Logic ---
  const user = getUser();
  const canModify = user ? canManageOfficers(user.role) : false;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [officerToDelete, setOfficerToDelete] = useState<string | null>(null);

  const deleteOfficerMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/officers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete officer");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Officer deleted successfully");
      setShowDeleteDialog(false);
      setOfficerToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["officers"] });
    },
    onError: (error) => {
      toast.error("Failed to delete officer");
      console.error(error);
    },
  });

  const {
    data: officersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["officers"],
    queryFn: async () => {
      const token = getToken();
      // Ensure "Bearer " prefix is present
      const authHeader = token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch("http://localhost:4000/api/officers", {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please login again.");
      }

      if (!response.ok) throw new Error("Failed to fetch officers");
      const result = await response.json();
      return result.officers as Officer[];
    },
  });

  const officers = officersData || [];

  const filteredOfficers = officers.filter(
    (officer) =>
      officer.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      officer.rank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Stats Calculations ---
  const stats = {
    total: officers.length,
    onDuty: officers.filter((o) => o.availability === "ON_DUTY").length,
    offDuty: officers.filter((o) => o.availability === "OFF_DUTY").length,
    activeCases: officers.reduce(
      (sum, o) => sum + (o._count?.assignments || 0),
      0
    ),
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "ON_DUTY":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">On Duty</Badge>
        );
      case "OFF_DUTY":
        return <Badge variant="secondary">Off Duty</Badge>;
      case "BUSY":
        return <Badge className="bg-yellow-500 text-white">Busy</Badge>;
      default:
        return <Badge variant="outline">{availability}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Officer Management</h1>
          <p className="text-muted-foreground">
            Manage departmental personnel and field availability
          </p>
        </div>
        <Link href="/officer/officers/new">
          <Button className="bg-cyan-500 hover:bg-cyan-600">
            <Plus className="mr-2 h-4 w-4" />
            Add New Officer
          </Button>
        </Link>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Total Officers
            </p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              On Duty
            </p>
            <p className="text-3xl font-bold text-green-600">{stats.onDuty}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-slate-400">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Off Duty
            </p>
            <p className="text-3xl font-bold">{stats.offDuty}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-cyan-500">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Active Cases
            </p>
            <p className="text-3xl font-bold text-cyan-700">
              {stats.activeCases}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, badge number, or rank..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Officer Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Officer Details</TableHead>
                <TableHead>Badge #</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Cases</TableHead>
                <TableHead>Active Cases</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOfficers.map((officer) => (
                <TableRow
                  key={officer.id}
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/officer/officers/${officer.id}`)}
                >
                  <TableCell>
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={officer.brand?.profileImage} />
                      <AvatarFallback className="bg-cyan-100 text-cyan-800">
                        {getUserInitials(officer.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        {officer.user.fullName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {officer.user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {officer.badgeNumber}
                  </TableCell>
                  <TableCell>{officer.rank}</TableCell>
                  <TableCell>
                    {getAvailabilityBadge(officer.availability)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {(officer._count?.assignments || 0) + (officer.caseStats?.closedCases || 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-cyan-500" />
                      {officer._count?.assignments || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/officer/officers/${officer.id}`} onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                      </Link>

                      {canModify && (
                        <>
                          <Link href={`/officer/officers/edit/${officer.id}`} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit Officer"
                            >
                              <Pencil className="h-4 w-4 text-amber-600" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-50"
                            title="Delete Officer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOfficerToDelete(officer.id);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredOfficers.length === 0 && (
          <div className="p-16 text-center">
            <UserCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">
              No Officers Found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              officer account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (officerToDelete) {
                  deleteOfficerMutation.mutate(officerToDelete);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteOfficerMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          {error instanceof Error
            ? error.message
            : "An error occurred during authentication."}
        </div>
      )}
    </div>
  );
}

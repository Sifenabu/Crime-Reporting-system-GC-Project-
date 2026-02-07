"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Notice {
  id: string;
  title: string;
  type: string;
  severity: string;
  isPublished: boolean;
  imageUrl?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = "http://localhost:4000/api";

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("officerUser");
    if (!storedUser) {
      router.push("/officer/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchNotices();
  }, [router]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/notices`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNotices(data.notices || data || []);
    } catch (error) {
      toast.error("Failed to load notices");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = async (id: string) => {
  //   if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
  //     toast.error("Unauthorized");
  //     return;
  //   }

  //   if (!confirm("Are you sure?")) return;

  //   try {
  //     const response = await fetch(`${API_BASE}/notices/${id}`, {
  //       method: "DELETE",
  //     });
  //     if (!response.ok) throw new Error("Delete failed");
  //     toast.success("Notice deleted");
  //     fetchNotices();
  //   } catch (error) {
  //     toast.error("Failed to delete notice");
  //   }
  // };
  const handleDelete = async (id: string) => {
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (!confirm("Are you sure?")) return;

    // Use the proper way to get the token
    const token = localStorage.getItem("officerToken");

    if (!token) {
      toast.error("Session expired. Please login again.");
      router.push("/officer/login");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/notices/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("officerToken");
        localStorage.removeItem("officerUser");
        router.push("/officer/login");
        return;
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Delete failed");
      }

      toast.success("Notice deleted");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to delete notice");
      console.error(error);
    }
  };
  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      if (!response.ok) throw new Error("Update failed");
      toast.success("Published status updated");
      fetchNotices();
    } catch (error) {
      toast.error("Failed to update notice");
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
        return "outline";
      default:
        return "default";
    }
  };

  const canEdit = user && ["SUPER_ADMIN", "ADMIN"].includes(user.role);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex h-screen bg-background">
      <OfficerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Safety Notices</h1>
              <p className="text-muted-foreground">
                Manage and publish safety notices
              </p>
            </div>
            {canEdit && (
              <Button
                onClick={() => router.push("/officer/notices/new")}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Notice
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Notices</CardTitle>
            </CardHeader>
            <CardContent>
              {notices.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No notices yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notices.map((notice) => (
                        <TableRow key={notice.id}>
                          <TableCell>
                            {notice.imageUrl && (
                              <img
                                src={notice.imageUrl || "/placeholder.svg"}
                                alt={notice.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {notice.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{notice.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getSeverityColor(notice.severity)}>
                              {notice.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{notice.createdBy.fullName}</TableCell>
                          <TableCell>
                            {format(new Date(notice.createdAt), "MMM dd, yyyy")}
                          </TableCell>
                          <TableCell>
                            {canEdit ? (
                              <Switch
                                checked={notice.isPublished}
                                onCheckedChange={() =>
                                  handleTogglePublish(
                                    notice.id,
                                    notice.isPublished
                                  )
                                }
                              />
                            ) : (
                              <Badge
                                variant={
                                  notice.isPublished ? "default" : "secondary"
                                }
                              >
                                {notice.isPublished ? "Published" : "Draft"}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(`/officer/notices/${notice.id}`)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {canEdit && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      router.push(
                                        `/officer/notices/${notice.id}/edit`
                                      )
                                    }
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(notice.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
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
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

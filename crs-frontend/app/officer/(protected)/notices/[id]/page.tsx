// // app/officer/notices/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Notice {
  id: string;
  title: string;
  content: string;
  description: string;
  type: string;
  severity: string;
  isPublished: boolean;
  imageUrl?: string;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = "http://localhost:4000/api";

export default function NoticeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("officerUser");
    if (!storedUser) {
      router.push("/officer/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchNotice();
  }, [params.id, router]);

  const fetchNotice = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/notices/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setNotice(data.notice || data);
    } catch (error) {
      toast.error("Failed to load notice");
      router.push("/officer/notices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !["SUPER_ADMIN", "ADMIN"].includes(user.role)) {
      toast.error("Unauthorized");
      return;
    }

    if (!confirm("Are you sure? This action cannot be undone.")) return;

    try {
      const response = await fetch(`${API_BASE}/notices/${params.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      toast.success("Notice deleted");
      router.push("/officer/notices");
    } catch (error) {
      toast.error("Failed to delete notice");
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
  if (!notice)
    return (
      <div className="flex items-center justify-center h-screen">
        Notice not found
      </div>
    );

  return (
    <div className="flex h-screen bg-background">
      <OfficerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/officer/notices")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notices
          </Button>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl mb-3">
                    {notice.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{notice.type}</Badge>
                    <Badge variant={getSeverityColor(notice.severity)}>
                      {notice.severity}
                    </Badge>
                    <Badge
                      variant={notice.isPublished ? "default" : "secondary"}
                    >
                      {notice.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                {canEdit && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/officer/notices/${notice.id}/edit`)
                      }
                      className="gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {notice.imageUrl && (
                <img
                  src={notice.imageUrl || "/placeholder.svg"}
                  alt={notice.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2">Summary</h3>
                <p className="text-foreground whitespace-pre-wrap">
                  {notice.content}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Full Description</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: notice.description }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{notice.createdBy.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {notice.createdBy.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">
                    {format(new Date(notice.createdAt), "MMM dd, yyyy HH:mm")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Updated:{" "}
                    {format(new Date(notice.updatedAt), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

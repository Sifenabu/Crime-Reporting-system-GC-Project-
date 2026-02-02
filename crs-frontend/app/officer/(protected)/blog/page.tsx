"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Plus,
  Search,
  Trash2,
  Eye,
  Calendar,
  User,
  MapPin,
  Tag,
  Settings2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { api } from "@/lib/api";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  status: "PUBLISHED" | "DRAFT";
  coverImageUrl: string;
  isPinned: boolean;
  views: number;
  createdAt: string;
  author: { fullName: string };
  category: { name: string };
  crimeType?: { name: string };
  location?: { city: string; subCity: string };
  tags: Array<{ tag: { id: number; name: string } }>;
  _count: { comments: number };
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all blog posts
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const response = await fetch("http://localhost:4000/api/blog");
      if (!response.ok) throw new Error("Failed to fetch blog posts");
      return response.json();
    },
  });

  // // Delete mutation

  // const deleteMutation = useMutation({
  //   mutationFn: async (id: string) => {
  //     console.log("[Blog Delete] Attempting delete ID:", id);
  //     const response = await api.delete(`/blog/${id}`);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
  //     toast.success("Blog post deleted successfully");
  //     setDeleteId(null);
  //   },
  //   onError: (error: any) => {
  //     console.error("[Blog Delete Error]", error);
  //     const msg =
  //       error.response?.data?.message || error.message || "Failed to delete";
  //     toast.error(msg);
  //     if (error.response?.status === 401) {
  //       toast.error("Session expired. Please log in again.");
  //       logout();
  //     }
  //   },
  // });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("[Delete] Starting for ID:", id);

      // Make sure this matches exactly what you use in your Login/Form components
      const token =
        localStorage.getItem("officerToken") ||
        localStorage.getItem("officerAuth");
      if (!token) throw new Error("No token. Log in again.");

      console.log("[Delete] Token:", token.substring(0, 20) + "...");

      const response = await fetch(`http://localhost:4000/api/blog/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Delete failed: ${response.status}`);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Blog post deleted successfully!</span>
        </div>
      );
      setDeleteId(null);
    },
    onError: (error: any) => {
      console.error("[Delete Error]:", error);
      toast.error(error.message || "Failed to delete");
      if (error.message.includes("401")) {
        toast.error("Session expired. Logging out...");
        logout();
      }
    },
  });
  const posts: BlogPost[] = postsData?.posts || [];
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Community Blog
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage crime awareness articles and community updates
          </p>
        </div>
        <Link href="/officer/blog/new">
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Search blog posts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 bg-white shadow-sm border-gray-200"
        />
      </div>

      {/* Blog Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No blog posts found
            </p>
            <Link href="/admin/blog/new" className="mt-4">
              <Button variant="outline">Create your first post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="group flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 border-gray-200"
            >
              {/* Image Header with Hover Overlay */}
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={post.coverImageUrl || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge
                    variant={
                      post.status === "PUBLISHED" ? "default" : "secondary"
                    }
                    className="shadow-sm"
                  >
                    {post.status}
                  </Badge>
                  {post.isPinned && (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-sm">
                      Pinned
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>
              </CardHeader>

              <CardContent className="p-4 flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.summary}
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-[12px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate">{post.author.fullName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-blue-500" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-blue-500" />
                    <span>{post.views} views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-blue-500" />
                    <span className="truncate">{post.category.name}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-gray-50/50 border-t flex gap-2">
                <Link href={`/officer/blog/${post.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => setDeleteId(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and all associated data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // Stop the dialog from closing immediately
                if (deleteId) {
                  deleteMutation.mutate(deleteId);
                }
              }}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

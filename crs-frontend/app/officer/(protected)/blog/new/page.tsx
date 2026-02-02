// app/officer/blog/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { BlogForm } from "@/components/forms/blog-form";

export default function NewBlogPostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("officerToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch("http://localhost:4000/api/blog", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // FormData handles multipart (files + fields)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create post (${response.status})`
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Blog post created successfully!</span>
        </div>,
        { duration: 5000 }
      );

      // Refresh blog list
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });

      // Redirect back to list after short delay (to let toast show)
      setTimeout(() => {
        router.push("/officer/blog");
      }, 1500);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create blog post", {
        description: "Please check your connection or try again later.",
      });
      console.error("Blog create error:", error);
    },
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header with Back Button */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/officer/blog">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Blog Post
            </h1>
            <p className="text-muted-foreground mt-1">
              Publish crime awareness content or community updates
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b bg-muted/40 px-6 py-4">
          <h2 className="text-xl font-semibold">New Post Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below. Required fields are marked with *
          </p>
        </div>

        <BlogForm
          onSuccess={() => createMutation.mutate} // Pass mutation function
          isSubmitting={createMutation.isPending}
          onCancel={() => router.push("/officer/blog")}
        />
      </div>

      {/* Full-screen loading overlay during submission */}
      {createMutation.isPending && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md mx-4">
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-blue-600" />
            <h3 className="text-2xl font-bold mb-3">Publishing Your Post</h3>
            <p className="text-muted-foreground">
              Uploading media and saving content... Please wait
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

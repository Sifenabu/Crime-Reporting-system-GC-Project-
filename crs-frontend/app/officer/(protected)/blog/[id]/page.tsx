"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogForm } from "@/components/forms/blog-form";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  User,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch single post
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4000/api/blog/${id}`);
      if (!response.ok) throw new Error("Post not found");
      const data = await response.json();
      return data.post;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetch(`http://localhost:4000/api/blog/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Deleted successfully");
      router.push("/officer/blog");
    },
  });

  if (isLoading)
    return <div className="p-10 text-center">Loading post details...</div>;
  if (!post) return <div className="p-10 text-center">Post not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Breadcrumbs / Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
        <div className="flex gap-2">
          <Button
            variant={isEditing ? "destructive" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              "Cancel Editing"
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-2" /> Edit Post
              </>
            )}
          </Button>
          {!isEditing && (
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure?")) deleteMutation.mutate();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit: {post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm
              post={post}
              onSuccess={() => {
                setIsEditing(false);
                queryClient.invalidateQueries({ queryKey: ["blog-post", id] });
                toast.success("Post updated");
              }}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-[400px] w-full bg-gray-100">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-8">
                <div className="flex gap-2 mb-4">
                  <Badge>{post.status}</Badge>
                  <Badge variant="outline">{post.category.name}</Badge>
                </div>
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="text-xl text-gray-500 italic mb-8">
                  {post.summary}
                </p>
                <hr className="mb-8" />
                <div
                  className="prose prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="h-4 w-4" />{" "}
                  <span>Author: {post.author.fullName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />{" "}
                  <span>
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BarChart className="h-4 w-4" />{" "}
                  <span>
                    Stats: {post.views} views, {post._count.comments} comments
                  </span>
                </div>
              </CardContent>
            </Card>

            {post.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {post.tags.map((t: any) => (
                    <Badge key={t.tag.id} variant="secondary">
                      #{t.tag.name}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

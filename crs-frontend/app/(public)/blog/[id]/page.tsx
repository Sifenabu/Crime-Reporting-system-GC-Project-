"use client";

import * as React from "react"; // Required for React.use()
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

// 1. Correct the Type: params is a Promise in Next.js 15
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  // 2. Unwrap the params promise
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const {
    data: res,
    isLoading,
    error,
  } = useQuery({
    // 3. Ensure query key uses the unwrapped ID
    queryKey: ["blog-detail", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:4000/api/blog/${id}`);
      if (!response.ok) throw new Error("Failed to load post");
      return response.json();
    },
    // 4. Guard: Don't run query until ID is valid
    enabled: !!id && id !== "undefined",
  });

  const post = res?.post;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto max-w-4xl px-4 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <Skeleton className="h-[40vh] w-full rounded-xl mb-8" />
          <Skeleton className="h-12 w-3/4 mb-6" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Post Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The article may have been removed or the link is invalid.
        </p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b md:px-25 py-10 from-gray-50 to-white pb-20">
      {/* Hero Cover */}
      <div className="relative h-[55vh] min-h-[400px] w-full  overflow-hidden">
        {post.coverImageUrl ? (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover brightness-75"
            priority
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end container mx-auto px-6 pb-16">
          <div className="max-w-2xl text-white">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700 px-4 py-1 border-none">
              {post.category?.name || "Department Update"}
            </Badge>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-6 tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-sm font-medium">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <User className="h-4 w-4 text-blue-400" />
                <span>{post.author?.fullName || "Adama Police"}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 -mt-12 relative z-10">
        <article className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 border border-gray-100">
          {/* Summary Box */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-12 border-l-4 border-blue-600 shadow-inner">
            <p className="text-xl text-slate-800 leading-relaxed font-medium italic">
              {post.summary}
            </p>
          </div>

          {/* Body Content */}
          <div
            className="prose prose-blue prose-lg md:prose-xl max-w-none prose-img:rounded-2xl prose-headings:font-bold"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer Metadata */}
          <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-4">
            {post.crimeType && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-200 bg-blue-50 px-4 py-1"
              >
                #{post.crimeType.name}
              </Badge>
            )}
            {post.location && (
              <Badge
                variant="outline"
                className="text-gray-500 border-gray-200 px-4 py-1"
              >
                📍 {post.location.city}
              </Badge>
            )}
          </div>
        </article>

        <div className="mt-10">
          <Button
            variant="ghost"
            asChild
            className="hover:bg-blue-50 text-blue-700"
          >
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Safety News
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

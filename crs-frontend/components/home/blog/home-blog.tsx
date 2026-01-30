"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Newspaper, Loader2 } from "lucide-react";

export default function HomeBlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // 1. Fetch Posts from real API
  const { data: postsRes, isLoading: postsLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: () =>
      fetch("http://localhost:4000/api/blog").then((res) => res.json()),
  });

  // 2. Fetch Categories for the Filter
  const { data: catRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () =>
      fetch("http://localhost:4000/api/blog/categories").then((res) =>
        res.json()
      ),
  });

  const posts = postsRes?.posts || [];
  const categories = [
    "All",
    ...(catRes?.categories?.map((c: any) => c.name) || []),
  ];

  // 3. Filter posts based on category selection
  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((p: any) => p.category?.name === activeCategory);

  // 4. Extract the first post for the "Featured" section
  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  if (postsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Blog Grid (Real Data) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingPosts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group">
              <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-gray-100 overflow-hidden group-hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.coverImageUrl || "/placeholder.svg"}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <CardHeader className="flex-1">
                  <Badge
                    variant="secondary"
                    className="w-fit mb-3 bg-blue-50 text-blue-700 hover:bg-blue-100 border-none"
                  >
                    {post.category?.name}
                  </Badge>
                  <CardTitle className="line-clamp-2 text-xl group-hover:text-blue-700 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 mt-2 text-gray-600">
                    {post.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 border-t mt-auto">
                  <div className="flex items-center justify-between text-[13px] text-muted-foreground mt-4">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      {post.author?.fullName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

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

export default function BlogPage() {
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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full mb-4">
            <Newspaper className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Police Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            News, safety tips, and updates from the Adama City Police Department
          </p>
        </div>

        {/* Dynamic Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full px-6"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Featured Post (Real Data) */}
        {featuredPost && (
          <Card className="mb-12 overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-48 md:h-auto min-h-[350px]">
                <img
                  src={featuredPost.coverImageUrl || "/placeholder.svg"}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                <Badge className="w-fit mb-4 bg-blue-700">
                  {featuredPost.category?.name || "News"}
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6 text-lg line-clamp-3">
                  {featuredPost.summary}
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    {featuredPost.author?.fullName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {new Date(featuredPost.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Link href={`/blog/${featuredPost.id}`}>
                  <Button
                    size="lg"
                    className="bg-blue-800 hover:bg-blue-900 w-fit"
                  >
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

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

        {/* Load More Articles */}
        {posts.length > 0 && (
          <div className="text-center mt-16">
            <Button
              variant="outline"
              size="lg"
              className="rounded-md px-10 border-gray-300"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

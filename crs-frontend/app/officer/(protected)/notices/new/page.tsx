"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OfficerSidebar } from "@/components/officer-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRichTextEditor } from "@/hooks/use-rich-text-editor";
import RichTextEditor from "@/components/rich-text-editor";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API_BASE = "http://localhost:4000/api";

export default function CreateNoticePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // Fix for hydration
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    description: "",
    type: "ALERT",
    severity: "MEDIUM",
    isPublished: false,
    imageUrl: "",
  });

  const { editorContent, setEditorContent } = useRichTextEditor("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    setMounted(true); // Signal that we are now on the client
    const storedUser = localStorage.getItem("officerUser");

    if (!storedUser) {
      router.push("/officer/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!["SUPER_ADMIN", "ADMIN"].includes(parsedUser.role)) {
      toast.error("Unauthorized");
      router.push("/officer/notices");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !editorContent) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("description", editorContent);
      data.append("type", formData.type);
      data.append("severity", formData.severity);
      data.append("isPublished", String(formData.isPublished));
      if (imageFile) data.append("image", imageFile);

      const response = await fetch(`${API_BASE}/notices`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("officerToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to create notice");

      toast.success("Notice created successfully");
      router.push("/officer/notices");
    } catch (error) {
      toast.error("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  // 1. Prevent rendering during SSR
  if (!mounted) return null;

  // 2. Only show content if user is verified
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <OfficerSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">Create Safety Notice</h1>
          <p className="text-muted-foreground mb-8">
            Add a new safety notice to the system
          </p>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... (Rest of your form JSX remains the same) ... */}
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Short Summary *</Label>
                  <Textarea
                    id="content"
                    placeholder="Brief summary of the notice"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <RichTextEditor
                    content={editorContent}
                    onChange={setEditorContent}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALERT">Alert</SelectItem>
                        <SelectItem value="NOTICE">Notice</SelectItem>
                        <SelectItem value="EVENT">Event</SelectItem>
                        <SelectItem value="WANTED">Wanted</SelectItem>
                        <SelectItem value="INFO">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="severity">Severity *</Label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) =>
                        setFormData({ ...formData, severity: value })
                      }
                    >
                      <SelectTrigger id="severity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="publish"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPublished: checked })
                    }
                  />
                  <Label htmlFor="publish" className="cursor-pointer">
                    Publish immediately
                  </Label>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Create Notice"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

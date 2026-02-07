// app/officer/notices/[id]/edit/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ImageIcon } from "lucide-react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

export default function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  // Now id is safely available
  if (!id) {
    return <div>Invalid notice ID</div>;
  }
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Use useEditor with immediatelyRender: false + only StarterKit (no duplicate extensions)
  const editor = useEditor({
    extensions: [StarterKit], // ← Underline, Link, Bold, etc. are already included
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 border rounded-b-lg bg-white",
      },
    },
  });

  // Fetch token
  const getToken = () => localStorage.getItem("officerToken");

  // Fetch notice
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notice", id],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch(`http://localhost:4000/api/notices/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Notice not found");
      }
      return res.json();
    },
    enabled: !!id, // Only run if id exists
  });

  const notice = response?.notice;

  // Populate form when data loads
  useEffect(() => {
    if (notice && editor) {
      setTitle(notice.title || "");
      setContent(notice.content || "");
      setType(notice.type || "");
      setSeverity(notice.severity || "");
      setIsPublished(notice.isPublished || false);
      setImagePreview(notice.imageUrl || null);

      if (editor.isEmpty && notice.description) {
        editor.commands.setContent(notice.description);
      }
    }
  }, [notice, editor]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const token = getToken();
      if (!token) throw new Error("Authentication required");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("description", editor?.getHTML() || "");
      formData.append("type", type);
      formData.append("severity", severity);
      formData.append("isPublished", String(isPublished));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`http://localhost:4000/api/notices/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update notice");
      }
      return res.json();
    },
    onSuccess: () => {
      // Invalidate ALL related queries
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
      queryClient.invalidateQueries({ queryKey: ["notice"] }); // any other detail views

      toast.success("Notice updated successfully!");
      router.push("/officer/notices");
    },
    onError: (error: any) => {
      toast.error(error.message || "Update failed");
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto" />
        <p className="mt-4 text-muted-foreground">Loading notice...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-red-600 text-xl">
          Notice not found or access denied
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => router.push("/officer/notices")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
      </Button>

      <h1 className="text-3xl font-bold mb-8">Edit Safety Notice</h1>

      <Card>
        <CardHeader>
          <CardTitle>Notice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            {/* Title */}
            <div>
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Short Summary */}
            <div>
              <Label>Short Summary</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Rich Text */}
            <div>
              <Label>Description</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="border-b bg-gray-50 p-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                  >
                    Bold
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                  >
                    Italic
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                  >
                    • List
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                  >
                    H2
                  </Button>
                </div>
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Type & Severity */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
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
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
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

            {/* Image */}
            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 max-h-96 rounded-lg border object-contain"
                />
              )}
            </div>

            {/* Published */}
            <div className="flex items-center space-x-3">
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              <Label>Published</Label>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update Notice"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// app / officer / notices / [id] / edit / page.tsx;

// "use client";

// import { useEffect, useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Loader2, ArrowLeft } from "lucide-react";
// import { EditorContent, useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";

// const getToken = () => localStorage.getItem("officerToken");

// export default function EditNoticePage({ params }: { params: { id: string } }) {
//   const { id } = params; // ← Correct: params is already resolved
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [type, setType] = useState("");
//   const [severity, setSeverity] = useState("");
//   const [isPublished, setIsPublished] = useState(false);

//   const editor = useEditor({
//     extensions: [StarterKit], // No Underline needed — it's included
//     content: "",
//     immediatelyRender: false,
//     editorProps: {
//       attributes: {
//         class:
//           "prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4 border rounded-b-lg",
//       },
//     },
//   });

//   const { data: response, isLoading } = useQuery({
//     queryKey: ["notice", id],
//     queryFn: async () => {
//       const res = await fetch(`http://localhost:4000/api/notices/${id}`);
//       if (!res.ok) throw new Error("Failed to fetch notice");
//       return res.json();
//     },
//   });

//   const notice = response?.notice;

//   // Populate form when data loads
//   useEffect(() => {
//     if (notice && editor) {
//       setTitle(notice.title || "");
//       setContent(notice.content || "");
//       setType(notice.type || "");
//       setSeverity(notice.severity || "");
//       setIsPublished(notice.isPublished || false);
//       editor.commands.setContent(notice.description || "");
//     }
//   }, [notice, editor]);

//   const mutation = useMutation({
//     mutationFn: async () => {
//       const token = getToken();
//       if (!token) throw new Error("Not authenticated");

//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       formData.append("description", editor?.getHTML() || "");
//       formData.append("type", type);
//       formData.append("severity", severity);
//       formData.append("isPublished", String(isPublished));

//       const res = await fetch(`http://localhost:4000/api/notices/${id}`, {
//         method: "PATCH",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.json().catch(() => ({}));
//         throw new Error(err.error || "Update failed");
//       }
//       return res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notices"] });
//       queryClient.invalidateQueries({ queryKey: ["notice", id] });
//       toast.success("Notice updated successfully!");
//       router.push("/officer/notices");
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "Update failed");
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-8 text-center">
//         <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//       </div>
//     );
//   }

//   if (!notice) {
//     return <div className="p-8 text-center">Notice not found</div>;
//   }

//   return (
//     <div className="container mx-auto p-8 max-w-5xl">
//       <Button
//         variant="ghost"
//         onClick={() => router.push("/officer/notices")}
//         className="mb-6"
//       >
//         <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notices
//       </Button>

//       <h1 className="text-3xl font-bold mb-8">Edit Safety Notice</h1>

//       <Card>
//         <CardHeader>
//           <CardTitle>Notice Details</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               mutation.mutate();
//             }}
//           >
//             {/* Title */}
//             <div>
//               <Label>Title</Label>
//               <Input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Content */}
//             <div>
//               <Label>Short Summary</Label>
//               <Textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 rows={3}
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <Label>Description</Label>
//               <div className="border rounded-lg overflow-hidden">
//                 <div className="border-b bg-gray-50 p-2 flex gap-2">
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => editor?.chain().focus().toggleBold().run()}
//                   >
//                     Bold
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() => editor?.chain().focus().toggleItalic().run()}
//                   >
//                     Italic
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() =>
//                       editor?.chain().focus().toggleBulletList().run()
//                     }
//                   >
//                     Bullet List
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="ghost"
//                     onClick={() =>
//                       editor?.chain().focus().toggleHeading({ level: 2 }).run()
//                     }
//                   >
//                     H2
//                   </Button>
//                 </div>
//                 <EditorContent editor={editor} />
//               </div>
//             </div>

//             {/* Type & Severity */}
//             <div className="grid grid-cols-2 gap-6">
//               <div>
//                 <Label>Type</Label>
//                 <Select value={type} onValueChange={setType}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ALERT">Alert</SelectItem>
//                     <SelectItem value="NOTICE">Notice</SelectItem>
//                     <SelectItem value="EVENT">Event</SelectItem>
//                     <SelectItem value="WANTED">Wanted</SelectItem>
//                     <SelectItem value="INFO">Info</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label>Severity</Label>
//                 <Select value={severity} onValueChange={setSeverity}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="HIGH">High</SelectItem>
//                     <SelectItem value="MEDIUM">Medium</SelectItem>
//                     <SelectItem value="LOW">Low</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Published */}
//             <div className="flex items-center space-x-3">
//               <Switch checked={isPublished} onCheckedChange={setIsPublished} />
//               <Label>Published</Label>
//             </div>

//             <div className="flex justify-end gap-4 pt-6">
//               <Button
//                 variant="outline"
//                 type="button"
//                 onClick={() => router.back()}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={mutation.isPending}>
//                 {mutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   "Update Notice"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import type React from "react";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import { Loader2, X } from "lucide-react";
// import { useState } from "react";
// import Image from "next/image";

// const blogSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   summary: z.string().min(10, "Summary must be at least 10 characters"),
//   content: z.string().min(50, "Content must be at least 50 characters"),
//   status: z.enum(["PUBLISHED", "DRAFT"]),
//   categoryId: z.number({ required_error: "Category is required" }),
//   crimeTypeId: z.number().optional(),
//   locationId: z.number().optional(),
//   isPublic: z.boolean().default(true),
//   isPinned: z.boolean().default(false),
//   tags: z.array(z.number()).optional(),
// });

// type BlogFormData = z.infer<typeof blogSchema>;

// interface BlogFormProps {
//   post?: any;
//   onSuccess: () => void;
//   onCancel: () => void;
// }

// export function BlogForm({ post, onSuccess, onCancel }: BlogFormProps) {
//   const [coverImage, setCoverImage] = useState<File | null>(null);
//   const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
//     post?.coverImageUrl || null
//   );
//   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
//   const [mediaPreview, setMediaPreview] = useState<string[]>(
//     post?.media?.map((m: any) => m.url) || []
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm<BlogFormData>({
//     resolver: zodResolver(blogSchema),
//     defaultValues: post
//       ? {
//           title: post.title,
//           summary: post.summary,
//           content: post.content,
//           status: post.status,
//           categoryId: post.category.id,
//           crimeTypeId: post.crimeType?.id,
//           locationId: post.location?.id,
//           isPublic: post.isPublic,
//           isPinned: post.isPinned,
//           tags: post.tags?.map((t: any) => t.tag.id),
//         }
//       : {
//           status: "DRAFT",
//           isPublic: true,
//           isPinned: false,
//         },
//   });

//   // Fetch categories, crime types, locations, and tags
//   const { data: categoriesData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:4000/api/categories");
//       if (!response.ok) throw new Error("Failed to fetch categories");
//       return response.json();
//     },
//   });

//   const { data: crimeTypesData } = useQuery({
//     queryKey: ["crime-types"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:4000/api/crime-types");
//       if (!response.ok) throw new Error("Failed to fetch crime types");
//       return response.json();
//     },
//   });

//   const { data: locationsData } = useQuery({
//     queryKey: ["locations"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:4000/api/locations");
//       if (!response.ok) throw new Error("Failed to fetch locations");
//       return response.json();
//     },
//   });

//   const { data: tagsData } = useQuery({
//     queryKey: ["tags"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:4000/api/tags");
//       if (!response.ok) throw new Error("Failed to fetch tags");
//       return response.json();
//     },
//   });

//   const mutation = useMutation({
//     mutationFn: async (data: BlogFormData) => {
//       const formData = new FormData();

//       // Append text fields
//       Object.entries(data).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           if (key === "tags" && Array.isArray(value)) {
//             formData.append(key, JSON.stringify(value));
//           } else {
//             formData.append(key, value.toString());
//           }
//         }
//       });

//       // Append cover image
//       if (coverImage) {
//         formData.append("coverImage", coverImage);
//       }

//       // Append media files
//       mediaFiles.forEach((file) => {
//         formData.append("media", file);
//       });

//       const url = post
//         ? `http://localhost:4000/api/blog/${post.id}`
//         : "http://localhost:4000/api/blog";

//       const response = await fetch(url, {
//         method: post ? "PUT" : "POST",
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to save blog post");
//       return response.json();
//     },
//     onSuccess: () => {
//       toast.success(
//         post
//           ? "Blog post updated successfully"
//           : "Blog post created successfully"
//       );
//       onSuccess();
//     },
//     onError: () => {
//       toast.error("Failed to save blog post");
//     },
//   });

//   const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setCoverImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setCoverImagePreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     setMediaFiles((prev) => [...prev, ...files]);

//     files.forEach((file) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setMediaPreview((prev) => [...prev, reader.result as string]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeMedia = (index: number) => {
//     setMediaFiles((prev) => prev.filter((_, i) => i !== index));
//     setMediaPreview((prev) => prev.filter((_, i) => i !== index));
//   };

//   const onSubmit = (data: BlogFormData) => {
//     mutation.mutate(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       {/* Title */}
//       <div className="space-y-2">
//         <Label htmlFor="title">Title *</Label>
//         <Input
//           id="title"
//           {...register("title")}
//           placeholder="Enter blog post title"
//         />
//         {errors.title && (
//           <p className="text-sm text-red-600">{errors.title.message}</p>
//         )}
//       </div>

//       {/* Summary */}
//       <div className="space-y-2">
//         <Label htmlFor="summary">Summary *</Label>
//         <Textarea
//           id="summary"
//           {...register("summary")}
//           placeholder="Brief summary of the post"
//           rows={3}
//         />
//         {errors.summary && (
//           <p className="text-sm text-red-600">{errors.summary.message}</p>
//         )}
//       </div>

//       {/* Content */}
//       <div className="space-y-2">
//         <Label htmlFor="content">Content *</Label>
//         <Textarea
//           id="content"
//           {...register("content")}
//           placeholder="Full blog post content (Markdown/HTML supported)"
//           rows={8}
//         />
//         {errors.content && (
//           <p className="text-sm text-red-600">{errors.content.message}</p>
//         )}
//       </div>

//       {/* Cover Image */}
//       <div className="space-y-2">
//         <Label htmlFor="coverImage">Cover Image</Label>
//         <div className="flex items-center gap-4">
//           <Input
//             id="coverImage"
//             type="file"
//             accept="image/*"
//             onChange={handleCoverImageChange}
//             className="flex-1"
//           />
//           {coverImagePreview && (
//             <div className="relative h-20 w-32">
//               <Image
//                 src={coverImagePreview || "/placeholder.svg"}
//                 alt="Cover preview"
//                 fill
//                 className="object-cover rounded"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Media Gallery */}
//       <div className="space-y-2">
//         <Label htmlFor="media">Additional Media</Label>
//         <Input
//           id="media"
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleMediaChange}
//         />
//         {mediaPreview.length > 0 && (
//           <div className="grid grid-cols-4 gap-2 mt-2">
//             {mediaPreview.map((preview, index) => (
//               <div key={index} className="relative h-20">
//                 <Image
//                   src={preview || "/placeholder.svg"}
//                   alt={`Media ${index + 1}`}
//                   fill
//                   className="object-cover rounded"
//                 />
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="icon"
//                   className="absolute -top-2 -right-2 h-6 w-6"
//                   onClick={() => removeMedia(index)}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         {/* Category */}
//         <div className="space-y-2">
//           <Label htmlFor="categoryId">Category *</Label>
//           <Select
//             value={watch("categoryId")?.toString()}
//             onValueChange={(value) =>
//               setValue("categoryId", Number.parseInt(value))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categoriesData?.categories?.map((cat: any) => (
//                 <SelectItem key={cat.id} value={cat.id.toString()}>
//                   {cat.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           {errors.categoryId && (
//             <p className="text-sm text-red-600">{errors.categoryId.message}</p>
//           )}
//         </div>

//         {/* Crime Type */}
//         <div className="space-y-2">
//           <Label htmlFor="crimeTypeId">Crime Type</Label>
//           <Select
//             value={watch("crimeTypeId")?.toString()}
//             onValueChange={(value) =>
//               setValue("crimeTypeId", Number.parseInt(value))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select crime type" />
//             </SelectTrigger>
//             <SelectContent>
//               {crimeTypesData?.crimeTypes?.map((type: any) => (
//                 <SelectItem key={type.id} value={type.id.toString()}>
//                   {type.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Location */}
//         <div className="space-y-2">
//           <Label htmlFor="locationId">Location</Label>
//           <Select
//             value={watch("locationId")?.toString()}
//             onValueChange={(value) =>
//               setValue("locationId", Number.parseInt(value))
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select location" />
//             </SelectTrigger>
//             <SelectContent>
//               {locationsData?.locations?.map((loc: any) => (
//                 <SelectItem key={loc.id} value={loc.id.toString()}>
//                   {loc.city}, {loc.subCity}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Status */}
//         <div className="space-y-2">
//           <Label htmlFor="status">Status *</Label>
//           <Select
//             value={watch("status")}
//             onValueChange={(value) =>
//               setValue("status", value as "PUBLISHED" | "DRAFT")
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="DRAFT">Draft</SelectItem>
//               <SelectItem value="PUBLISHED">Published</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Toggles */}
//       <div className="flex items-center gap-8">
//         <div className="flex items-center gap-2">
//           <Switch
//             id="isPublic"
//             checked={watch("isPublic")}
//             onCheckedChange={(checked) => setValue("isPublic", checked)}
//           />
//           <Label htmlFor="isPublic">Public</Label>
//         </div>
//         <div className="flex items-center gap-2">
//           <Switch
//             id="isPinned"
//             checked={watch("isPinned")}
//             onCheckedChange={(checked) => setValue("isPinned", checked)}
//           />
//           <Label htmlFor="isPinned">Pinned</Label>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-2 pt-4">
//         <Button type="button" variant="outline" onClick={onCancel}>
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={mutation.isPending}
//           className="bg-blue-600 hover:bg-blue-700"
//         >
//           {mutation.isPending && (
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//           )}
//           {post ? "Update Post" : "Create Post"}
//         </Button>
//       </div>
//     </form>
//   );
// // }
// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from "sonner";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Placeholder from "@tiptap/extension-placeholder";
// import Underline from "@tiptap/extension-underline";

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
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Loader2, Upload, X } from "lucide-react";
// import Image from "next/image";

// const formSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   summary: z.string().min(20, "Summary must be at least 20 characters"),
//   content: z.string().min(1, "Content is required"),
//   categoryId: z.string().min(1, "Category is required"),
//   crimeTypeId: z.string().optional().nullable(),
//   locationId: z.string().optional().nullable(),
//   status: z.enum(["PUBLISHED", "DRAFT"]),
//   isPublic: z.boolean(),
//   isPinned: z.boolean(),
// });

// type FormValues = z.infer<typeof formSchema>;

// export function BlogForm({ post, onSuccess, onCancel }: any) {
//   const queryClient = useQueryClient();
//   const isEdit = !!post;

//   // --- 1. FIXED: Correct Location Path & Mapping ---
//   const { data: catRes } = useQuery({
//     queryKey: ["blog-categories"],
//     queryFn: () =>
//       fetch("http://localhost:4000/api/blog/categories").then((res) =>
//         res.json()
//       ),
//   });
//   const { data: crimeRes } = useQuery({
//     queryKey: ["crime-types"],
//     queryFn: () =>
//       fetch("http://localhost:4000/api/blog/crime-types").then((res) =>
//         res.json()
//       ),
//   });
//   const { data: locRes } = useQuery({
//     queryKey: ["locations"],
//     queryFn: () =>
//       fetch("http://localhost:4000/api/blog/locations").then((res) =>
//         res.json()
//       ),
//   });

//   // Extract arrays with correct object keys
//   const categories = catRes?.categories || [];
//   const crimeTypes = crimeRes?.crimeTypes || [];
//   const locations = locRes?.locations || []; // Matches backend: { locations: [...] }

//   const extensions = useMemo(() => [StarterKit, Underline], []);

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: post?.title || "",
//       summary: post?.summary || "",
//       content: post?.content || "",
//       categoryId: post?.category?.id?.toString() || "",
//       crimeTypeId: post?.crimeType?.id?.toString() || "",
//       locationId: post?.location?.id?.toString() || "",
//       status: post?.status || "DRAFT",
//       isPublic: post?.isPublic ?? true,
//       isPinned: post?.isPinned ?? false,
//     },
//   });

//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [coverPreview, setCoverPreview] = useState<string | null>(
//     post?.coverImageUrl || null
//   );

//   // TipTap editor setup - FIXED for Next.js SSR
//   const editor = useEditor(
//     {
//       extensions: [
//         StarterKit.configure({
//           heading: {
//             levels: [1, 2, 3],
//           },
//         }),
//         Placeholder.configure({
//           placeholder:
//             "Write your article here... (bold, italic, lists, headings supported)",
//         }),
//         Underline, // optional
//       ],
//       content: post?.content || "<p></p>", // Load existing content if editing
//       immediatelyRender: false, // ← This is the CRITICAL fix!
//       editorProps: {
//         attributes: {
//           class:
//             "prose prose-sm sm:prose lg:prose-lg focus:outline-none min-h-[300px] px-4 py-3",
//         },
//       },
//       onUpdate: ({ editor }) => {
//         // Sync editor HTML to react-hook-form field
//         form.setValue("content", editor.getHTML(), {
//           shouldValidate: true,
//           shouldDirty: true,
//         });
//       },
//     },
//     [post?.content, form]
//   ); // Dependencies

//   // Watch form value to update editor (two-way sync)
//   const watchedContent = form.watch("content");
//   useEffect(() => {
//     if (editor && watchedContent !== editor.getHTML()) {
//       editor.commands.setContent(watchedContent || "<p></p>", {
//         emitUpdate: false,
//       });
//     }
//   }, [watchedContent, editor]);

//   const mutation = useMutation({
//     mutationFn: async (data: FormValues) => {
//       const rawToken = localStorage.getItem("officerToken");
//       const token = rawToken?.startsWith("Bearer ")
//         ? rawToken
//         : `Bearer ${rawToken}`;

//       const formData = new FormData();

//       // Append all text fields (filter empty)
//       Object.entries(data).forEach(([key, value]) => {
//         if (value !== undefined && value !== null && value !== "") {
//           formData.append(key, value.toString());
//         }
//       });

//       // Append rich content ONLY ONCE - this is the critical fix
//       const contentHtml = editor?.getHTML() || "<p></p>";
//       formData.append("content", contentHtml);

//       // Cover image
//       if (coverFile) formData.append("coverImage", coverFile);

//       // Tags: send empty array if none (prevents backend crash)
//       formData.append("tagIds", JSON.stringify([]));

//       // Debug: log what is actually sent
//       console.log("[BlogForm Submit] FormData entries:", [
//         ...formData.entries(),
//       ]);

//       const url = isEdit
//         ? `http://localhost:4000/api/blog/${post.id}`
//         : "http://localhost:4000/api/blog";

//       const res = await fetch(url, {
//         method: isEdit ? "PATCH" : "POST",
//         body: formData,
//         headers: { Authorization: token },
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(
//           errData.error ||
//             `Server error ${res.status}: Failed to process request`
//         );
//       }

//       return res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
//       toast.success(
//         isEdit ? "Post updated successfully!" : "Post created successfully!"
//       );
//       onSuccess();
//     },
//     onError: (err: any) => {
//       console.error("Mutation error:", err);
//       toast.error(err.message || "Failed to save post");
//     },
//   });
//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
//         className="space-y-6"
//       >
//         <ScrollArea className="h-[75vh] pr-4">
//           <div className="space-y-6">
//             {/* Cover Image Upload */}
//             <div className="space-y-2">
//               <Label>Cover Image</Label>
//               {coverPreview ? (
//                 <div className="relative h-48 w-full">
//                   <Image
//                     src={coverPreview}
//                     alt="Preview"
//                     fill
//                     className="object-cover rounded-md"
//                   />
//                   <Button
//                     type="button"
//                     size="icon"
//                     variant="destructive"
//                     className="absolute top-2 right-2"
//                     onClick={() => {
//                       setCoverPreview(null);
//                       setCoverFile(null);
//                     }}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ) : (
//                 <Label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
//                   <Upload className="h-8 w-8 text-muted-foreground" />
//                   <span className="text-sm">Upload Cover</span>
//                   <input
//                     type="file"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files?.[0];
//                       if (file) {
//                         setCoverFile(file);
//                         setCoverPreview(URL.createObjectURL(file));
//                       }
//                     }}
//                   />
//                 </Label>
//               )}
//             </div>

//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Title</FormLabel>
//                   <FormControl>
//                     <Input {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="summary"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Summary</FormLabel>
//                   <FormControl>
//                     <Textarea {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* <div className="space-y-2">
//               <Label>Content</Label>
//               <div className="border rounded-md p-3 min-h-[300px] bg-white text-black prose prose-sm max-w-none">
//                 <EditorContent editor={editor} />
//               </div>
//             </div> */}
//             <div>
//               {/* FIXED Rich Text Editor */}
//               <FormField
//                 control={form.control}
//                 name="content"
//                 render={({ field }) => (
//                   <FormItem className="space-y-2">
//                     <FormLabel>Content *</FormLabel>
//                     <div className="border rounded-md overflow-hidden bg-white min-h-[400px] focus-within:ring-2 focus-within:ring-blue-500">
//                       {/* Simple Toolbar */}
//                       <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-2">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             editor?.chain().focus().toggleBold().run()
//                           }
//                           className={
//                             editor?.isActive("bold") ? "bg-gray-200" : ""
//                           }
//                         >
//                           Bold
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             editor?.chain().focus().toggleItalic().run()
//                           }
//                           className={
//                             editor?.isActive("italic") ? "bg-gray-200" : ""
//                           }
//                         >
//                           Italic
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             editor
//                               ?.chain()
//                               .focus()
//                               .toggleHeading({ level: 2 })
//                               .run()
//                           }
//                           className={
//                             editor?.isActive("heading", { level: 2 })
//                               ? "bg-gray-200"
//                               : ""
//                           }
//                         >
//                           H2
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() =>
//                             editor?.chain().focus().toggleBulletList().run()
//                           }
//                           className={
//                             editor?.isActive("bulletList") ? "bg-gray-200" : ""
//                           }
//                         >
//                           Bullet List
//                         </Button>
//                       </div>

//                       {/* Editor Area */}
//                       <div className="p-4 prose prose-sm max-w-none min-h-[300px] focus:outline-none">
//                         <EditorContent editor={editor} />
//                       </div>
//                     </div>
//                     <FormDescription>
//                       Write rich content with formatting. Minimum 100 characters
//                       required.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Dropdowns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="categoryId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Category</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Category" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {categories.map((c: any) => (
//                           <SelectItem key={c.id} value={c.id.toString()}>
//                             {c.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="crimeTypeId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Crime Type (Optional)</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       value={field.value || ""}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Crime Type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {crimeTypes.map((t: any) => (
//                           <SelectItem key={t.id} value={t.id.toString()}>
//                             {t.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* FIXED: Location dropdown logic */}
//             <FormField
//               control={form.control}
//               name="locationId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Location (Optional)</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     value={field.value || ""}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select Location" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {locations.map((l: any) => (
//                         <SelectItem key={l.id} value={l.id.toString()}>
//                           {l.city} - {l.subCity}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )}
//             />

//             <div className="flex flex-wrap gap-4 items-end">
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem className="flex-1">
//                     <FormLabel>Status</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="DRAFT">Draft</SelectItem>
//                         <SelectItem value="PUBLISHED">Published</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="isPublic"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center gap-2 space-y-0 border p-2 rounded-md">
//                     <FormLabel>Public</FormLabel>
//                     <FormControl>
//                       <Switch
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>
//         </ScrollArea>

//         <div className="flex justify-end gap-3 border-t pt-4">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             Cancel
//           </Button>
//           <Button type="submit" disabled={mutation.isPending}>
//             {mutation.isPending && (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             )}
//             Save Post
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  Upload,
  X,
  Bold,
  Italic,
  Heading2,
  List,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import { logout } from "@/lib/auth";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  content: z.string().min(1, "Content is required"),
  categoryId: z.string().min(1, "Category is required"),
  crimeTypeId: z.string().optional().nullable(),
  locationId: z.string().optional().nullable(),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  isPublic: z.boolean(),
  isPinned: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function BlogForm({ post, onSuccess, onCancel }: any) {
  const queryClient = useQueryClient();
  const isEdit = !!post;

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- Fetching Helpers ---
  const { data: catRes } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: () =>
      fetch("http://localhost:4000/api/blog/categories").then((res) =>
        res.json()
      ),
  });
  const { data: crimeRes } = useQuery({
    queryKey: ["crime-types"],
    queryFn: () =>
      fetch("http://localhost:4000/api/blog/crime-types").then((res) =>
        res.json()
      ),
  });
  const { data: locRes } = useQuery({
    queryKey: ["locations"],
    queryFn: () =>
      fetch("http://localhost:4000/api/blog/locations").then((res) =>
        res.json()
      ),
  });

  const categories = catRes?.categories || [];
  const crimeTypes = crimeRes?.crimeTypes || [];
  const locations = locRes?.locations || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      summary: post?.summary || "",
      content: post?.content || "",
      categoryId:
        post?.categoryId?.toString() || post?.category?.id?.toString() || "",
      crimeTypeId:
        post?.crimeTypeId?.toString() || post?.crimeType?.id?.toString() || "",
      locationId:
        post?.locationId?.toString() || post?.location?.id?.toString() || "",
      status: post?.status || "DRAFT",
      isPublic: post?.isPublic ?? true,
      isPinned: post?.isPinned ?? false,
    },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    post?.coverImageUrl || null
  );

  // --- TipTap Editor Setup ---
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Write your article here..." }),
      Underline,
    ],
    content: post?.content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none min-h-[300px] px-4 py-3 max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      form.setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // const mutation = useMutation({
  //   mutationFn: async (data: FormValues) => {
  //     // Logic to extract token from potential JSON or raw string
  //     const authData = localStorage.getItem("officerAuth");
  //     let token = authData;
  //     try {
  //       const parsed = JSON.parse(authData || "");
  //       token = parsed.token || parsed.accessToken || authData;
  //     } catch (e) {
  //       /* use raw if parsing fails */
  //     }

  //     const formData = new FormData();

  //     // Append all fields except content and image manually
  //     Object.entries(data).forEach(([key, value]) => {
  //       if (
  //         key !== "content" &&
  //         value !== undefined &&
  //         value !== null &&
  //         value !== ""
  //       ) {
  //         formData.append(key, value.toString());
  //       }
  //     });

  //     // Manually append correct rich content
  //     formData.append("content", editor?.getHTML() || "");
  //     if (coverFile) formData.append("coverImage", coverFile);
  //     formData.append("tagIds", JSON.stringify([]));

  //     const url = isEdit
  //       ? `http://localhost:4000/api/blog/${post.id}`
  //       : "http://localhost:4000/api/blog";

  //     const res = await fetch(url, {
  //       method: isEdit ? "PATCH" : "POST",
  //       body: formData,
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (!res.ok) {
  //       const errData = await res.json().catch(() => ({}));
  //       throw new Error(
  //         errData.message || errData.error || "Failed to save post"
  //       );
  //     }
  //     return res.json();
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
  //     toast.success(isEdit ? "Post updated!" : "Post created!");
  //     onSuccess();
  //   },
  //   onError: (err: any) => toast.error(err.message),
  // });
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // FIXED: Use the correct token key!
      const rawToken = localStorage.getItem("officerToken");
      if (!rawToken) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const token = rawToken.startsWith("Bearer ")
        ? rawToken
        : `Bearer ${rawToken}`;

      const formData = new FormData();

      // Append form fields (skip content to avoid duplicate)
      Object.entries(data).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "content"
        ) {
          formData.append(key, value.toString());
        }
      });

      // Append rich content ONLY ONCE
      const contentHtml = editor?.getHTML() || "<p></p>";
      formData.append("content", contentHtml);

      // Cover image
      if (coverFile) formData.append("coverImage", coverFile);

      // Empty tags array (prevents backend crash)
      formData.append("tagIds", JSON.stringify([]));

      // Debug: Show what is being sent
      console.log("[BlogForm Submit] Sending FormData:", [
        ...formData.entries(),
      ]);
      console.log(
        "[BlogForm Submit] Token used:",
        token.substring(0, 20) + "..."
      );

      const url = isEdit
        ? `http://localhost:4000/api/blog/${post.id}`
        : "http://localhost:4000/api/blog";

      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        body: formData,
        headers: { Authorization: token },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message || errData.error || `Server error ${res.status}`
        );
      }

      return res.json();
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    //   toast.success(
    //     isEdit ? "Post updated successfully!" : "Post created successfully!"
    //   );
    //   onSuccess();
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });

      // Show green success modal
      setShowSuccessModal(true);

      // Optional: also show toast as secondary feedback
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>
            {isEdit
              ? "Post updated successfully!"
              : "Post published successfully!"}
          </span>
        </div>,
        { duration: 4000 }
      );

      // Auto-close modal and redirect after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        onSuccess(); // Call parent success handler (usually redirects)
      }, 3000);
    },
    onError: (err: any) => {
      console.error("Create/Update error:", err);
      toast.error(err.message || "Failed to save post");
      if (err.message.includes("401")) {
        toast.error("Session expired. Logging out...");
        logout();
      }
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-6"
      >
        <ScrollArea className="h-[75vh] pr-4">
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {coverPreview ? (
                <div className="relative h-48 w-full">
                  <Image
                    src={coverPreview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setCoverPreview(null);
                      setCoverFile(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm">Upload Cover</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        setCoverPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Label>
              )}
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <FormLabel>Content</FormLabel>
              <div className="border rounded-md overflow-hidden bg-white">
                <div className="border-b bg-gray-50 p-2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-gray-200" : ""}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-gray-200" : ""}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                      editor?.isActive("heading", { level: 2 })
                        ? "bg-gray-200"
                        : ""
                    }
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    className={
                      editor?.isActive("bulletList") ? "bg-gray-200" : ""
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <EditorContent editor={editor} />
              </div>
              <FormMessage>
                {form.formState.errors.content?.message}
              </FormMessage>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Select */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* Crime Type Select */}
              <FormField
                control={form.control}
                name="crimeTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crime Type (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "none"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Crime Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {crimeTypes.map((t: any) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Location Select */}
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {locations.map((l: any) => (
                        <SelectItem key={l.id} value={l.id.toString()}>
                          {l.city} - {l.subCity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex gap-6 border p-4 rounded-md bg-gray-50/50">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Pinned</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-green-50 to-green-100 border-green-200 rounded-2xl">
          <div className="text-center py-10">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <DialogTitle className="text-3xl font-bold text-green-900 mb-3">
              Success!
            </DialogTitle>
            <p className="text-lg text-green-700 mb-6 font-medium">
              {isEdit
                ? "Your blog post has been updated successfully."
                : "Your new blog post has been published!"}
            </p>
            <p className="text-sm text-green-600/80">
              Redirecting back to the blog list in a moment...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}

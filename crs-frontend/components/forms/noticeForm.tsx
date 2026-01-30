"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { noticeSchema, NoticeFormData } from "@/lib/schemas/notice.schema";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { RichTextEditor } from "../editors/rich-text-editor";
import { ImageUploader } from "../upload/image-uploader";

export function NoticeForm({ onSuccess }: { onSuccess: () => void }) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      isPublished: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: NoticeFormData) => {
      const fd = new FormData();

      Object.entries(data).forEach(([k, v]) => {
        fd.append(k, String(v));
      });

      if (image) fd.append("image", image);

      await api.post("/notices", fd);
    },
    onSuccess: () => {
      toast.success("Notice created");
      onSuccess();
    },
    onError: () => toast.error("Failed to create notice"),
  });

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
    >
      <div>
        <Label>Title</Label>
        <Input {...form.register("title")} />
      </div>

      <div>
        <Label>Content</Label>
        <Textarea {...form.register("content")} />
      </div>

      <div>
        <Label>Description</Label>
        <RichTextEditor
          value={form.watch("description")}
          onChange={(v) => form.setValue("description", v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select onValueChange={(v) => form.setValue("type", v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALERT">Alert</SelectItem>
            <SelectItem value="NOTICE">Notice</SelectItem>
            <SelectItem value="EVENT">Event</SelectItem>
            <SelectItem value="WANTED">Wanted</SelectItem>
            <SelectItem value="INFO">Info</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(v) => form.setValue("severity", v as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ImageUploader
        preview={preview}
        onChange={(file) => {
          setImage(file);
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />

      <div className="flex items-center gap-3">
        <Switch
          checked={form.watch("isPublished")}
          onCheckedChange={(v) => form.setValue("isPublished", v)}
        />
        <Label>Publish immediately</Label>
      </div>

      <Button disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Notice"}
      </Button>
    </form>
  );
}

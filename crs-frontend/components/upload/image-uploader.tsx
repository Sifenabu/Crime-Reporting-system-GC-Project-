"use client";

import { Input } from "@/components/ui/input";

type Props = {
  onChange: (file: File | null) => void;
  preview: string | null;
};

export function ImageUploader({ onChange, preview }: Props) {
  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {preview && (
        <img
          src={preview}
          className="mt-4 h-64 rounded object-cover"
          alt="Preview"
        />
      )}
    </div>
  );
}

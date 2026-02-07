"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

const finalReportSchema = z.object({
  investigationSummary: z
    .string()
    .min(50, "Investigation summary must be at least 50 characters"),
  evidenceCollectedDescription: z.string().optional(),
  finalRecommendation: z.enum([
    "RESOLVED",
    "CLOSED",
    "ESCALATED",
    "FURTHER_INVESTIGATION",
    "CHARGED",
  ]),
});

type FinalReportFormData = z.infer<typeof finalReportSchema>;

interface FinalReportFormProps {
  reportId: string;
  onSuccess?: () => void;
}

export default function FinalReportForm({
  reportId,
  onSuccess,
}: FinalReportFormProps) {
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FinalReportFormData>({
    resolver: zodResolver(finalReportSchema),
    defaultValues: {
      finalRecommendation: "RESOLVED",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingEvidence(true);
    const token = localStorage.getItem("officerToken") || "";

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("reportId", reportId);

        const response = await fetch("http://localhost:4000/api/reports/evidence", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload evidence");

        const data = await response.json();
        if (data.evidence?.url) {
          uploadedUrls.push(data.evidence.url);
        }
      }

      setEvidenceFiles((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Evidence upload error:", error);
      toast.error("Failed to upload evidence files");
    } finally {
      setUploadingEvidence(false);
    }
  };

  const removeEvidenceFile = (url: string) => {
    setEvidenceFiles((prev) => prev.filter((f) => f !== url));
  };

  const onSubmit = async (data: FinalReportFormData) => {
    try {
      const token = localStorage.getItem("officerToken") || "";
      const response = await fetch("http://localhost:4000/api/final-reports/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId,
          ...data,
          evidenceFiles,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit final report");
      }

      toast.success("Final report submitted successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Final report submission error:", error);
      toast.error(error.message || "Failed to submit final report");
    }
  };

  return (
    <Card className="border-0 shadow-sm ring-1 ring-border/50">
      <CardHeader className="pb-4 border-b bg-blue-50/50">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Submit Final Investigation Report
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your investigation by submitting a comprehensive final report.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Investigation Summary */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Investigation Summary *
            </label>
            <Textarea
              placeholder="Provide a detailed summary of your investigation, including findings, actions taken, interviews conducted, and conclusions..."
              className="min-h-40 resize-y"
              {...register("investigationSummary")}
            />
            {errors.investigationSummary && (
              <p className="text-xs text-red-600">
                {errors.investigationSummary.message}
              </p>
            )}
          </div>

          {/* Evidence Collected Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Evidence Collected Description
            </label>
            <Textarea
              placeholder="Describe the evidence collected during the investigation..."
              className="min-h-24 resize-y"
              {...register("evidenceCollectedDescription")}
            />
          </div>

          {/* Final Recommendation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Final Recommendation *
            </label>
            <Select
              onValueChange={(val) =>
                setValue("finalRecommendation", val as any)
              }
              defaultValue="RESOLVED"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed (No Further Action)</SelectItem>
                <SelectItem value="ESCALATED">Escalate to Higher Authority</SelectItem>
                <SelectItem value="FURTHER_INVESTIGATION">
                  Requires Further Investigation
                </SelectItem>
                <SelectItem value="CHARGED">Charged/Prosecuted</SelectItem>
              </SelectContent>
            </Select>
            {errors.finalRecommendation && (
              <p className="text-xs text-red-600">
                {errors.finalRecommendation.message}
              </p>
            )}
          </div>

          {/* Evidence File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Upload Additional Evidence
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploadingEvidence}
                className="cursor-pointer"
              />
              {uploadingEvidence && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload images, videos, or documents related to this case
            </p>

            {/* Uploaded Files List */}
            {evidenceFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {evidenceFiles.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded border"
                  >
                    <span className="text-sm truncate flex-1">
                      Evidence file {index + 1}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeEvidenceFile(url)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Final Report"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

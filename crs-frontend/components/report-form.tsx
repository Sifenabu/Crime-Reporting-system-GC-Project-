"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";

const reportSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  crimeTypeId: z.string().min(1, "Crime type is required"),
  status: z.enum(["NEW", "PENDING", "IN_PROGRESS", "ASSIGNED", "CLOSED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  isAnonymous: z.boolean(),
  reporterName: z.string().optional(),
  reporterEmail: z.string().email().optional().or(z.literal("")),
  reporterPhone: z.string().optional(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  location: z.string().min(3, "Location is required"),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportFormProps {
  report?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReportForm({ report, onSuccess, onCancel }: ReportFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: report
      ? {
          title: report.title,
          description: report.description,
          crimeTypeId: report.crimeType.id,
          status: report.status,
          priority: report.priority,
          isAnonymous: report.isAnonymous,
          reporterName: report.reporterName || "",
          reporterEmail: report.reporterEmail || "",
          reporterPhone: report.reporterPhone || "",
          lat: report.lat,
          lng: report.lng,
          location: report.location,
        }
      : {
          status: "NEW",
          priority: "MEDIUM",
          isAnonymous: false,
          lat: 8.54,
          lng: 39.27,
          location: "Adama, Ethiopia",
        },
  });

  const isAnonymous = watch("isAnonymous");

  // Fetch crime types
  const { data: crimeTypes } = useQuery({
    queryKey: ["crime-types"],
    queryFn: async () => {
      const token = localStorage.getItem("officerToken");
      const response = await fetch("http://localhost:4000/api/crime-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch crime types");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      const token = localStorage.getItem("officerToken");
      const url = report
        ? `http://localhost:4000/api/reports/${report.id}`
        : "http://localhost:4000/api/reports";
      const method = report ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save report");
      return response.json();
    },
    onSuccess: () => {
      toast.success(
        report ? "Report updated successfully" : "Report created successfully",
      );
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to save report");
    },
  });

  const onSubmit = (data: ReportFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* <div>
            <Label htmlFor="crimeTypeId">Crime Type</Label>
            <Select
              onValueChange={(value) => setValue("crimeTypeId", value)}
              defaultValue={report?.crimeType.id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent>
                {crimeTypes?.map((type: any) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.crimeTypeId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.crimeTypeId.message}
              </p>
            )}
          </div> */}
          <div className="space-y-4">
            <Label htmlFor="crimeTypeId" className="text-lg">
              Crime Type *
            </Label>
            <select
              id="crimeTypeId"
              className="w-full h-12 px-4 py-3 border rounded-lg text-base bg-white focus:ring-2 focus:ring-blue-900"
              {...register("crimeTypeId", { valueAsNumber: true })}
              defaultValue=""
            >
              <option value="" disabled>
                Select crime type
              </option>
              <option>Theft</option>
              <option>Assault</option>
              <option>Burglary</option>
              <option>Fraud</option>
              <option>Vandalism</option>
              <option>Drug-related</option>
              <option>Other</option>
            </select>
            {errors.crimeTypeId && (
              <p className="text-sm text-red-600">
                {errors.crimeTypeId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-sm text-red-600 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              {...register("lat", { valueAsNumber: true })}
            />
            {errors.lat && (
              <p className="text-sm text-red-600 mt-1">{errors.lat.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lng">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              {...register("lng", { valueAsNumber: true })}
            />
            {errors.lng && (
              <p className="text-sm text-red-600 mt-1">{errors.lng.message}</p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value as any)}
              defaultValue={report?.status || "NEW"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", value as any)}
              defaultValue={report?.priority || "MEDIUM"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isAnonymous"
            onCheckedChange={(checked) => setValue("isAnonymous", checked)}
            defaultChecked={report?.isAnonymous}
          />
          <Label htmlFor="isAnonymous">Anonymous Report</Label>
        </div>

        {!isAnonymous && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reporterName">Reporter Name</Label>
              <Input id="reporterName" {...register("reporterName")} />
            </div>

            <div>
              <Label htmlFor="reporterEmail">Reporter Email</Label>
              <Input
                id="reporterEmail"
                type="email"
                {...register("reporterEmail")}
              />
              {errors.reporterEmail && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.reporterEmail.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="reporterPhone">Reporter Phone</Label>
              <Input id="reporterPhone" {...register("reporterPhone")} />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-[#003366] hover:bg-[#002244]"
        >
          {mutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {report ? "Update Report" : "Create Report"}
        </Button>
      </div>
    </form>
  );
}

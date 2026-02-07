"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getToken } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

// Schema matching all 16 inputs
const officerSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().optional().or(z.literal("")),
  badgeNumber: z.string().min(3, "Badge number is required"),
  rank: z.string().min(2, "Rank is required"),
  availability: z.string(),
  displayName: z.string().optional(),
  tagline: z.string().optional(),
  publicBio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  education: z.string().optional(),
  emergencyPhone: z.string().optional(),
  role: z.string().default("OFFICER"),
});

type OfficerForm = z.infer<typeof officerSchema>;

export default function EditOfficerPage() {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OfficerForm>({
    resolver: zodResolver(officerSchema),
  });

  const availability = watch("availability");
  const gender = watch("gender");
  const maritalStatus = watch("maritalStatus");

  // 1. Fetch Existing Data
  const { data: officer, isLoading: isFetching } = useQuery({
    queryKey: ["officer", id],
    queryFn: async () => {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/officers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Officer data not found");
      const res = await response.json();
      return res.data || res.officer; // Adjust based on your API response structure
    },
  });

  // 2. Load data into form
  useEffect(() => {
    if (officer) {
      reset({
        fullName: officer.user?.fullName || "",
        email: officer.user?.email || "",
        phone: officer.user?.phone || "",
        badgeNumber: officer.badgeNumber || "",
        rank: officer.rank || "",
        availability: officer.availability || "OFF_DUTY",
        displayName: officer.brand?.displayName || "",
        tagline: officer.brand?.tagline || "",
        publicBio: officer.brand?.publicBio || "",
        dateOfBirth: officer.dateOfBirth
          ? officer.dateOfBirth.split("T")[0]
          : "",
        gender: officer.gender || "",
        maritalStatus: officer.maritalStatus || "",
        education: officer.education || "",
        emergencyPhone: officer.emergencyPhone || "",
        role: officer.user?.role?.name || "OFFICER", // Note: Backend returns role as object { name: 'OFFICER' } or just string dependign on query
      });
      if (officer.brand?.profileImage) {
        setPreviewUrl(officer.brand.profileImage);
      }
    }
  }, [officer, reset]);

  // 3. Update Logic (Using PATCH)
  const updateMutation = useMutation({
    mutationFn: async (data: OfficerForm) => {
      const formData = new FormData();
      const token = getToken();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value as string);
        }
      });

      if (profileImage) formData.append("profileImage", profileImage);

      const response = await fetch(`http://localhost:4000/api/officers/${id}`, {
        method: "PATCH", // FIXED: Matches your backend router.patch
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update officer");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Officer details updated!");
      queryClient.invalidateQueries({ queryKey: ["officers"] });
      router.push("/officer/officers");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (isFetching)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Officer Profile</h1>
      </div>

      <form
        onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
        className="space-y-8"
      >
        {/* SECTION 1: Account Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Core authentication and identification
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input {...register("fullName")} />
              {errors.fullName && (
                <p className="text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Badge Number *</Label>
              <Input {...register("badgeNumber")} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label>Rank *</Label>
              <Input {...register("rank")} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) => setValue("role", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OFFICER">Officer</SelectItem>
                  <SelectItem value="OPERATOR">Operator</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Password (Leave blank to keep current)</Label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Personal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={gender}
                onValueChange={(v) => setValue("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select
                value={maritalStatus}
                onValueChange={(v) => setValue("maritalStatus", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single</SelectItem>
                  <SelectItem value="MARRIED">Married</SelectItem>
                  <SelectItem value="DIVORCED">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Availability Status</Label>
              <Select
                value={availability}
                onValueChange={(v) => setValue("availability", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ON_DUTY">On Duty</SelectItem>
                  <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                  <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Education</Label>
              <Input {...register("education")} />
            </div>
            <div className="space-y-2">
              <Label>Emergency Contact Phone</Label>
              <Input {...register("emergencyPhone")} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 3: Public Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Public Branding & Bio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  className="h-24 w-24 rounded-full object-cover border-4 border-muted"
                />
                <Label
                  htmlFor="img-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                >
                  <Upload className="text-white h-6 w-6" />
                </Label>
                <input
                  id="img-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="flex-1 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input {...register("displayName")} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input {...register("tagline")} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Public Bio</Label>
              <Textarea {...register("publicBio")} className="min-h-[120px]" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 sticky bottom-4 bg-background/80 backdrop-blur p-4 border rounded-lg shadow-lg">
          <Button
            type="submit"
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save All Changes
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

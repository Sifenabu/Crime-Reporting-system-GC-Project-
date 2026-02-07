"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const officerSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
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

export default function NewOfficerPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OfficerForm>({
    resolver: zodResolver(officerSchema),
    defaultValues: {
      availability: "OFF_DUTY",
      role: "OFFICER",
    },
  });

  const availability = watch("availability");
  const gender = watch("gender");
  const maritalStatus = watch("maritalStatus");
  const role = watch("role");

  // --- Logic Fix: Authentication and FormData Posting ---
  const createOfficerMutation = useMutation({
    mutationFn: async (data: OfficerForm) => {
      const formData = new FormData();

      // 1. Properly append data (avoiding 'undefined' strings)
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // 2. Append file if exists
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // 3. Get Auth Token
      const token = getToken();
      const authHeader = token?.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      const response = await fetch("http://localhost:4000/api/officers", {
        method: "POST",
        headers: {
          // Note: Content-Type is NOT set manually for FormData
          Authorization: authHeader,
        },
        body: formData,
      });

      if (response.status === 401) {
        throw new Error(
          "Unauthorized: Your session expired. Please log in again."
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create officer");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Officer created successfully!");
      router.push("/officer/officers");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: OfficerForm) => {
    createOfficerMutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Officers
      </Button>

      <h1 className="text-3xl font-bold mb-8">Add New Officer</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential officer details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="badgeNumber">Badge Number *</Label>
                <Input
                  id="badgeNumber"
                  {...register("badgeNumber")}
                  placeholder="OFF-001"
                />
                {errors.badgeNumber && (
                  <p className="text-sm text-destructive">
                    {errors.badgeNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="officer@adama.police.et"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+251911223344"
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Min. 8 characters"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Rank *</Label>
                <Input
                  id="rank"
                  {...register("rank")}
                  placeholder="Officer, Sergeant, etc."
                />
                {errors.rank && (
                  <p className="text-sm text-destructive">
                    {errors.rank.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={availability}
                  onValueChange={(value) => setValue("availability", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_DUTY">On Duty</SelectItem>
                    <SelectItem value="OFF_DUTY">Off Duty</SelectItem>
                    <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                    <SelectItem value="BUSY">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={(value) => setValue("role", value)}
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
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={gender}
                  onValueChange={(value) => setValue("gender", value)}
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
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select
                  value={maritalStatus}
                  onValueChange={(value) => setValue("maritalStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Single</SelectItem>
                    <SelectItem value="MARRIED">Married</SelectItem>
                    <SelectItem value="DIVORCED">Divorced</SelectItem>
                    <SelectItem value="WIDOWED">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  {...register("education")}
                  placeholder="Bachelor's in Criminology"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact</Label>
                <Input
                  id="emergencyPhone"
                  {...register("emergencyPhone")}
                  placeholder="+251977889234"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Information */}
        <Card>
          <CardHeader>
            <CardTitle>Brand & Public Info</CardTitle>
            <CardDescription>Public-facing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full border bg-muted flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground text-center px-1">
                      No Image
                    </span>
                  )}
                </div>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-[300px]"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  {...register("displayName")}
                  placeholder="Insp. J. Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  {...register("tagline")}
                  placeholder="Protecting Adama with Honor"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicBio">Public Bio</Label>
              <Textarea
                id="publicBio"
                {...register("publicBio")}
                placeholder="Brief public biography..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="submit"
            className="flex-1 bg-cyan-500 hover:bg-cyan-600"
            disabled={createOfficerMutation.isPending}
          >
            {createOfficerMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Officer...
              </>
            ) : (
              "Create Officer"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

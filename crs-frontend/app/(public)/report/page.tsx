"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Upload,
  Check,
  Loader2,
  LocateFixed,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

// Schema
const reportSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    crimeTypeId: z.number().min(1, "Please select a crime type"),
    locationString: z
      .string()
      .min(3, "Place description is required (min 3 chars)"),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    reporterName: z.string().optional(),
    reporterPhone: z.string().optional(),
    reporterEmail: z
      .string()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    isAnonymous: z.boolean(),

    acknowledgeLegalNotice: z.literal(true, {
      errorMap: () => ({
        message:
          "You must acknowledge that submitting false reports has legal consequences.",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.isAnonymous) {
      if (!data.reporterName || data.reporterName.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name is required when not anonymous",
          path: ["reporterName"],
        });
      }
      if (!data.reporterPhone || data.reporterPhone.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number is required when not anonymous",
          path: ["reporterPhone"],
        });
      }
      if (!data.reporterEmail || data.reporterEmail.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required when not anonymous",
          path: ["reporterEmail"],
        });
      }
    }
  });

type ReportFormData = z.infer<typeof reportSchema>;

interface ApiResponse {
  success: boolean;
  report: { caseNumber: string; id: string; status: string };
}

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      isAnonymous: false,
      lat: 8.5413,
      lng: 39.2711,
      locationString: "",
    },
  });

  const isAnonymous = watch("isAnonymous");

  const mutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      // Prepend the plain-text location to the description
      const fullDescription = `Location: ${data.locationString}\n\n${data.description}`;
      formData.append("description", fullDescription);
      formData.append("crimeTypeId", data.crimeTypeId.toString());
      formData.append("lat", data.lat.toString());
      formData.append("lng", data.lng.toString());
      formData.append("isAnonymous", data.isAnonymous.toString());
      formData.append("channel", "WEB");

      if (!data.isAnonymous) {
        if (data.reporterName)
          formData.append("reporterName", data.reporterName);
        if (data.reporterPhone)
          formData.append("reporterPhone", data.reporterPhone);
        if (data.reporterEmail)
          formData.append("reporterEmail", data.reporterEmail);
      }

      files.forEach((file) => formData.append("evidence", file));

      const res = await fetch("http://localhost:4000/api/reports", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Submission failed");
      return result as ApiResponse;
    },
    onSuccess: (data) => {
      setCaseNumber(data.report.caseNumber);
      setSubmitted(true);
      toast.success("Report submitted successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const detectLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setValue("lat", pos.coords.latitude);
        setValue("lng", pos.coords.longitude);
        toast.success("Location detected!");
        setDetectingLocation(false);
      },
      () => {
        toast.error("Location access denied");
        setDetectingLocation(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} too large (max 10MB)`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const nextStep = async () => {
    const fields =
      step === 1
        ? (["title", "description", "crimeTypeId"] as const)
        : (["locationString", "lat", "lng"] as const);
    const valid = await trigger(fields);
    if (valid) setStep(step + 1);
    else toast.error("Please complete all required fields");
  };

  const onSubmit = (data: ReportFormData) => {
    if (step !== 3) return; // Extra safety
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold">
                Report Submitted Successfully
              </CardTitle>
              <CardDescription className="text-lg mt-4">
                Thank you for helping make Adama safer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-8 bg-blue-50 rounded-xl text-center border border-blue-200">
                <p className="text-sm text-blue-700 mb-3">Your Case Number</p>
                <p className="text-4xl font-bold text-blue-900">{caseNumber}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setFiles([]);
                  }}
                >
                  Submit Another Report
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600"
                  onClick={() =>
                    (window.location.href = `/track/${caseNumber}`)
                  }
                >
                  Track This Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex p-5 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="h-14 w-14 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Report a Crime
          </h1>
          <p className="text-xl text-gray-600">
            Submit anonymously or provide contact details. All reports are
            confidential.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                    step >= s
                      ? "bg-blue-900 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-32 h-1 ${
                      step > s ? "bg-blue-900" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Steps 1 & 2: No form wrapper */}
        {step < 3 && (
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-blue-900 text-white rounded-t-lg">
              <CardTitle className="text-2xl">
                {step === 1 ? "What Happened?" : "Where Did It Happen?"}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {step === 1
                  ? "Describe the incident in detail"
                  : "Provide precise location coordinates"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              {/* Step 1 */}
              {step === 1 && (
                <>
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-lg">
                      Brief Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Phone stolen at night market"
                      className="text-lg"
                      {...register("title")}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

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
                      <option value={1}>Theft</option>
                      <option value={2}>Assault</option>
                      <option value={3}>Burglary</option>
                      <option value={4}>Fraud</option>
                      <option value={5}>Vandalism</option>
                      <option value={6}>Drug-related</option>
                      <option value={7}>Other</option>
                    </select>
                    {errors.crimeTypeId && (
                      <p className="text-sm text-red-600">
                        {errors.crimeTypeId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-lg">
                      Full Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide as much detail as possible..."
                      className="min-h-48 text-base"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Plain-text Location Input */}
                  <div className="space-y-4">
                    <Label
                      htmlFor="locationString"
                      className="text-xl font-semibold"
                    >
                      Place where the crime happened *
                    </Label>
                    <Input
                      id="locationString"
                      placeholder="e.g., Posta Bet, Adama Boku, Near Bole Michael"
                      className="text-lg"
                      {...register("locationString")}
                    />
                    {errors.locationString && (
                      <p className="text-sm text-red-600">
                        {errors.locationString.message}
                      </p>
                    )}
                  </div>

                  <Label className="text-xl font-semibold">
                    Location Coordinates *
                  </Label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        className="text-lg"
                        {...register("lat", { valueAsNumber: true })}
                      />
                      {errors.lat && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.lat.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        className="text-lg"
                        {...register("lng", { valueAsNumber: true })}
                      />
                      {errors.lng && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.lng.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={detectLocation}
                    disabled={detectingLocation}
                    className="w-full h-14 text-lg"
                  >
                    {detectingLocation ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <LocateFixed className="mr-3 h-6 w-6" />
                        Auto-Detect Location
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="flex gap-6 pt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 text-lg"
                  >
                    Previous
                  </Button>
                )}
                <Button
                  type="button"
                  size="lg"
                  onClick={nextStep}
                  className="flex-1 text-lg bg-blue-900 hover:bg-blue-800"
                >
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Only this is wrapped in <form> */}
        {step === 3 && (
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-blue-900 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Evidence & Contact</CardTitle>
                <CardDescription className="text-blue-100">
                  Upload supporting evidence and choose anonymity
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {/* Evidence Upload */}
                <div className="space-y-6">
                  <Label className="text-xl font-semibold">
                    Supporting Evidence (Optional)
                  </Label>
                  <div className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-cyan-500 transition cursor-pointer">
                    <Upload className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                    <Input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      onClick={(e) => e.stopPropagation()} // Prevent submit
                      className="hidden"
                      id="evidence"
                    />
                    <Label htmlFor="evidence" className="cursor-pointer block">
                      <span className="text-xl font-medium text-gray-700">
                        Click to upload photos or videos
                      </span>
                      <p className="text-gray-500 mt-3">Max 10MB per file</p>
                    </Label>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-3">
                      <p className="font-medium">
                        {files.length} file(s) selected:
                      </p>
                      {files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                        >
                          <span className="text-sm truncate max-w-xs">
                            {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                            MB)
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(i)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anonymity & Contact */}
                <div className="space-y-6 pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <Switch
                      id="isAnonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) =>
                        setValue("isAnonymous", checked)
                      }
                    />
                    <Label
                      htmlFor="isAnonymous"
                      className="text-lg font-medium cursor-pointer"
                    >
                      Submit this report anonymously
                    </Label>
                  </div>

                  {!isAnonymous && (
                    <div className="space-y-5 p-6 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                      <div>
                        <Label htmlFor="reporterName">Full Name *</Label>
                        <Input
                          id="reporterName"
                          placeholder="Your Full Name"
                          {...register("reporterName")}
                          className={
                             errors.reporterName ? "border-red-500" : ""
                          }
                        />
                        {errors.reporterName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.reporterName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="reporterPhone">Phone Number *</Label>
                        <Input
                          id="reporterPhone"
                          placeholder="Phone Number"
                          {...register("reporterPhone")}
                          className={
                             errors.reporterPhone ? "border-red-500" : ""
                          }
                        />
                        {errors.reporterPhone && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.reporterPhone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="reporterEmail">Email Address *</Label>
                        <Input
                          id="reporterEmail"
                          placeholder="Email Address"
                          {...register("reporterEmail")}
                          className={
                             errors.reporterEmail ? "border-red-500" : ""
                          }
                        />
                        {errors.reporterEmail && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.reporterEmail.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-900">
                      <strong>Privacy Notice:</strong> Contact info is optional
                      and only used for follow-up.
                    </p>
                  </div>
                </div>
                {/* Legal Notice */}
                <div className="p-6 bg-red-50 border border-red-300 rounded-xl">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                    <div className="space-y-2">
                      <p className="font-semibold text-red-800">
                        Legal Notice – False Reporting
                      </p>
                      <p className="text-sm text-red-700 leading-relaxed">
                        Submitting a false or misleading crime report is a
                        serious offense and may result in legal consequences
                        under applicable law. Please ensure that all information
                        provided is truthful and accurate to the best of your
                        knowledge.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Legal Acknowledgement */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acknowledgeLegalNotice"
                    className="mt-1 h-5 w-5"
                    {...register("acknowledgeLegalNotice")}
                  />
                  <Label
                    htmlFor="acknowledgeLegalNotice"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I confirm that the information provided is truthful and I
                    understand that submitting a false report may result in
                    legal consequences.
                  </Label>
                </div>

                {errors.acknowledgeLegalNotice && (
                  <p className="text-sm text-red-600">
                    {errors.acknowledgeLegalNotice.message}
                  </p>
                )}

                {/* Final Buttons */}
                <div className="flex gap-6 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setStep(2)}
                    className="flex-1 text-lg"
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={mutation.isPending}
                    className="flex-1 text-lg bg-cyan-500 hover:bg-cyan-600 font-semibold"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Crime Report"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </div>
    </div>
  );
}

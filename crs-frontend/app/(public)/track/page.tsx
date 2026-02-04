"use client";

import type React from "react";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Report {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  crimeType: { name: string };
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
  reporterName: string | null;
  isAnonymous: boolean;
}

export default function TrackPage() {
  const searchParams = useSearchParams();
  const initialCaseNumber = searchParams?.get("id") || "";

  const [caseNumber, setCaseNumber] = useState(initialCaseNumber);
  const [searchedCaseNumber, setSearchedCaseNumber] =
    useState(initialCaseNumber);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["report", searchedCaseNumber],
    queryFn: async () => {
      if (!searchedCaseNumber) return null;

      const response = await fetch(
        `http://localhost:4000/api/reports?caseNumber=${searchedCaseNumber}`
      );

      if (!response.ok) {
        throw new Error("Report not found");
      }

      const result = await response.json();
      // Backend returns array of reports, filter by case number
      const report = result.reports?.find(
        (r: Report) => r.caseNumber === searchedCaseNumber
      );

      if (!report) {
        throw new Error("Report not found");
      }

      return report as Report;
    },
    enabled: searchedCaseNumber.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseNumber.trim()) {
      toast.error("Please enter a case number");
      return;
    }
    setSearchedCaseNumber(caseNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "NEW":
        return "bg-blue-500";
      case "ASSIGNED":
        return "bg-purple-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "CLOSED":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CLOSED":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-[#00B5E2]/10 rounded-full mb-4">
            <Search className="h-10 w-10 text-[#00B5E2]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#1F2937]">
            Track Your Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your Case Number to check the status of your submission
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Enter Case Number</CardTitle>
            <CardDescription>
              You received this when you submitted your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="caseNumber" className="sr-only">
                  Case Number
                </Label>
                <Input
                  id="caseNumber"
                  placeholder="CASE-1234567890123-XXXXX"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#00B5E2] hover:bg-[#00B5E2]/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Report Details */}
        {isError && searchedCaseNumber && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Report Not Found</h3>
              <p className="text-muted-foreground">
                No report found with Case Number:{" "}
                <strong>{searchedCaseNumber}</strong>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check your Case Number and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Case {data.caseNumber}
                    </CardTitle>
                    <CardDescription>
                      Submitted on{" "}
                      {new Date(data.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadge(data.status)}>
                    {data.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Crime Type</p>
                    <p className="font-semibold">{data.crimeType.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <p className="font-semibold">{data.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">
                      {data.lat.toFixed(4)}, {data.lng.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reporter</p>
                    <p className="font-semibold">
                      {data.isAnonymous
                        ? "Anonymous"
                        : data.reporterName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#F7F7F7] rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Description
                  </p>
                  <p className="text-sm">{data.description}</p>
                </div>

                {data.status === "CLOSED" && (
                  <div className="mt-4 p-4 bg-[#34A853]/10 rounded-lg border border-[#34A853]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#34A853] mt-0.5" />
                      <div>
                        <p className="font-semibold text-[#34A853]">
                          Case Closed
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          This case has been resolved and closed by our
                          officers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Case Timeline</CardTitle>
                <CardDescription>
                  Track the progress of your case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          data.status
                        )}`}
                      />
                      <div className="w-0.5 h-full bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">Report Submitted</p>
                        <Badge variant="outline" className="text-xs">
                          {new Date(data.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your crime report has been received.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(data.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColor(
                          data.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">
                          Current Status: {data.status}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {new Date(data.updatedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last updated on{" "}
                        {new Date(data.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Eye className="mr-2 h-4 w-4" />
                    View Evidence
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Need help? Contact us at{" "}
                  <strong>support@adamapolice.gov</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

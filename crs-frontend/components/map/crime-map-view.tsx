"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { MapPin, AlertCircle, ChevronRight, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const useMap = dynamic(
  () =>
    import("react-leaflet")
      .then((m) => m.useMap)
      .then((hook) => ({ useMap: hook })),
  {
    ssr: false,
  }
);

import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Report {
  id: string;
  title: string;
  description: string;
  caseNumber: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  lat: number;
  lng: number;
  createdAt: string;
  assignedOfficer?: {
    user: {
      fullName: string;
    };
  };
  crimeType?: {
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  reports: Report[];
  total: number;
  page: number;
  pages: number;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "#dc2626";
    case "MEDIUM":
      return "#f59e0b";
    case "LOW":
      return "#2563eb";
    default:
      return "#6b7280";
  }
};

const getPriorityBgColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100";
    case "MEDIUM":
      return "bg-amber-100";
    case "LOW":
      return "bg-blue-100";
    default:
      return "bg-gray-100";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "destructive";
    case "IN_PROGRESS":
      return "default";
    case "RESOLVED":
      return "secondary";
    case "CLOSED":
      return "outline";
    default:
      return "secondary";
  }
};

const createCustomIcon = (priority: string) => {
  const color = getPriorityColor(priority);
  const html = `
    <div style="
      background-color: ${color};
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid white;
    ">
      <svg style="transform: rotate(45deg); width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
        <path d="M12 21.9v-.5M4.22 4.22l.35.35M3 12h.5m17.5 0h.5m-3.57-8.57l.35-.35M20.78 19.78l-.35-.35M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"></path>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "custom-marker",
  });
};

export function CrimeMapView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const mapRef = useRef<any>(null);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("officerToken");
        const response = await fetch("http://localhost:4000/api/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success && Array.isArray(data.reports)) {
          // Filter reports with valid coordinates
          const validReports = data.reports.filter(
            (r) => r && r.lat && r.lng && r.lat !== null && r.lng !== null
          );
          setReports(validReports);
        } else {
          setReports([]); // Fallback to empty array
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err instanceof Error ? err.message : "Failed to load reports");
        setReports([]); // Defensive fallback
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Effect: Handle URL params for initial selection
  useEffect(() => {
    if (!loading && reports.length > 0) {
      const paramLat = searchParams.get("lat");
      const paramLng = searchParams.get("lng");
      // const paramId = searchParams.get("reportId"); // optional if we pass ID

      if (paramLat && paramLng && mapRef.current) {
        const lat = parseFloat(paramLat);
        const lng = parseFloat(paramLng);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          // Find closest report or exact match
          const targetReport = reports.find(
            (r) => Math.abs(r.lat - lat) < 0.0001 && Math.abs(r.lng - lng) < 0.0001
          );

          mapRef.current.flyTo([lat, lng], 18, { duration: 1.5 });
          
          if (targetReport) {
            setSelectedReport(targetReport);
          }
        }
      }
    }
  }, [loading, reports, searchParams]);

  const handleReportClick = useCallback(
    (report: Report) => {
      setSelectedReport(report);
      router.push(`/officer/reports/${report.id}`);
    },
    [router]
  );

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
  };

  const handleSidebarItemClick = (report: Report) => {
    setSelectedReport(report);
    if (mapRef.current) {
      mapRef.current.flyTo([report.lat, report.lng], 16, { duration: 1 });
    }
  };

  // Skeleton loading component
  if (loading) {
    return (
      <div className="flex h-screen gap-4 bg-background">
        <div className="flex-1 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse rounded-lg" />
        <div className="w-96 bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <h3 className="font-semibold">Failed to Load Reports</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen gap-4 bg-background p-4">
      {/* Map Container */}
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-border">
        <div className="h-full w-full">
          <MapContainer
            center={[8.54, 39.27]}
            zoom={13}
            className="h-full w-full"
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.lat, report.lng]}
                icon={createCustomIcon(report.priority)}
                eventHandlers={{
                  click: () => handleMarkerClick(report),
                }}
              >
                <Popup maxWidth={300} closeButton>
                  <div className="space-y-3 p-2">
                    <div>
                      <p className="font-bold text-sm">{report.caseNumber}</p>
                      <p className="font-semibold text-base">{report.title}</p>
                    </div>

                    {report.crimeType && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Crime Type
                        </p>
                        <p className="text-sm font-medium">
                          {report.crimeType.name}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge
                        className={cn(
                          getPriorityBgColor(report.priority),
                          report.priority === "HIGH"
                            ? "text-red-800"
                            : report.priority === "MEDIUM"
                            ? "text-amber-800"
                            : "text-blue-800"
                        )}
                      >
                        {report.priority}
                      </Badge>
                    </div>

                    {report.assignedOfficer && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Assigned Officer
                        </p>
                        <p className="text-sm">
                          {report.assignedOfficer.user.fullName}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleReportClick(report)}
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col gap-4 transition-all duration-300",
          sidebarOpen ? "w-96" : "w-0"
        )}
      >
        {/* Header */}
        <Card className="flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Map View</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time incident locations and patrol zones
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <ChevronDown className="w-4 h-4 transition-transform" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Reports List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No reports with location data</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card
                key={report.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedReport?.id === report.id &&
                    "ring-2 ring-primary bg-primary/5"
                )}
                onClick={() => handleSidebarItemClick(report)}
              >
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{
                          backgroundColor: getPriorityColor(report.priority),
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {report.caseNumber}
                        </p>
                        <p className="font-semibold truncate text-sm">
                          {report.title}
                        </p>
                      </div>
                    </div>

                    {report.crimeType && (
                      <p className="text-xs text-muted-foreground ml-6">
                        {report.crimeType.name}
                      </p>
                    )}

                    <div className="ml-6">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportClick(report);
                      }}
                    >
                      View Details
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, AlertTriangle, Maximize2, Filter, Eye } from "lucide-react"

export default function OfficerMapPage() {
  const router = useRouter()
  const [selectedCase, setSelectedCase] = useState<string | null>(null)

  useEffect(() => {
    const auth = localStorage.getItem("officerAuth")
    if (!auth) {
      router.push("/officer/login")
    }
  }, [router])

  const incidents = [
    {
      id: "RPT-12345678",
      type: "Theft",
      location: "Main Street Market",
      coordinates: { lat: 8.54, lng: 39.27 },
      priority: "high",
      status: "investigating",
      time: "2 hours ago",
      distance: "1.2 km",
    },
    {
      id: "RPT-87654321",
      type: "Vandalism",
      location: "Central Park",
      coordinates: { lat: 8.52, lng: 39.28 },
      priority: "medium",
      status: "assigned",
      time: "5 hours ago",
      distance: "3.4 km",
    },
    {
      id: "RPT-11223344",
      type: "Assault",
      location: "5th Avenue",
      coordinates: { lat: 8.55, lng: 39.26 },
      priority: "high",
      status: "investigating",
      time: "1 hour ago",
      distance: "0.8 km",
    },
    {
      id: "RPT-55667788",
      type: "Fraud",
      location: "Downtown District",
      coordinates: { lat: 8.53, lng: 39.29 },
      priority: "low",
      status: "pending",
      time: "8 hours ago",
      distance: "5.1 km",
    },
    {
      id: "RPT-99887766",
      type: "Burglary",
      location: "Residential Area",
      coordinates: { lat: 8.51, lng: 39.25 },
      priority: "high",
      status: "investigating",
      time: "30 minutes ago",
      distance: "2.3 km",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="default">Medium Priority</Badge>
      case "low":
        return <Badge variant="secondary">Low Priority</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Map View</h1>
        <p className="text-muted-foreground">Real-time incident locations and patrol zones</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Incident Map</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                {/* Mock Map Interface */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Interactive Map View</p>
                    <p className="text-sm text-muted-foreground">
                      Showing {incidents.length} active incidents in Adama City
                    </p>
                  </div>
                </div>

                {/* Mock Map Markers */}
                <div
                  className="absolute top-1/4 left-1/3 cursor-pointer"
                  onClick={() => setSelectedCase("RPT-12345678")}
                >
                  <div className="relative animate-pulse">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
                <div
                  className="absolute top-1/2 left-1/2 cursor-pointer"
                  onClick={() => setSelectedCase("RPT-87654321")}
                >
                  <div className="relative animate-pulse">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                    <div className="absolute inset-0 w-4 h-4 bg-yellow-500 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
                <div
                  className="absolute top-1/3 right-1/3 cursor-pointer"
                  onClick={() => setSelectedCase("RPT-11223344")}
                >
                  <div className="relative animate-pulse">
                    <div className="w-4 h-4 bg-red-500 rounded-full" />
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
                  </div>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-card p-3 rounded-lg shadow-lg border">
                  <p className="text-xs font-semibold mb-2">Priority Levels</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span>High Priority</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <span>Medium Priority</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span>Low Priority</span>
                    </div>
                  </div>
                </div>

                {/* Current Location Button */}
                <Button
                  size="icon"
                  className="absolute bottom-4 right-4 rounded-full shadow-lg"
                  onClick={() => alert("Centering on your location...")}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
              </div>

              {/* Map Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs text-muted-foreground">High Priority</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">1</div>
                  <div className="text-xs text-muted-foreground">Medium Priority</div>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-xs text-muted-foreground">Low Priority</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Incident List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Active Incidents</CardTitle>
              <CardDescription>Nearby cases requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCase === incident.id ? "bg-accent border-primary" : "hover:bg-accent"
                    }`}
                    onClick={() => setSelectedCase(incident.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(incident.priority)}`} />
                        <h3 className="font-semibold text-sm">{incident.type}</h3>
                      </div>
                      {getPriorityBadge(incident.priority)}
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </div>
                      <p className="text-xs text-muted-foreground">{incident.id}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{incident.time}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Navigation className="h-3 w-3" />
                        {incident.distance}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <Button size="sm" className="w-full" onClick={() => router.push(`/officer/cases/${incident.id}`)}>
                        <Eye className="mr-2 h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Heatmap Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Crime Heatmap Analysis</CardTitle>
          <CardDescription>High-activity zones requiring increased patrol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-sm">Market District</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">12 incidents this week</p>
              <Badge variant="destructive" className="text-xs">
                High Activity
              </Badge>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold text-sm">Downtown</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">7 incidents this week</p>
              <Badge className="text-xs bg-yellow-500">Medium Activity</Badge>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-sm">Residential</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">3 incidents this week</p>
              <Badge variant="secondary" className="text-xs">
                Low Activity
              </Badge>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-sm">Industrial</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-2">1 incident this week</p>
              <Badge variant="outline" className="text-xs">
                Minimal Activity
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  FileText,
  Mail,
  Bell,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon
} from "lucide-react";
import { getUser, type OfficerUser } from "@/lib/auth";

export default function OperatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<OfficerUser | null>(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/officer/login");
      return;
    }
    // Strict redirect if not operator (though middleware handles this too)
    if (currentUser.role !== "OPERATOR" && currentUser.role !== "SUPER_ADMIN" && currentUser.role !== "ADMIN") {
         router.push("/officer/unauthorized");
    }
    setUser(currentUser);
  }, [router]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Operator Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user.fullName}. Here is today's overview.
          </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => router.push('/officer/reports/new')}>
                New Report Entry
            </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Reports
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 since last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verification
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Messages
            </CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 unread messages
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Officers
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Currently on duty
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Verification Queue */}
        <Card className="col-span-4 border-t-4 border-t-yellow-500 shadow-sm">
          <CardHeader>
            <CardTitle>Verification Queue</CardTitle>
            <CardDescription>
              Recent reports requiring operator verification before assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending</Badge>
                                <span className="font-semibold">Suspicious Activity at Bole</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Reported 15 mins ago • Anonymous</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/officer/cases/case-${i}`)}>
                            Review <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Activity */}
        <div className="col-span-3 space-y-4">
             {/* Quick Actions */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-2">
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/officer/reports')}>
                        <FileText className="mr-2 h-4 w-4" />
                        View All Reports
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/officer/contact')}>
                        <Mail className="mr-2 h-4 w-4" />
                        Manage Contact Messages
                    </Button>
                    <Button variant="outline" className="justify-start" onClick={() => router.push('/officer/notices/new')}>
                        <Bell className="mr-2 h-4 w-4" />
                        Publish Safety Notice
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Live Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 bg-blue-100 p-1.5 rounded-full">
                                <Clock className="h-3 w-3 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">New report submitted</p>
                                <p className="text-xs text-muted-foreground">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                             <div className="mt-1 bg-green-100 p-1.5 rounded-full">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Case #4928 resolved</p>
                                <p className="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

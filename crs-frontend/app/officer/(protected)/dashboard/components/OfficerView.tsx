import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  User, 
  Calendar,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { OfficerUser } from "@/lib/auth";
import Link from "next/link";

interface OfficerViewProps {
  reports: any[];
  user: any; 
}

export default function OfficerView({ reports, user }: OfficerViewProps) {
  // Helpers
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Metrics
  const activeCases = reports.filter(r => r.status === "NEW" || r.status === "IN_PROGRESS");
  const urgentCases = activeCases.filter(r => r.priority === "HIGH");
  
  // Assignment Processing
  const recentAssignments = [...activeCases]
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Top Section - Welcoming & Mission Focused */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm">
        <div>
           <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wider mb-1">
             <Shield className="w-4 h-4 text-blue-600" />
             <span>Officer Dashboard • Badge #{user.badgeId || "---"}</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
             {getTimeGreeting()}, {user.fullName?.split(' ')[0] || "Officer"}.
           </h1>
           <p className="text-slate-500 mt-1">
             You have <span className="font-semibold text-blue-600">{activeCases.length} active cases</span> assigned to your shift today.
           </p>
        </div>
        <div className="flex gap-3">
           <Link href="/officer/cases">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" /> View All Cases
            </Button>
           </Link>
           <Button className="gap-2 bg-blue-700 hover:bg-blue-800 text-white">
             <CheckCircle className="w-4 h-4" /> Update Status
           </Button>
        </div>
      </div>

      {/* 2. Operational Overview - Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-medium text-muted-foreground">New Assignments</p>
                 <h2 className="text-3xl font-bold mt-2">{reports.filter(r => r.status === "NEW").length}</h2>
               </div>
               <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                 <Briefcase className="w-5 h-5 text-blue-600" />
               </div>
             </div>
             <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
               <Clock className="w-3 h-3" /> Updated just now
             </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-medium text-muted-foreground">Under Investigation</p>
                 <h2 className="text-3xl font-bold mt-2">{reports.filter(r => r.status === "IN_PROGRESS").length}</h2>
               </div>
               <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                 <TrendingUp className="w-5 h-5 text-amber-600" />
               </div>
             </div>
             <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
               <Badge variant="secondary" className="text-[10px] h-5">Top Priority</Badge>
             </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                 <h2 className="text-3xl font-bold mt-2">{reports.filter(r => r.status === "RESOLVED").length}</h2>
               </div>
               <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                 <CheckCircle className="w-5 h-5 text-green-600" />
               </div>
             </div>
             <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
               Awaiting approval
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. My Assignments Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
               <div>
                 <CardTitle className="text-lg font-bold flex items-center gap-2">
                   <Briefcase className="w-5 h-5 text-blue-600" /> My Active Assignments
                 </CardTitle>
                 <CardDescription>Recent cases requiring your attention</CardDescription>
               </div>
               <Button variant="ghost" size="sm" className="text-blue-600">View All</Button>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
               <div className="divide-y">
                 {recentAssignments.length > 0 ? recentAssignments.map(report => (
                   <div key={report.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-between group">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 h-2 w-2 rounded-full ${report.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{report.caseNumber}</span>
                             <Badge variant={report.priority === 'HIGH' ? 'destructive' : 'outline'} className="text-[10px] h-5">
                               {report.priority}
                             </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1">{report.title}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                             <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {report.lat && report.lng ? "Location Set" : "Location Pending"}</span>
                             <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/officer/reports/${report.id}`}>
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          View details
                        </Button>
                      </Link>
                   </div>
                 )) : (
                   <div className="p-8 text-center text-muted-foreground">
                     <p>No active assignments found.</p>
                   </div>
                 )}
               </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 p-3 border-t">
              <p className="text-xs text-center w-full text-muted-foreground">Showing {recentAssignments.length} of {activeCases.length} active cases</p>
            </CardFooter>
          </Card>

          {/* Productivity / Decision Support */}
           <Card className="border-l-4 border-l-purple-500 shadow-sm">
             <CardHeader className="pb-2">
               <CardTitle className="text-base font-semibold flex items-center gap-2">
                 <AlertTriangle className="w-4 h-4 text-purple-600" /> Action Required
               </CardTitle>
             </CardHeader>
             <CardContent>
                <div className="space-y-3">
                   {urgentCases.length > 0 ? (
                     urgentCases.slice(0, 2).map(c => (
                       <div key={c.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-100 dark:border-red-900/50">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="text-sm font-medium text-red-800 dark:text-red-200">Urgent: {c.caseNumber} needs update</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 text-red-700 hover:bg-red-100 hover:text-red-900">Review</Button>
                       </div>
                     ))
                   ) : (
                     <p className="text-sm text-muted-foreground">All urgent matters are cleared.</p>
                   )}
                   <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Daily Report pending submission</span>
                      </div>
                      <Button size="sm" variant="outline" className="h-7">Draft</Button>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* 4. Field Intelligence & Info */}
        <div className="space-y-6">
           <Card className="shadow-sm">
             <CardHeader className="bg-slate-900 text-white rounded-t-xl py-4">
               <CardTitle className="text-base flex items-center gap-2">
                 <Shield className="w-4 h-4 text-yellow-500" /> Field Intelligence
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-4">
               <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 rounded-md">
                 <h4 className="font-semibold text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                   <AlertTriangle className="w-3 h-3" /> Safety Notice
                 </h4>
                 <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 leading-relaxed">
                   High activity reported in Sector 4. Proceed with caution during night shifts.
                 </p>
               </div>
               
               <div>
                  <h4 className="text-sm font-medium mb-2">District Alerts</h4>
                  <ul className="space-y-2">
                    <li className="text-xs flex gap-2 items-start text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                      Road closure on 5th Ave due to maintenance.
                    </li>
                    <li className="text-xs flex gap-2 items-start text-muted-foreground">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                       Community event in Park District - expect crowds.
                    </li>
                  </ul>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">Shift Status</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-2xl font-bold">On Duty</span>
                 <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
               </div>
               <p className="text-xs text-muted-foreground">Shift ends in 4 hours 30 mins</p>
               <Separator className="my-4" />
               <div className="grid grid-cols-2 gap-2">
                 <Button variant="outline" size="sm" className="w-full text-xs">Request Backup</Button>
                 <Button variant="outline" size="sm" className="w-full text-xs">Contact Dispatch</Button>
               </div>
             </CardContent>
           </Card>
        </div>

      </div>
    </div>
  );
}

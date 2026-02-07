// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Bell,
//   AlertTriangle,
//   FileText,
//   CheckCircle2,
//   Clock,
//   MessageSquare,
//   Trash2,
//   Check,
// } from "lucide-react";

// export default function OfficerNotificationsPage() {
//   const router = useRouter();
//   const [filter, setFilter] = useState("all");

//   // useEffect(() => {
//   //   const auth = localStorage.getItem("officerAuth")
//   //   if (!auth) {
//   //     router.push("/officer/login")
//   //   }
//   // }, [router])

//   const notifications = [
//     {
//       id: 1,
//       type: "new_case",
//       title: "New Case Assigned",
//       message: "You have been assigned to case RPT-12345678 (Theft)",
//       time: "5 minutes ago",
//       read: false,
//       priority: "high",
//       icon: FileText,
//       link: "/officer/cases/RPT-12345678",
//     },
//     {
//       id: 2,
//       type: "urgent",
//       title: "High Priority Alert",
//       message: "Assault reported in your patrol area - 5th Avenue",
//       time: "15 minutes ago",
//       read: false,
//       priority: "urgent",
//       icon: AlertTriangle,
//       link: "/officer/map",
//     },
//     {
//       id: 3,
//       type: "update",
//       title: "Case Update",
//       message: "New evidence uploaded for case RPT-87654321",
//       time: "1 hour ago",
//       read: false,
//       priority: "medium",
//       icon: FileText,
//       link: "/officer/cases/RPT-87654321",
//     },
//     {
//       id: 4,
//       type: "message",
//       title: "Message from Sergeant Brown",
//       message: "Please submit your weekly report by end of day",
//       time: "2 hours ago",
//       read: true,
//       priority: "medium",
//       icon: MessageSquare,
//       link: "#",
//     },
//     {
//       id: 5,
//       type: "resolved",
//       title: "Case Resolved",
//       message: "Case RPT-44556677 has been marked as resolved",
//       time: "3 hours ago",
//       read: true,
//       priority: "low",
//       icon: CheckCircle2,
//       link: "/officer/cases/RPT-44556677",
//     },
//     {
//       id: 6,
//       type: "reminder",
//       title: "Court Appearance Reminder",
//       message: "Case RPT-33221100 hearing scheduled for tomorrow at 9:00 AM",
//       time: "5 hours ago",
//       read: true,
//       priority: "high",
//       icon: Clock,
//       link: "/officer/cases/RPT-33221100",
//     },
//     {
//       id: 7,
//       type: "new_case",
//       title: "New Case Assigned",
//       message: "You have been assigned to case RPT-99887766 (Burglary)",
//       time: "1 day ago",
//       read: true,
//       priority: "high",
//       icon: FileText,
//       link: "/officer/cases/RPT-99887766",
//     },
//     {
//       id: 8,
//       type: "update",
//       title: "Evidence Analysis Complete",
//       message: "Forensic results available for case RPT-12345678",
//       time: "1 day ago",
//       read: true,
//       priority: "medium",
//       icon: FileText,
//       link: "/officer/cases/RPT-12345678",
//     },
//   ];

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "urgent":
//         return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20";
//       case "high":
//         return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
//       case "medium":
//         return "border-l-4 border-l-blue-500";
//       case "low":
//         return "border-l-4 border-l-gray-500";
//       default:
//         return "";
//     }
//   };

//   const getNotificationIcon = (Icon: any, priority: string) => {
//     const colorClass =
//       priority === "urgent"
//         ? "text-red-600"
//         : priority === "high"
//         ? "text-orange-600"
//         : priority === "medium"
//         ? "text-blue-600"
//         : "text-gray-600";
//     return <Icon className={`h-5 w-5 ${colorClass}`} />;
//   };

//   const filteredNotifications =
//     filter === "all"
//       ? notifications
//       : filter === "unread"
//       ? notifications.filter((n) => !n.read)
//       : notifications;

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-4xl mx-auto">
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-3">
//               <div className="p-3 bg-accent/10 rounded-full">
//                 <Bell className="h-8 w-8 text-accent" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">Notifications</h1>
//                 <p className="text-muted-foreground">
//                   {unreadCount} unread notification
//                   {unreadCount !== 1 ? "s" : ""}
//                 </p>
//               </div>
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => alert("All marked as read")}
//             >
//               <Check className="mr-2 h-4 w-4" />
//               Mark All Read
//             </Button>
//           </div>
//         </div>

//         {/* Filter Tabs */}
//         <Card className="mb-6">
//           <CardContent className="p-4">
//             <div className="flex gap-2">
//               <Button
//                 variant={filter === "all" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setFilter("all")}
//                 className={filter === "all" ? "" : "bg-transparent"}
//               >
//                 All
//                 <Badge variant="secondary" className="ml-2">
//                   {notifications.length}
//                 </Badge>
//               </Button>
//               <Button
//                 variant={filter === "unread" ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setFilter("unread")}
//                 className={filter === "unread" ? "" : "bg-transparent"}
//               >
//                 Unread
//                 <Badge variant="secondary" className="ml-2">
//                   {unreadCount}
//                 </Badge>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notifications List */}
//         <div className="space-y-3">
//           {filteredNotifications.map((notification) => {
//             const Icon = notification.icon;
//             return (
//               <Card
//                 key={notification.id}
//                 className={`${getPriorityColor(notification.priority)} ${
//                   !notification.read ? "shadow-md" : ""
//                 }`}
//               >
//                 <CardContent className="p-4">
//                   <div className="flex items-start gap-4">
//                     <div
//                       className={`p-2 rounded-lg ${
//                         !notification.read ? "bg-accent/20" : "bg-muted"
//                       }`}
//                     >
//                       {getNotificationIcon(Icon, notification.priority)}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-start justify-between mb-2">
//                         <div>
//                           <div className="flex items-center gap-2 mb-1">
//                             <h3
//                               className={`font-semibold ${
//                                 !notification.read
//                                   ? "text-foreground"
//                                   : "text-muted-foreground"
//                               }`}
//                             >
//                               {notification.title}
//                             </h3>
//                             {!notification.read && (
//                               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//                             )}
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             {notification.message}
//                           </p>
//                         </div>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8"
//                           onClick={() => alert("Notification deleted")}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                       <div className="flex items-center justify-between mt-3">
//                         <span className="text-xs text-muted-foreground">
//                           {notification.time}
//                         </span>
//                         <div className="flex gap-2">
//                           {!notification.read && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={() => alert("Marked as read")}
//                             >
//                               <Check className="mr-1 h-3 w-3" />
//                               Mark Read
//                             </Button>
//                           )}
//                           {notification.link && notification.link !== "#" && (
//                             <Link href={notification.link}>
//                               <Button size="sm">View</Button>
//                             </Link>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {filteredNotifications.length === 0 && (
//           <Card>
//             <CardContent className="p-12 text-center">
//               <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
//               <p className="text-muted-foreground">You're all caught up!</p>
//             </CardContent>
//           </Card>
//         )}

//         {/* Notification Settings */}
//         <Card className="mt-8">
//           <CardHeader>
//             <CardTitle>Notification Preferences</CardTitle>
//             <CardDescription>
//               Customize what notifications you receive
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 { label: "New Case Assignments", enabled: true },
//                 { label: "Case Updates", enabled: true },
//                 { label: "High Priority Alerts", enabled: true },
//                 { label: "Messages from Supervisors", enabled: true },
//                 { label: "Court Reminders", enabled: true },
//                 { label: "System Announcements", enabled: false },
//               ].map((pref, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-3 bg-muted rounded-lg"
//                 >
//                   <span className="text-sm font-medium">{pref.label}</span>
//                   <Button
//                     variant={pref.enabled ? "default" : "outline"}
//                     size="sm"
//                   >
//                     {pref.enabled ? "Enabled" : "Disabled"}
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Clock,
  MessageSquare,
  Trash2,
  Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns"; // Add this line

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
  reportId?: string;
  senderId?: string;
  report?: { caseNumber: string; title: string };
  sender?: { fullName: string };
}

export default function OfficerNotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all"); // read/unread
  const [typeFilter, setTypeFilter] = useState("all"); // notification type
  const [socket, setSocket] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem("officerUser") || "{}");
  const token = localStorage.getItem("officerToken") || "";
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", filter, typeFilter],
    queryFn: async () => {
      const typeQuery = typeFilter !== "all" ? `&type=${typeFilter}` : "";
      const unreadQuery = filter === "unread" ? "&unreadOnly=true" : "";
      
      const res = await fetch(`http://localhost:4000/api/notifications?limit=50${typeQuery}${unreadQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      return data.notifications || [];
    },
    enabled: !!token,
  });

  // Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `http://localhost:4000/api/notifications/${id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to mark as read");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`http://localhost:4000/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete notification");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  // Socket.io for real-time
  useEffect(() => {
    if (!user.id || !token) return;

    const socketIo = io("http://localhost:4000", {
      auth: { token },
    });

    socketIo.on("connect", () => {
      socketIo.emit("joinRoom", `user_${user.id}`);
      
      // Join admin room if user is admin
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        socketIo.emit("joinRoom", "admin");
      }
    });

    socketIo.on("new-notification", (notification: Notification) => {
      queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
        return old ? [notification, ...old] : [notification];
      });
      toast.success(notification.title, { description: notification.body });
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [user.id, token, queryClient]);

  const notifications = notificationsData || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "border-l-red-500 bg-red-50/30";
      case "HIGH":
        return "border-l-orange-500 bg-orange-50/30";
      case "MEDIUM":
        return "border-l-blue-500 bg-blue-50/30";
      case "LOW":
        return "border-l-gray-500 bg-gray-50/30";
      default:
        return "";
    }
  };

  const getNotificationIcon = (type: string) => {
    const icons = {
      ASSIGNMENT: FileText,
      HIGH_PRIORITY: AlertTriangle,
      CASE_UPDATE: Clock,
      MESSAGE: MessageSquare,
      CASE_RESOLVED: CheckCircle2,
      COURT_REMINDER: Calendar,
      SYSTEM_ANNOUNCEMENT: Bell,
    } as Record<string, any>;
    return icons[type] || Bell;
  };

  // Sort: Unread first, then by date (newest first)
  const filteredNotifications = notifications.sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isRead ? 1 : -1;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // function formatDistanceToNow(
  //   arg0: Date,
  //   arg1: { addSuffix: boolean }
  // ): import("react").ReactNode {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-full">
                <Bell className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-muted-foreground">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => markReadMutation.mutate("all")}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Read/Unread Filter */}
              <div className="flex gap-3">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All
                  <Badge variant="secondary" className="ml-2">
                    {notificationsData?.length || 0}
                  </Badge>
                </Button>
                <Button
                  variant={filter === "unread" ? "default" : "outline"}
                  onClick={() => setFilter("unread")}
                >
                  Unread
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                </Button>
              </div>

              {/* Admin Type Filter */}
              {isAdmin && (
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                  <Button
                    variant={typeFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("all")}
                  >
                    All Types
                  </Button>
                  <Button
                    variant={typeFilter === "ASSIGNMENT" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("ASSIGNMENT")}
                  >
                    Assignments
                  </Button>
                  <Button
                    variant={typeFilter === "STATUS_CHANGE" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("STATUS_CHANGE")}
                  >
                    Status
                  </Button>
                  <Button
                    variant={typeFilter === "SYSTEM" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter("SYSTEM")}
                  >
                    System
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <Card
              key={n.id}
              className={`transition-colors cursor-pointer hover:bg-muted/50 ${getPriorityColor(n.priority)} ${
                !n.isRead ? "shadow-md ring-1 ring-primary/20" : "opacity-80 bg-background/50"
              }`}
              onClick={() => {
                if (!n.isRead) markReadMutation.mutate(n.id);
                if (n.reportId) router.push(`/officer/cases/${n.report?.caseNumber}`);
              }}
            >
              <CardContent className="p-4 relative group">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      !n.isRead ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {(() => {
                      const IconComponent = getNotificationIcon(n.type);
                      return <IconComponent className="h-5 w-5" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-semibold ${
                              !n.isRead
                                ? "text-foreground"
                                : "text-muted-foreground font-medium"
                            }`}
                          >
                            {n.title}
                          </h3>
                          {!n.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className={`text-sm ${!n.isRead ? "text-foreground/90" : "text-muted-foreground"}`}>
                          {n.body}
                        </p>
                      </div>
                      
                      {/* Actions - visible on hover or if important */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {!n.isRead && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markReadMutation.mutate(n.id);
                                }}
                                title="Mark as read"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteMutation.mutate(n.id);
                            }}
                            title="Delete notification"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {/* Optional extra actions if needed */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Notifications</h3>
              <p className="text-muted-foreground">You're all caught up!</p>
            </CardContent>
          </Card>
        )}

        {/* Notification Preferences */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Customize what notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "New Case Assignments", enabled: true },
                { label: "Case Updates", enabled: true },
                { label: "High Priority Alerts", enabled: true },
                { label: "Messages from Supervisors", enabled: true },
                { label: "Court Reminders", enabled: true },
                { label: "System Announcements", enabled: false },
              ].map((pref, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="text-sm font-medium">{pref.label}</span>
                  <Button
                    variant={pref.enabled ? "default" : "outline"}
                    size="sm"
                  >
                    {pref.enabled ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

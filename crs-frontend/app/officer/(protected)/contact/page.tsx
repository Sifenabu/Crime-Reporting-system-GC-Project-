// // app/officer/contact/page.tsx
// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Search,
//   Eye,
//   Mail,
//   Phone,
//   User,
//   Calendar,
//   Loader2,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// interface ContactMessage {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   subject: string;
//   message: string;
//   status: "NEW" | "HANDLED";
//   createdAt: string;
// }

// export default function ContactMessagesPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedTab, setSelectedTab] = useState("all");
//   const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
//     null
//   );
//   const [isOpen, setIsOpen] = useState(false);

//   const {
//     data: messages = [],
//     isLoading,
//     error,
//   } = useQuery<ContactMessage[]>({
//     queryKey: ["contact-messages"],
//     queryFn: async () => {
//       const res = await fetch("http://localhost:4000/api/contact");
//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(`Failed: ${res.status} - ${errText}`);
//       }
//       const data = await res.json();
//       console.log("Fetched messages:", data); // ← DEBUG: Check console
//       return data;
//     },
//   });

//   const filteredMessages = messages.filter((msg) => {
//     const searchLower = searchQuery.toLowerCase();
//     const matchesSearch =
//       `${msg.firstName} ${msg.lastName}`.toLowerCase().includes(searchLower) ||
//       msg.email.toLowerCase().includes(searchLower) ||
//       msg.subject.toLowerCase().includes(searchLower) ||
//       msg.message.toLowerCase().includes(searchLower);

//     const matchesTab =
//       selectedTab === "all" ||
//       (selectedTab === "new" && msg.status === "NEW") ||
//       (selectedTab === "handled" && msg.status === "HANDLED");

//     return matchesSearch && matchesTab;
//   });

//   const newCount = messages.filter((m) => m.status === "NEW").length;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="p-8 text-red-600">Error: {error.message}</div>;
//   }

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
//       <p className="text-muted-foreground mb-8">
//         Manage messages from citizens via contact form
//       </p>

//       <Card>
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle>All Messages</CardTitle>
//             <div className="text-sm text-muted-foreground">
//               Total: {messages.length} messages
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Tabs
//             value={selectedTab}
//             onValueChange={setSelectedTab}
//             className="mb-6"
//           >
//             <TabsList>
//               <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
//               <TabsTrigger value="new">
//                 New <Badge className="ml-2">{newCount}</Badge>
//               </TabsTrigger>
//               <TabsTrigger value="handled">
//                 Handled{" "}
//                 <Badge className="ml-2">{messages.length - newCount}</Badge>
//               </TabsTrigger>
//             </TabsList>
//           </Tabs>

//           <div className="relative mb-6">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by name, email, subject..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           <div className="border rounded-lg">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Sender</TableHead>
//                   <TableHead>Subject</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredMessages.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-center py-8">
//                       No messages found
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   filteredMessages.map((msg) => (
//                     <TableRow key={msg.id}>
//                       <TableCell>
//                         <div>
//                           <p className="font-medium">
//                             {msg.firstName} {msg.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {msg.email}
//                           </p>
//                         </div>
//                       </TableCell>
//                       <TableCell className="max-w-xs truncate">
//                         {msg.subject}
//                       </TableCell>
//                       <TableCell>
//                         <Badge
//                           variant={
//                             msg.status === "NEW" ? "destructive" : "secondary"
//                           }
//                         >
//                           {msg.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {formatDistanceToNow(new Date(msg.createdAt), {
//                           addSuffix: true,
//                         })}
//                       </TableCell>
//                       <TableCell className="text-right">
//                         <Button
//                           size="sm"
//                           variant="ghost"
//                           onClick={() => {
//                             setSelectedMessage(msg);
//                             setIsOpen(true);
//                           }}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Contact Message</DialogTitle>
//           </DialogHeader>
//           {selectedMessage && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Name</p>
//                   <p className="font-medium">
//                     {selectedMessage.firstName} {selectedMessage.lastName}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Email</p>
//                   <p className="font-medium">{selectedMessage.email}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Phone</p>
//                   <p className="font-medium">{selectedMessage.phone}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-muted-foreground">Date</p>
//                   <p className="font-medium">
//                     {new Date(selectedMessage.createdAt).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Subject</p>
//                 <p className="font-medium mt-1">{selectedMessage.subject}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Message</p>
//                 <p className="mt-1 whitespace-pre-wrap">
//                   {selectedMessage.message}
//                 </p>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  Mail,
  Phone,
  User,
  Calendar,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { logout } from "@/lib/auth"; // ← Import logout

interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "NEW" | "IN_REVIEW" | "RESOLVED" | "SPAM";
  handledById: string | null;
  handledAt: string | null;
  notes: string | null;
  createdAt: string;
  handledBy: {
    user: {
      name: string;
      email: string;
    };
  } | null;
}

export default function ContactMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [notes, setNotes] = useState("");

  const queryClient = useQueryClient();

  // Get token once (with debug)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("officerToken") : null;

  // Debug: Log token status on every render
  useEffect(() => {
    console.log("[Contact Page Debug] Token status:", {
      tokenExists: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : "null",
      timestamp: new Date().toISOString(),
    });
  }, [token]);

  // Early redirect if no token
  useEffect(() => {
    if (!token && typeof window !== "undefined") {
      console.warn("[Contact] No token found → forcing logout");
      toast.error("Session expired or invalid. Please log in again.");
      logout(); // ← This clears storage and redirects to login
    }
  }, [token]);

  const {
    data: messages = [],
    isLoading,
    error,
  } = useQuery<ContactMessage[]>({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token. Redirecting to login...");
      }

      console.log(
        "[Contact Fetch] Requesting with token:",
        token.substring(0, 20) + "..."
      );

      const response = await fetch("http://localhost:4000/api/contact", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Contact Fetch Error]", response.status, errorText);
        if (response.status === 401) {
          toast.error("Unauthorized - session may have expired.");
          logout(); // Auto-logout on 401
        }
        throw new Error(`Failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("[Contact Fetch] Success:", data);
      return data;
    },
    enabled: !!token, // Don't run query if no token
    retry: false, // Don't retry 401 forever
  });

  // Mark as handled mutation (also uses token)
  const handleMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      if (!token) throw new Error("No token for update");

      const response = await fetch(`http://localhost:4000/api/contact/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "RESOLVED",
          notes,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        if (response.status === 401) {
          toast.error("Session expired during update.");
          logout();
        }
        throw new Error(err || "Update failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("Message marked as handled");
      setIsDetailOpen(false);
      setSelectedMessage(null);
      setNotes("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update message");
    },
  });

  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async ({ id, message }: { id: string; message: string }) => {
      if (!token) throw new Error("No token for reply");

      const response = await fetch(`http://localhost:4000/api/contact/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Reply failed");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      toast.success("Reply sent and marked as handled");
      setIsDetailOpen(false);
      setSelectedMessage(null);
      setNotes("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send reply");
    },
  });

  // Filter messages based on tab and search
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      `${msg.firstName} ${msg.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "new" && msg.status === "NEW") ||
      (selectedTab === "handled" && msg.status === "RESOLVED");

    return matchesSearch && matchesTab;
  });

  // Count messages by status
  const newCount = messages.filter((msg) => msg.status === "NEW").length;
  const handledCount = messages.filter(
    (msg) => msg.status === "RESOLVED"
  ).length;

  const handleViewDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setNotes(message.notes || "");
    setIsDetailOpen(true);
  };

  const handleMarkAsHandled = () => {
    if (selectedMessage) {
      handleMutation.mutate({ id: selectedMessage.id, notes });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-red-600">
        Error: {error.message}
        <p className="mt-2 text-sm">
          Please log out and log in again, or check the console for details.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-[#1F2937]">
            Contact Messages
          </h1>
          <p className="text-muted-foreground">
            Manage messages from citizens via contact form
          </p>
        </div>
        {newCount > 0 && (
          <Badge variant="destructive" className="text-lg px-4 py-2">
            {newCount} New
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>Total: {messages.length} messages</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs for filtering */}
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="mb-6"
          >
            <TabsList>
              <TabsTrigger value="all">
                All{" "}
                <Badge className="ml-2 bg-gray-200 text-gray-700">
                  {messages.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="new">
                New{" "}
                <Badge className="ml-2 bg-red-500 text-white">{newCount}</Badge>
              </TabsTrigger>
              <TabsTrigger value="handled">
                Handled{" "}
                <Badge className="ml-2 bg-green-500 text-white">
                  {handledCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, subject, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Message
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={message.status === "NEW" ? "bg-blue-50" : ""}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {message.firstName} {message.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {message.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium max-w-[200px] truncate">
                          {message.subject}
                        </p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <p className="text-sm text-muted-foreground max-w-[300px] truncate">
                          {message.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        {message.status === "NEW" ? (
                          <Badge variant="destructive">NEW</Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            HANDLED
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(message)}
                          className="hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Full information about the contact message
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between">
                {selectedMessage.status === "NEW" ? (
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    NEW MESSAGE
                  </Badge>
                ) : (
                  <Badge className="text-lg px-4 py-2 bg-green-100 text-green-700">
                    HANDLED
                  </Badge>
                )}
                <p className="text-sm text-muted-foreground">
                  Received{" "}
                  {formatDistanceToNow(new Date(selectedMessage.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              {/* Sender Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sender Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-semibold">
                        {selectedMessage.firstName} {selectedMessage.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-semibold">{selectedMessage.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-semibold">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject */}
              <div>
                <Label className="text-base font-semibold">Subject</Label>
                <p className="mt-2 p-4 bg-muted rounded-lg font-medium">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Message */}
              <div>
                <Label className="text-base font-semibold">Message</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Handled Information */}
              {selectedMessage.status === "RESOLVED" &&
                selectedMessage.handledBy && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Handled
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Handled By
                        </p>
                        <p className="font-semibold">
                          {selectedMessage.handledBy.user.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedMessage.handledBy.user.email}
                        </p>
                      </div>
                      {selectedMessage.handledAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Handled At
                          </p>
                          <p className="font-semibold">
                            {new Date(
                              selectedMessage.handledAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedMessage.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="mt-1 p-3 bg-white rounded border">
                            {selectedMessage.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

              {/* Action Section */}
              {selectedMessage.status === "NEW" && (
                <div className="space-y-3">
                  <Label htmlFor="notes">Add Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes or comments about handling this message..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedMessage) {
                            replyMutation.mutate({ 
                                id: selectedMessage.id, 
                                message: notes // Treat notes as reply body if replying
                            });
                        }
                      }}
                      disabled={!notes.trim()}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply & Resolve
                    </Button>
                    <Button onClick={handleMarkAsHandled}>
                      Mark as Handled
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

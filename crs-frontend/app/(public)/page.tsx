import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  AlertTriangle,
  Search,
  Newspaper,
  Phone,
  MapPin,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HomeBlogPage from "@/components/home/blog/home-blog";

export default function HomePage() {
  const stats = [
    { label: "Reports This Month", value: "247", icon: AlertTriangle },
    { label: "Cases Resolved", value: "189", icon: Shield },
    { label: "Response Time", value: "< 15 min", icon: Clock },
    { label: "Officers On Duty", value: "52", icon: Users },
  ];

  const quickActions = [
    {
      title: "Report a Crime",
      description: "Submit an anonymous crime report with evidence",
      href: "/report",
      icon: AlertTriangle,
      variant: "default" as const,
    },
    {
      title: "Track Your Report",
      description: "Check the status of your submitted report",
      href: "/track",
      icon: Search,
      variant: "outline" as const,
    },
    {
      title: "Safety Notices",
      description: "View important safety alerts and warnings",
      href: "/safety",
      icon: Newspaper,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      {/* <section
        className="relative bg-linear-to-br  hero-bg min-h-screen flex items-center justify-center from-primary to-secondary text-primary-foreground py-20 md:py-32"
        style={{ backgroundImage: "url('/hero 6.png')" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-primary-foreground/10 rounded-full mb-4">
              <Shield className="h-16 w-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Keep Adama Safe Together
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 text-pretty">
              Report crimes anonymously, track investigations, and stay informed
              with real-time safety updates from the Adama City Police
              Department.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/report">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report a Crime
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Track Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* 1. Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/hero 6.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full mb-4 animate-bounce">
              Official Adama City Police Portal
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Protecting Our <span className="text-blue-500">Community</span>{" "}
              Together
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto">
              Secure, anonymous reporting and real-time safety tracking for a
              better Adama.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/report">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-900/20"
                >
                  <AlertTriangle className="mr-2 h-6 w-6" />
                  Report a Crime
                </Button>
              </Link>
              <Link href="/track">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                >
                  <Search className="mr-2 h-6 w-6" />
                  Track Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access our services quickly and easily
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 space-y-4">
                      <div className="p-3 bg-accent/10 rounded-lg w-fit">
                        <Icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold">{action.title}</h3>
                      <p className="text-muted-foreground">
                        {action.description}
                      </p>
                      <Button variant={action.variant} className="w-full">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Latest News (NEW CONTENT) */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center   ">
            <div className="w-full flex flex-col pb-8  items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Safety Updates
              </h2>
              <p className="text-slate-600 flex flex-col items-center justify-center w-full">
                Stay informed with the latest community notices and crime
                prevention strategies.
              </p>
            </div>
            <Link href="/blog" className="hidden md:block">
              <Button variant="outline" className="rounded-full px-6">
                View All Articles
              </Button>
            </Link>
          </div>

          <HomeBlogPage />
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all"
              >
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      Prevention
                    </Badge>
                    <span className="text-xs text-slate-400">Jan 12, 2026</span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    Safety measures for Adama marketplace vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    New guidelines issued for business owners to enhance
                    security through coordinated surveillance...
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-4 text-blue-600 font-bold group-hover:gap-2 transition-all"
                  >
                    Read Full Report <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <MapPin className="h-10 w-10 text-accent" />
              <h3 className="text-2xl font-bold">Visit Us</h3>
              <p className="text-muted-foreground">
                Adama City Police Headquarters
                <br />
                Central District, Adama
                <br />
                Ethiopia
              </p>
              <p className="text-sm text-muted-foreground">
                Open 24/7 for emergencies
                <br />
                Office hours: Mon-Fri, 8:00 AM - 5:00 PM
              </p>
            </div>
            <div className="space-y-4">
              <Newspaper className="h-10 w-10 text-accent" />
              <h3 className="text-2xl font-bold">Stay Informed</h3>
              <p className="text-muted-foreground">
                Get the latest safety notices, crime prevention tips, and
                community updates on our blog.
              </p>
              <Link href="/blog">
                <Button variant="outline">Read Blog</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Emergency Banner */}
      <section className="bg-red-500 text-destructive-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Emergency?</h3>
                <p className="text-destructive-foreground/90">
                  Call 911 for immediate assistance
                </p>
              </div>
            </div>
            <Button size="lg" variant="secondary">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ("use client");

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Shield,
//   AlertTriangle,
//   Search,
//   Newspaper,
//   Phone,
//   MapPin,
//   Clock,
//   Users,
//   ArrowRight,
//   Mail,
//   CheckCircle2,
//   Lock,
//   Camera,
//   Scale,
// } from "lucide-react";

// export default function HomePage() {
//   const stats = [
//     { label: "Reports This Month", value: "247", icon: AlertTriangle },
//     { label: "Cases Resolved", value: "189", icon: Shield },
//     { label: "Response Time", value: "< 15 min", icon: Clock },
//     { label: "Officers On Duty", value: "52", icon: Users },
//   ];

//   const quickActions = [
//     {
//       title: "Report a Crime",
//       description: "Submit an anonymous crime report with evidence",
//       href: "/report",
//       icon: AlertTriangle,
//       variant: "default" as const,
//     },
//     {
//       title: "Track Your Report",
//       description: "Check the status of your submitted report",
//       href: "/track",
//       icon: Search,
//       variant: "outline" as const,
//     },
//     {
//       title: "Safety Notices",
//       description: "View important safety alerts and warnings",
//       href: "/safety",
//       icon: Newspaper,
//       variant: "outline" as const,
//     },
//   ];

//   const crimeTypes = [
//     { name: "Theft & Burglary", icon: Lock },
//     { name: "Traffic Incident", icon: AlertTriangle },
//     { name: "Cyber Crime", icon: Shield },
//     { name: "Vandalism", icon: Camera },
//     { name: "Public Disturbance", icon: Users },
//     { name: "Legal Disputes", icon: Scale },
//   ];

//   return (
//     <div className="flex flex-col">
//       {/* 1. Hero Section */}
//       <section
//         className="relative min-h-screen flex items-center justify-center bg-slate-900 text-white overflow-hidden"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/hero 6.png')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="max-w-3xl mx-auto text-center space-y-8">
//             <Badge className="bg-blue-600 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full mb-4 animate-bounce">
//               Official Adama City Police Portal
//             </Badge>
//             <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
//               Protecting Our <span className="text-blue-500">Community</span>{" "}
//               Together
//             </h1>
//             <p className="text-xl md:text-2xl text-slate-200 font-light max-w-2xl mx-auto">
//               Secure, anonymous reporting and real-time safety tracking for a
//               better Adama.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
//               <Link href="/report">
//                 <Button
//                   size="lg"
//                   className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg font-bold shadow-xl shadow-blue-900/20"
//                 >
//                   <AlertTriangle className="mr-2 h-6 w-6" />
//                   Report a Crime
//                 </Button>
//               </Link>
//               <Link href="/track">
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
//                 >
//                   <Search className="mr-2 h-6 w-6" />
//                   Track Progress
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 2. Stats Section */}
//       <section className="py-12 bg-slate-50 border-y">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center text-center p-4"
//               >
//                 <div className="p-3 bg-blue-100 rounded-2xl mb-3 text-blue-700">
//                   <stat.icon className="h-7 w-7" />
//                 </div>
//                 <div className="text-3xl font-black text-slate-900">
//                   {stat.value}
//                 </div>
//                 <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 3. Quick Crime Select (NEW CONTENT) */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl md:text-4xl font-black mb-12">
//             Categorized Reporting
//           </h2>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
//             {crimeTypes.map((type, idx) => (
//               <Link href={`/report?type=${type.name.toLowerCase()}`} key={idx}>
//                 <div className="group p-6 rounded-3xl border border-slate-100 bg-slate-50 hover:bg-blue-600 hover:text-white transition-all cursor-pointer">
//                   <type.icon className="h-8 w-8 mx-auto mb-4 text-blue-600 group-hover:text-white transition-colors" />
//                   <span className="font-bold text-sm block">{type.name}</span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </section>

// {/* 4. Latest News (NEW CONTENT) */}
// <section className="py-20 bg-slate-50">
//   <div className="container mx-auto px-4">
//     <div className="flex items-end justify-between mb-12">
//       <div className="max-w-xl">
//         <h2 className="text-3xl md:text-4xl font-black mb-4">
//           Safety Updates
//         </h2>
//         <p className="text-slate-600">
//           Stay informed with the latest community notices and crime
//           prevention strategies.
//         </p>
//       </div>
//       <Link href="/blog" className="hidden md:block">
//         <Button variant="outline" className="rounded-full px-6">
//           View All Articles
//         </Button>
//       </Link>
//     </div>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//       {[1, 2, 3].map((i) => (
//         <Card
//           key={i}
//           className="group overflow-hidden rounded-3xl border-none shadow-sm hover:shadow-xl transition-all"
//         >
//           <div className="aspect-video bg-slate-200 relative overflow-hidden">
//             <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors" />
//           </div>
//           <CardHeader>
//             <div className="flex items-center gap-2 mb-2">
//               <Badge
//                 variant="secondary"
//                 className="bg-blue-100 text-blue-700"
//               >
//                 Prevention
//               </Badge>
//               <span className="text-xs text-slate-400">Jan 12, 2026</span>
//             </div>
//             <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
//               Safety measures for Adama marketplace vendors
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-slate-600 text-sm line-clamp-2">
//               New guidelines issued for business owners to enhance
//               security through coordinated surveillance...
//             </p>
//             <Button
//               variant="link"
//               className="p-0 h-auto mt-4 text-blue-600 font-bold group-hover:gap-2 transition-all"
//             >
//               Read Full Report <ArrowRight className="h-4 w-4" />
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   </div>
// </section>

//       {/* 5. FAQ Section (NEW CONTENT) */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4 max-w-4xl">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-black mb-4">
//               Transparent Policing
//             </h2>
//             <p className="text-slate-600">
//               Everything you need to know about our digital reporting process.
//             </p>
//           </div>
//           <Accordion type="single" collapsible className="w-full space-y-4">
//             <AccordionItem
//               value="item-1"
//               className="border rounded-2xl px-6 py-2 bg-slate-50"
//             >
//               <AccordionTrigger className="hover:no-underline font-bold text-lg">
//                 How is my identity protected?
//               </AccordionTrigger>
//               <AccordionContent className="text-slate-600 leading-relaxed">
//                 When you choose "Anonymous Reporting," we do not store your
//                 name, phone number, or IP address. Our system is designed to
//                 provide safety without compromising your privacy.
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem
//               value="item-2"
//               className="border rounded-2xl px-6 py-2 bg-slate-50"
//             >
//               <AccordionTrigger className="hover:no-underline font-bold text-lg">
//                 What happens after I submit a report?
//               </AccordionTrigger>
//               <AccordionContent className="text-slate-600 leading-relaxed">
//                 Your report is assigned to the relevant department (Traffic,
//                 Criminal Investigation, etc.) within 15 minutes. You can track
//                 real-time status updates using your unique Report ID.
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </section>

//       {/* 6. Newsletter/Alert Section (NEW CONTENT) */}
//       <section className="py-16 bg-blue-600 text-white">
//         <div className="container mx-auto px-4 text-center max-w-3xl">
//           <div className="bg-white/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6">
//             <Mail className="h-8 w-8" />
//           </div>
//           <h2 className="text-3xl font-bold mb-4">
//             Subscribe to Safety Alerts
//           </h2>
//           <p className="mb-8 text-blue-100 font-light text-lg">
//             Get immediate notifications about road closures, emergency updates,
//             and neighborhood safety warnings.
//           </p>
//           <form className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="flex-1 rounded-2xl px-6 py-4 text-slate-900 border-none outline-none focus:ring-2 ring-blue-400"
//             />
//             <Button
//               size="lg"
//               className="rounded-2xl bg-white text-blue-600 hover:bg-slate-100 font-black h-14 px-8"
//             >
//               Join Network
//             </Button>
//           </form>
//         </div>
//       </section>

//       {/* 7. Emergency Banner */}
//       <section className="bg-red-600 text-white py-12 relative overflow-hidden">
//         <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
//           <div className="flex items-center gap-6">
//             <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
//               <Phone className="h-10 w-10" />
//             </div>
//             <div>
//               <h3 className="text-3xl font-black">EMERGENCY LINE: 911</h3>
//               <p className="text-red-100 text-lg">
//                 Immediate police, medical, or fire response required.
//               </p>
//             </div>
//           </div>
//           <Button
//             size="lg"
//             className="bg-white text-red-600 hover:bg-slate-100 font-black px-12 h-16 text-xl rounded-full"
//           >
//             Call Dispatch Now
//           </Button>
//         </div>
//       </section>
//     </div>
//   );
// }

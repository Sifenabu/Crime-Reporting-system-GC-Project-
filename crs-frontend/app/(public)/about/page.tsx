import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Target, Heart, Users, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We uphold the highest standards of honesty and ethical conduct in all our actions.",
    },
    {
      icon: Heart,
      title: "Compassion",
      description: "We serve with empathy and respect for the dignity of every individual in our community.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We build strong partnerships with residents to create a safer, more connected Adama.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We pursue continuous improvement and innovation in all aspects of policing.",
    },
  ]

  const stats = [
    { label: "Years of Service", value: "50+" },
    { label: "Officers", value: "200+" },
    { label: "Districts Covered", value: "12" },
    { label: "Community Programs", value: "15" },
  ]

  const leadership = [
    {
      name: "Chief Michael Thompson",
      role: "Chief of Police",
      bio: "Leading the department since 2018 with 25 years of law enforcement experience.",
    },
    {
      name: "Deputy Chief Sarah Martinez",
      role: "Deputy Chief",
      bio: "Oversees operations and community relations with expertise in modern policing strategies.",
    },
    {
      name: "Captain Robert Johnson",
      role: "Criminal Investigations",
      bio: "Leads the detective division with specialized training in forensic investigations.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-balance">About Adama City Police</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Serving and protecting the Adama community for over 50 years with dedication, professionalism, and a
            commitment to public safety.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To protect and serve the residents of Adama City through proactive community policing, innovative crime
                prevention strategies, and unwavering commitment to justice, while fostering trust and collaboration
                with all members of our diverse community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="p-3 bg-accent/10 rounded-lg w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                To be a model of excellence in law enforcement, recognized for our professionalism, integrity, and
                dedication to making Adama City one of the safest communities in the region through innovation,
                collaboration, and respect for all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index}>
                  <CardHeader className="text-center">
                    <div className="p-3 bg-accent/10 rounded-lg w-fit mx-auto mb-4">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* History */}
        <Card className="mb-16 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-2xl">Our History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The Adama City Police Department was established in 1974 with a small team of 12 officers dedicated to
              maintaining peace and order in our growing community. Over the past five decades, we have evolved into a
              modern, professional law enforcement agency serving over 500,000 residents.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Throughout our history, we have remained committed to adapting to the changing needs of our community,
              embracing new technologies, and implementing progressive policing strategies that prioritize both safety
              and civil rights.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, the Adama City Police Department is proud to be at the forefront of community-oriented policing,
              with specialized units in cybercrime, traffic safety, youth outreach, and victim support services.
            </p>
          </CardContent>
        </Card>

        {/* Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {leadership.map((leader, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle>{leader.name}</CardTitle>
                  <CardDescription className="text-primary font-semibold">{leader.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">{leader.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Our Departments</CardTitle>
            <CardDescription>Specialized units working together to keep Adama safe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Patrol Division",
                "Criminal Investigations",
                "Traffic Enforcement",
                "K-9 Unit",
                "Cybercrime Division",
                "Community Relations",
                "Training & Development",
                "Emergency Response Team",
              ].map((dept, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="font-medium">{dept}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

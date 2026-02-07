import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, Users, Newspaper, MessageSquare, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

function Contact() {
  return (
    <div className="min-h-screen bg-background">

      {/* Alert Banner */}
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 text-center text-sm">
        <span className="font-semibold text-destructive">⚠️ RESEARCH PROTOTYPE</span>
        <span className="text-muted-foreground mx-2">•</span>
        <span className="text-muted-foreground">Not FDA cleared or approved. Not a medical device. Not for clinical use.</span>
      </div>

      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">VitaSignal</p>
                <p className="text-xs text-muted-foreground">Clinical Intelligence</p>
              </div>
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">Technology</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden sm:inline">About</Link>
              <Link to="/contact" className="text-sm text-primary font-medium">Contact</Link>
              <ThemeToggle />
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">Licensing</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Connect with Dr. Collier for licensing inquiries, research collaborations, media requests, or general information about VitaSignal.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Typical response time: 2-3 business days
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Licensing */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Licensing Inquiries</CardTitle>
                  <CardDescription>Commercial partnerships & technology licensing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For EHR vendors, hospital systems, healthcare AI companies, and investors interested in licensing VitaSignal technology.
              </p>
              <a href="mailto:info@alexiscollier.com" className="block text-primary hover:underline font-semibold text-lg">
                info@alexiscollier.com
              </a>
              <Button variant="outline" size="sm" asChild>
                <Link to="/patents">View Licensing Information</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Research */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Research Collaborations</CardTitle>
                  <CardDescription>Academic partnerships & clinical validation studies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For researchers, clinicians, and academic institutions interested in clinical validation studies or co-investigation.
              </p>
              <a href="mailto:info@alexiscollier.com" className="block text-accent hover:underline font-semibold text-lg">
                info@alexiscollier.com
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Research Inquiry
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Media & Press</CardTitle>
                  <CardDescription>Interviews, speaking engagements, press releases</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For journalists, conference organizers, and media outlets requesting interviews or expert commentary on healthcare AI.
              </p>
              <a href="mailto:info@alexiscollier.com" className="block text-primary hover:underline font-semibold text-lg">
                info@alexiscollier.com
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Media Request
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* General */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle>General Inquiries</CardTitle>
                  <CardDescription>All other questions & information requests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For general questions, information requests, or inquiries that don't fit the categories above.
              </p>
              <a href="mailto:info@alexiscollier.com" className="block text-muted-foreground hover:underline font-semibold text-lg">
                info@alexiscollier.com
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">
                  <Mail className="w-4 h-4 mr-2" />
                  General Contact
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Before You Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">For Licensing Inquiries:</p>
                <p>
                  Please include your organization name, role, intended use case, and timeline.
                  We'll provide detailed technical specifications and licensing terms under NDA.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">For Research Collaborations:</p>
                <p>
                  Clinical validation studies require IRB approval, executed Data Use Agreements, and
                  institutional affiliation. See our <Link to="/dashboard" className="text-primary hover:underline">Technology page</Link> for collaboration requirements.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground">For Media Requests:</p>
                <p>
                  Please specify your publication/outlet, story angle, deadline, and interview format preference
                  (written Q&A, phone, video). High-resolution photos and press kit available upon request.
                </p>
              </div>
              <p className="text-xs text-destructive">
                Note: VitaSignal is a research prototype not cleared for clinical use.
                We cannot provide medical advice or patient-specific recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional Network */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-6">Connect Professionally</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                Dr. Collier maintains an active professional presence for networking, research updates, and industry insights.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button variant="outline" asChild>
                  <a href="https://linkedin.com/in/alexiscollier" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://orcid.org" target="_blank" rel="noopener noreferrer">ORCID Research Profile</a>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                For formal business inquiries, please use the email addresses above rather than social media direct messages.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border/30 bg-secondary/30">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground">VitaSignal</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024–2026 Dr. Alexis Collier, DHA. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <span className="text-border">|</span>
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
            <span className="text-border">|</span>
            <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Technology</Link>
            <span className="text-border">|</span>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contact;

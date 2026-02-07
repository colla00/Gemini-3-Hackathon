import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/layout/SiteLayout";

function Contact() {
  return (
    <SiteLayout title="Contact" description="Connect with Dr. Collier for licensing inquiries, research collaborations, or general information about VitaSignal.">
      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-primary/5 to-transparent text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Connect with Dr. Collier for licensing inquiries, research collaborations, or general information about VitaSignal.
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
                <Link to="/licensing">View Licensing Options</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Research & General</CardTitle>
                  <CardDescription>Academic partnerships, media, and all other inquiries</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                For researchers, clinicians, academic institutions, media outlets, and general information requests.
              </p>
              <a href="mailto:info@alexiscollier.com" className="block text-accent hover:underline font-semibold text-lg">
                info@alexiscollier.com
              </a>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:info@alexiscollier.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Inquiry
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Before You Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">For Licensing Inquiries:</p>
                <p>Please include your organization name, role, intended use case, and timeline.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">For Research Collaborations:</p>
                <p>Clinical validation studies require IRB approval, executed Data Use Agreements, and institutional affiliation.</p>
              </div>
              <p className="text-xs text-destructive">
                Note: VitaSignal is a research prototype not cleared for clinical use.
                We cannot provide medical advice or patient-specific recommendations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}

export default Contact;

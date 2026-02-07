import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Briefcase, Microscope, Newspaper, HelpCircle, Clock, Linkedin, Send, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import heroBg from "@/assets/hero-bg.jpg";
import { cn } from "@/lib/utils";

type FieldKey = "organization" | "role" | "useCase" | "timeline" | "irb";

const inquiryTypes: {
  id: string;
  icon: typeof Briefcase;
  label: string;
  desc: string;
  fields: FieldKey[];
  placeholder: string;
}[] = [
  {
    id: "licensing",
    icon: Briefcase,
    label: "Licensing Inquiry",
    desc: "EHR vendors, hospital systems, investors",
    fields: ["organization", "role", "useCase", "timeline"],
    placeholder: "Describe your intended use case, target market, and any relevant context about your organization's current clinical AI capabilities.",
  },
  {
    id: "research",
    icon: Microscope,
    label: "Research Collaboration",
    desc: "Academic centers, clinical validation",
    fields: ["organization", "role", "irb"],
    placeholder: "Describe your research interest, institutional affiliation, and any existing IRB approvals or datasets relevant to clinical AI validation.",
  },
  {
    id: "press",
    icon: Newspaper,
    label: "Press & Media",
    desc: "Interviews, articles, speaking requests",
    fields: ["organization", "role"],
    placeholder: "Describe your publication or event, audience size, topic focus, and proposed timeline.",
  },
  {
    id: "general",
    icon: HelpCircle,
    label: "General Inquiry",
    desc: "All other questions",
    fields: ["role"],
    placeholder: "How can we help you?",
  },
];

type InquiryType = typeof inquiryTypes[number]["id"];

function Contact() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const selected = inquiryTypes.find((t) => t.id === selectedType);

  return (
    <SiteLayout title="Contact" description="Connect with Dr. Collier for licensing inquiries, research collaborations, or general information about VitaSignal.">
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground text-primary-foreground">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-foreground" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-24 md:pb-20">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl mb-6 leading-[1.05] max-w-4xl">
            Get in
            <br />
            <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-6 opacity-80 leading-relaxed">
            Select the inquiry type that best describes your interest, and we'll route your message to the right channel.
          </p>
          <div className="flex items-center gap-4 text-sm opacity-70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Typical response: 2-3 business days
            </div>
            <a href="https://www.linkedin.com/in/alexiscollier/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Type Selector */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            Step 1: Select inquiry type
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {inquiryTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "group p-4 rounded-xl border text-left transition-all",
                  selectedType === type.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
                  selectedType === type.id ? "bg-primary/15" : "bg-secondary"
                )}>
                  <type.icon className={cn(
                    "w-5 h-5 transition-colors",
                    selectedType === type.id ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <p className="text-sm font-semibold text-foreground">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{type.desc}</p>
              </button>
            ))}
          </div>

          {/* Contact Form */}
          {selected && (
            <div className="animate-fade-in">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                Step 2: Your details
              </p>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <selected.icon className="w-5 h-5 text-primary" />
                    <CardTitle>{selected.label}</CardTitle>
                  </div>
                  <CardDescription>
                    All fields marked with * are required. Your inquiry will be sent to info@alexiscollier.com.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    action={`mailto:info@alexiscollier.com?subject=${encodeURIComponent(`[${selected.label}] New Inquiry via VitaSignal Website`)}`}
                    method="GET"
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="Dr. Jane Smith" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="jane@hospital.org" required />
                      </div>
                    </div>

                    {selected.fields.includes("organization") && (
                      <div className="space-y-2">
                        <Label htmlFor="org">Organization *</Label>
                        <Input id="org" placeholder="Hospital System / Company / University" required />
                      </div>
                    )}

                    {selected.fields.includes("role") && (
                      <div className="space-y-2">
                        <Label htmlFor="role">Your Role</Label>
                        <Input id="role" placeholder="Chief Medical Officer, Researcher, Journalist, etc." />
                      </div>
                    )}

                    {selected.fields.includes("timeline") && (
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Evaluation Timeline</Label>
                        <Input id="timeline" placeholder="e.g., Q2 2026, Exploratory, Immediate" />
                      </div>
                    )}

                    {selected.fields.includes("irb") && (
                      <div className="space-y-2">
                        <Label htmlFor="irb">IRB Status</Label>
                        <Input id="irb" placeholder="Approved / In Progress / Not Yet Started" />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder={selected.placeholder}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-muted-foreground">
                        Your data will only be used to respond to this inquiry.
                      </p>
                      <Button type="submit" className="gap-2">
                        <Send className="w-4 h-4" />
                        Send Inquiry
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Guidelines */}
          {selected && (
            <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border/30">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground space-y-1">
                  {selectedType === "licensing" && (
                    <p>Licensing discussions are conducted under mutual NDA. Initial conversations are exploratory with no commitment required.</p>
                  )}
                  {selectedType === "research" && (
                    <p>Clinical validation studies require IRB approval, executed Data Use Agreements, and institutional affiliation. We can discuss requirements during initial conversations.</p>
                  )}
                  {selectedType === "press" && (
                    <p>Dr. Collier is available for interviews, expert commentary, and speaking engagements on clinical AI, nursing informatics, and health equity in algorithmic systems.</p>
                  )}
                  {selectedType === "general" && (
                    <p>Note: VitaSignal is a research prototype not cleared for clinical use. We cannot provide medical advice or patient-specific recommendations.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

export default Contact;

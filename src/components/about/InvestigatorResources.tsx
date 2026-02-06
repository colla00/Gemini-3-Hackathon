import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FlaskConical, FileCheck, Users, Building2, Mail, 
  Clock, CheckCircle2, AlertCircle, GraduationCap
} from 'lucide-react';

const irbSteps = [
  {
    step: 1,
    title: "Institutional Partnership",
    description: "Establish affiliation with academic medical center or health system with EHR access",
    timeline: "1-3 months"
  },
  {
    step: 2,
    title: "Protocol Development",
    description: "Define study design, sample size, data variables, and outcome measures",
    timeline: "2-4 weeks"
  },
  {
    step: 3,
    title: "IRB Submission",
    description: "Submit protocol, DUA, HIPAA authorization/waiver, and consent forms",
    timeline: "2-8 weeks"
  },
  {
    step: 4,
    title: "Data Collection & Validation",
    description: "Extract de-identified EHR data and validate algorithm performance",
    timeline: "3-6 months"
  }
];

const collaborationRequirements = [
  "Institutional affiliation with IRB oversight capability",
  "Access to EHR system (Epic, Cerner, Meditech, or similar)",
  "CITI Human Subjects Research certification",
  "Data Use Agreement (DUA) execution authority",
  "Co-investigator with clinical informatics expertise"
];

const studyTypes = [
  {
    type: "Retrospective Validation",
    irbLevel: "Expedited/Exempt",
    timeline: "2-4 weeks",
    description: "De-identified chart review to validate risk predictions against actual outcomes",
    recommended: true
  },
  {
    type: "Prospective Observational",
    irbLevel: "Full Board",
    timeline: "2-3 months",
    description: "Real-time risk scoring without clinical intervention to assess accuracy",
    recommended: false
  },
  {
    type: "Interventional Trial",
    irbLevel: "Full Board + DSMB",
    timeline: "3-6 months",
    description: "Clinical alerts with measured impact on nurse-sensitive outcomes",
    recommended: false
  }
];

export function InvestigatorResources() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <FlaskConical className="w-5 h-5 text-primary" aria-hidden="true" />
          <CardTitle>Investigator Resources</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Guidance for researchers interested in clinical validation studies
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* IRB Pathway */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" />
            IRB Approval Pathway
          </h3>
          <div className="grid gap-3">
            {irbSteps.map((item) => (
              <div 
                key={item.step}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium">{item.title}</h4>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.timeline}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Types */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary" />
            Study Design Options
          </h3>
          <div className="grid gap-2">
            {studyTypes.map((study) => (
              <div 
                key={study.type}
                className={`p-3 rounded-lg border ${
                  study.recommended 
                    ? 'bg-risk-low/5 border-risk-low/30' 
                    : 'bg-secondary/30 border-border/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium">{study.type}</h4>
                    {study.recommended && (
                      <Badge variant="outline" className="bg-risk-low/10 border-risk-low/30 text-risk-low text-[10px]">
                        Recommended Start
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    {study.timeline}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{study.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <AlertCircle className="w-3 h-3" />
                  IRB Level: {study.irbLevel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Requirements */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Collaboration Requirements
          </h3>
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <ul className="space-y-2">
              {collaborationRequirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-risk-low shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold mb-1">Research Partnership Inquiries</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Interested in collaborating on clinical validation studies? Contact us to discuss 
                partnership opportunities, data sharing agreements, and co-investigator arrangements.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="mailto:alexis.collier@ung.edu">
                    <Mail className="w-4 h-4 mr-2" />
                    Academic Inquiries
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="mailto:info@alexiscollier.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Licensing & Partnerships
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-muted-foreground text-center">
          All research collaborations require executed Data Use Agreements and IRB approval 
          prior to data access. Technology protected by 5 U.S. patent applications.
        </p>
      </CardContent>
    </Card>
  );
}

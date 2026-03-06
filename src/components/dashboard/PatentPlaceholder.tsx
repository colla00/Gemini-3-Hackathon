import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PatentPlaceholderProps {
  number: number;
  title: string;
  acronym: string;
  description: string;
  innovations: string[];
  filingDate: string;
}

export const PatentPlaceholder = ({
  number,
  title,
  acronym,
  description,
  innovations,
  filingDate,
}: PatentPlaceholderProps) => (
  <div className="space-y-6">
    <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent">
      <CardHeader>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline" className="text-[10px] font-bold">
            Patent #{number}
          </Badge>
          <Badge className="bg-muted text-muted-foreground border-border/40 text-[10px] gap-1">
            <Clock className="h-2.5 w-2.5" /> Design Phase
          </Badge>
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            Filed {filingDate}
          </Badge>
        </div>
        <CardTitle className="text-xl mt-2">{title}</CardTitle>
        <p className="text-xs text-muted-foreground font-mono">{acronym}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Core Innovations</p>
          <ul className="space-y-1.5">
            {innovations.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <FileText className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Status:</strong> This patent application has been filed. 
            Interactive demonstration modules are under development. Detailed claims available under NDA.
          </p>
          <Button variant="outline" size="sm" className="mt-3" asChild>
            <a href="mailto:info@vitasignal.ai">
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Request Details
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

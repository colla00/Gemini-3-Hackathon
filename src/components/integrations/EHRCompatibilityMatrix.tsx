import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CheckCircle2, Clock, AlertCircle, Search, Building2, ExternalLink,
  Shield, Zap, FileCode2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EHRVendor {
  name: string;
  marketShare: string;
  fhirR4: 'ready' | 'in-progress' | 'planned';
  smartOnFhir: 'ready' | 'in-progress' | 'planned';
  cdsHooks: 'ready' | 'in-progress' | 'planned';
  bulkExport: 'ready' | 'in-progress' | 'planned';
  marketplace: string | null;
  certificationDate: string | null;
  notes: string;
}

const ehrVendors: EHRVendor[] = [
  {
    name: 'Epic',
    marketShare: '38%',
    fhirR4: 'ready',
    smartOnFhir: 'ready',
    cdsHooks: 'in-progress',
    bulkExport: 'ready',
    marketplace: 'App Orchard',
    certificationDate: null,
    notes: 'Planned integration with MyChart, Hyperspace, and Beaker modules via FHIR R4',
  },
  {
    name: 'Oracle Health (Cerner)',
    marketShare: '25%',
    fhirR4: 'ready',
    smartOnFhir: 'in-progress',
    cdsHooks: 'in-progress',
    bulkExport: 'in-progress',
    marketplace: 'CODE Program',
    certificationDate: null,
    notes: 'Millennium and Oracle Cloud Health integration paths planned',
  },
  {
    name: 'MEDITECH',
    marketShare: '16%',
    fhirR4: 'in-progress',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: null,
    certificationDate: null,
    notes: 'Expanse platform targeted; legacy systems via adapter layer',
  },
  {
    name: 'Allscripts / Veradigm',
    marketShare: '5%',
    fhirR4: 'in-progress',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: 'Open API',
    certificationDate: null,
    notes: 'TouchWorks and Sunrise via REST APIs (planned)',
  },
  {
    name: 'athenahealth',
    marketShare: '4%',
    fhirR4: 'planned',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: 'Marketplace',
    certificationDate: null,
    notes: 'Cloud-native integration planned; ambulatory focus',
  },
  {
    name: 'eClinicalWorks',
    marketShare: '3%',
    fhirR4: 'planned',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: null,
    certificationDate: null,
    notes: 'V12 FHIR R4 support targeted for future integration',
  },
  {
    name: 'NextGen Healthcare',
    marketShare: '2%',
    fhirR4: 'planned',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: 'Partner Portal',
    certificationDate: null,
    notes: 'Enterprise and Office platforms on roadmap',
  },
  {
    name: 'Evident (CPSI)',
    marketShare: '2%',
    fhirR4: 'planned',
    smartOnFhir: 'planned',
    cdsHooks: 'planned',
    bulkExport: 'planned',
    marketplace: null,
    certificationDate: null,
    notes: 'Thrive EHR community hospital focus (roadmap)',
  },
];

export const EHRCompatibilityMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<EHRVendor | null>(null);

  const filteredVendors = ehrVendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: 'ready' | 'in-progress' | 'planned') => {
    switch (status) {
      case 'ready':
        return (
          <Tooltip>
            <TooltipTrigger>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </TooltipTrigger>
            <TooltipContent>Integration Design Ready (Not Yet Certified)</TooltipContent>
          </Tooltip>
        );
      case 'in-progress':
        return (
          <Tooltip>
            <TooltipTrigger>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            </TooltipTrigger>
            <TooltipContent>Integration In Development</TooltipContent>
          </Tooltip>
        );
      case 'planned':
        return (
          <Tooltip>
            <TooltipTrigger>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>Planned for Future Release</TooltipContent>
          </Tooltip>
        );
    }
  };

  const readyCount = ehrVendors.filter(v => v.fhirR4 === 'ready').length;
  const totalMarketCoverage = ehrVendors
    .filter(v => v.fhirR4 !== 'planned')
    .reduce((sum, v) => sum + parseInt(v.marketShare), 0);

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              EHR Compatibility Matrix
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Planned integration roadmap across major EHR platforms (pre-market)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search EHR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-48 h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-2xl font-bold text-green-600">{readyCount}</p>
            <p className="text-xs text-muted-foreground">Design Ready</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-2xl font-bold text-primary">{totalMarketCoverage}%</p>
            <p className="text-xs text-muted-foreground">Market Coverage</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-2xl font-bold text-accent">{ehrVendors.length}</p>
            <p className="text-xs text-muted-foreground">Total Platforms</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="font-semibold">EHR Vendor</TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      <FileCode2 className="w-3.5 h-3.5" /> FHIR R4
                    </TooltipTrigger>
                    <TooltipContent>HL7 FHIR R4 API Support</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      <Shield className="w-3.5 h-3.5" /> SMART
                    </TooltipTrigger>
                    <TooltipContent>SMART on FHIR Launch</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center hidden md:table-cell">
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 mx-auto">
                      <Zap className="w-3.5 h-3.5" /> CDS
                    </TooltipTrigger>
                    <TooltipContent>CDS Hooks Integration</TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="text-center hidden lg:table-cell">Marketplace</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow 
                  key={vendor.name}
                  className={cn(
                    "cursor-pointer hover:bg-primary/5 transition-colors",
                    selectedVendor?.name === vendor.name && "bg-primary/10"
                  )}
                  onClick={() => setSelectedVendor(selectedVendor?.name === vendor.name ? null : vendor)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{vendor.name}</p>
                      <p className="text-xs text-muted-foreground">{vendor.marketShare} market share</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getStatusIcon(vendor.fhirR4)}</TableCell>
                  <TableCell className="text-center">{getStatusIcon(vendor.smartOnFhir)}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{getStatusIcon(vendor.cdsHooks)}</TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    {vendor.marketplace ? (
                      <Badge variant="outline" className="text-[10px]">
                        {vendor.marketplace}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-xs">Direct</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Detail panel */}
        {selectedVendor && (
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{selectedVendor.name}</h4>
                {selectedVendor.certificationDate && (
                  <p className="text-xs text-muted-foreground">
                    Certified: {selectedVendor.certificationDate}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/contact" className="flex items-center gap-1">
                  Request Demo <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selectedVendor.notes}</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Certified
          </span>
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-yellow-500" /> Supported
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Planned
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

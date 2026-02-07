import { useState, useMemo } from 'react';
import { Search, Filter, FileText, Check, ChevronDown, ChevronUp, ExternalLink, Hash, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { PATENT_CLAIMS, CATEGORY_CONFIG, PATENT_METADATA, getClaimsByPatent } from '@/data/patentClaims';
import { PATENT_PORTFOLIO } from '@/constants/patent';
import type { PatentClaim, ClaimCategory, PatentId } from '@/types/patent';

interface PatentClaimsExplorerProps {
  className?: string;
  compact?: boolean;
}

const STATUS_CONFIG = {
  demonstrated: { label: 'Demonstrated', color: 'bg-risk-low/20 text-risk-low border-risk-low/30' },
  implemented: { label: 'Implemented', color: 'bg-primary/20 text-primary border-primary/30' },
  prototype: { label: 'Prototype', color: 'bg-warning/20 text-warning border-warning/30' },
};

export const PatentClaimsExplorer = ({ className, compact = false }: PatentClaimsExplorerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatent, setSelectedPatent] = useState<PatentId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<ClaimCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set());
  const [groupByPatent, setGroupByPatent] = useState(true);

  // Filter claims based on search and filters
  const filteredClaims = useMemo(() => {
    return PATENT_CLAIMS.filter(claim => {
      const matchesSearch = searchQuery === '' || 
        claim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.implementation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPatent = selectedPatent === 'all' || claim.patentId === selectedPatent;
      const matchesCategory = selectedCategory === 'all' || claim.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || claim.status === selectedStatus;
      
      return matchesSearch && matchesPatent && matchesCategory && matchesStatus;
    });
  }, [searchQuery, selectedPatent, selectedCategory, selectedStatus]);

  // Group claims by patent
  const groupedClaims = useMemo(() => {
    if (!groupByPatent) return { all: filteredClaims };
    
    return filteredClaims.reduce((acc, claim) => {
      const key = claim.patentId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(claim);
      return acc;
    }, {} as Record<string, PatentClaim[]>);
  }, [filteredClaims, groupByPatent]);

  // Get unique categories from current claims
  const availableCategories = useMemo(() => {
    const categories = new Set(PATENT_CLAIMS.map(c => c.category));
    return Array.from(categories);
  }, []);

  const toggleClaim = (claimKey: string) => {
    setExpandedClaims(prev => {
      const next = new Set(prev);
      if (next.has(claimKey)) {
        next.delete(claimKey);
      } else {
        next.add(claimKey);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedClaims(new Set(filteredClaims.map(c => `${c.patentId}-${c.number}`)));
  };

  const collapseAll = () => {
    setExpandedClaims(new Set());
  };

  const renderClaimCard = (claim: PatentClaim, index: number) => {
    const claimKey = `${claim.patentId}-${claim.number}`;
    const isExpanded = expandedClaims.has(claimKey);
    const categoryConfig = CATEGORY_CONFIG[claim.category];
    const CategoryIcon = categoryConfig.icon;
    const statusConfig = STATUS_CONFIG[claim.status];

    return (
      <motion.div
        key={claimKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <Collapsible open={isExpanded} onOpenChange={() => toggleClaim(claimKey)}>
          <CollapsibleTrigger className="w-full">
            <div className={cn(
              "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
              isExpanded
                ? "bg-primary/5 border-primary/30"
                : "bg-card hover:bg-secondary/30 border-border/40 hover:border-primary/20"
            )}>
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-foreground">{claim.number}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">{claim.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={cn("text-[9px]", categoryConfig.color)}>
                    <CategoryIcon className="w-2.5 h-2.5 mr-1" />
                    {categoryConfig.label}
                  </Badge>
                  <Badge variant="outline" className={cn("text-[9px]", statusConfig.color)}>
                    <Check className="w-2.5 h-2.5 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
              </div>
              
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-11 mt-2 p-3 bg-secondary/20 rounded-lg border border-border/30 space-y-3"
            >
              <div>
                <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Description</h5>
                <p className="text-xs text-foreground leading-relaxed">{claim.description}</p>
              </div>
              
              <div>
                <h5 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Implementation</h5>
                <p className="text-xs text-foreground leading-relaxed">{claim.implementation}</p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <code className="bg-secondary/50 px-1.5 py-0.5 rounded">{claim.componentPath}</code>
                </div>
                {claim.demoSection && (
                  <Badge variant="secondary" className="text-[9px]">
                    Demo: {claim.demoSection}
                  </Badge>
                )}
              </div>
            </motion.div>
          </CollapsibleContent>
        </Collapsible>
      </motion.div>
    );
  };

  if (compact) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Patent Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{PATENT_CLAIMS.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Claims Across 5 Patents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-border/40", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Patent Claims Explorer</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {PATENT_CLAIMS.length} claims across {Object.keys(PATENT_METADATA).length} patent applications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={groupByPatent ? "default" : "outline"}
              onClick={() => setGroupByPatent(!groupByPatent)}
              className="h-7 text-xs"
            >
              <Layers className="w-3 h-3 mr-1" />
              {groupByPatent ? 'Grouped' : 'Flat'}
            </Button>
            <Button size="sm" variant="outline" onClick={expandAll} className="h-7 text-xs">
              Expand All
            </Button>
            <Button size="sm" variant="outline" onClick={collapseAll} className="h-7 text-xs">
              Collapse
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          
          <Select value={selectedPatent} onValueChange={(v) => setSelectedPatent(v as PatentId | 'all')}>
            <SelectTrigger className="w-full sm:w-48 h-9">
              <SelectValue placeholder="Filter by patent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patents</SelectItem>
              {Object.entries(PATENT_METADATA).map(([id, meta]) => (
                <SelectItem key={id} value={id}>
                  <span className="flex items-center gap-2">
                    <Hash className="w-3 h-3" />
                    {meta.shortName}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as ClaimCategory | 'all')}>
            <SelectTrigger className="w-full sm:w-44 h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => {
                const config = CATEGORY_CONFIG[cat];
                const Icon = config.icon;
                return (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-36 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/30">
          <span className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredClaims.length}</span> of {PATENT_CLAIMS.length} claims
          </span>
          {searchQuery && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setSearchQuery('')}
              className="h-6 text-xs"
            >
              Clear search
            </Button>
          )}
        </div>

        <ScrollArea className="h-[500px] pr-4">
          {groupByPatent ? (
            <div className="space-y-6">
              {Object.entries(groupedClaims).map(([patentId, claims]) => {
                if (claims.length === 0) return null;
                const meta = PATENT_METADATA[patentId as PatentId];
                const patent = PATENT_PORTFOLIO.find(p => p.id === patentId);
                
                return (
                  <div key={patentId}>
                    <div className="flex items-center gap-3 mb-3 pb-2 border-b border-border/30">
                      <div className="p-1.5 rounded bg-accent/20">
                        <Hash className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground">{meta?.shortName}</h3>
                        <p className="text-[10px] text-muted-foreground">
                          {meta?.shortName} · {claims.length} claims
                        </p>
                      </div>
                      {patent?.status === 'filed' && (
                        <Badge variant="outline" className="text-[9px] bg-risk-low/10 text-risk-low border-risk-low/30">
                          Filed
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 ml-2">
                      {claims.map((claim, idx) => renderClaimCard(claim, idx))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClaims.map((claim, idx) => renderClaimCard(claim, idx))}
            </div>
          )}

          {filteredClaims.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-10 h-10 text-muted-foreground/50 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No claims found</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

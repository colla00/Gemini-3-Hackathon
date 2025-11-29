import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { RiskLevel, RiskType } from '@/data/patients';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  riskLevelFilter: RiskLevel | 'ALL';
  onRiskLevelChange: (value: RiskLevel | 'ALL') => void;
  riskTypeFilter: RiskType | 'ALL';
  onRiskTypeChange: (value: RiskType | 'ALL') => void;
  sortBy: 'riskScore' | 'lastUpdated' | 'id';
  onSortChange: (value: 'riskScore' | 'lastUpdated' | 'id') => void;
}

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  riskLevelFilter,
  onRiskLevelChange,
  riskTypeFilter,
  onRiskTypeChange,
  sortBy,
  onSortChange,
}: FilterBarProps) => {
  const hasActiveFilters = riskLevelFilter !== 'ALL' || riskTypeFilter !== 'ALL' || searchQuery !== '';

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/30 p-4 mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search patient ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "pl-10 bg-secondary/50 border-border/50 text-sm h-9",
              "placeholder:text-muted-foreground/60",
              "focus:border-primary/50 focus:ring-1 focus:ring-primary/30",
              searchQuery && "border-primary/50"
            )}
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Filter</span>
          </div>

          {/* Risk Level Filter */}
          <Select value={riskLevelFilter} onValueChange={onRiskLevelChange}>
            <SelectTrigger 
              className={cn(
                "w-28 h-9 text-xs bg-secondary/50 border-border/50",
                riskLevelFilter !== 'ALL' && "border-primary/50 text-primary"
              )}
            >
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="HIGH">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-risk-high" />
                  High
                </span>
              </SelectItem>
              <SelectItem value="MEDIUM">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-risk-medium" />
                  Medium
                </span>
              </SelectItem>
              <SelectItem value="LOW">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-risk-low" />
                  Low
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Risk Type Filter */}
          <Select value={riskTypeFilter} onValueChange={onRiskTypeChange}>
            <SelectTrigger 
              className={cn(
                "w-36 h-9 text-xs bg-secondary/50 border-border/50",
                riskTypeFilter !== 'ALL' && "border-primary/50 text-primary"
              )}
            >
              <SelectValue placeholder="Risk Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="Falls">Falls</SelectItem>
              <SelectItem value="Pressure Injury">Pressure Injury</SelectItem>
              <SelectItem value="Device Complication">Device</SelectItem>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="w-px h-6 bg-border/50 mx-1 hidden md:block" />

          {/* Sort */}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Sort</span>
          </div>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-32 h-9 text-xs bg-secondary/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="riskScore">Risk Score</SelectItem>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
              <SelectItem value="id">Patient ID</SelectItem>
            </SelectContent>
          </Select>

          {/* Active Filter Indicator */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                onSearchChange('');
                onRiskLevelChange('ALL');
                onRiskTypeChange('ALL');
              }}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors ml-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

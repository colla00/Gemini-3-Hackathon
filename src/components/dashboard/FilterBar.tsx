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
  return (
    <div className="bg-card rounded-xl border border-border/50 p-4 mb-6 shadow-card animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by Patient ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border focus:border-primary"
          />
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select
            value={riskLevelFilter}
            onValueChange={(value) => onRiskLevelChange(value as RiskLevel | 'ALL')}
          >
            <SelectTrigger className="w-[140px] bg-secondary border-border">
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
        </div>

        {/* Risk Type Filter */}
        <Select
          value={riskTypeFilter}
          onValueChange={(value) => onRiskTypeChange(value as RiskType | 'ALL')}
        >
          <SelectTrigger className="w-[180px] bg-secondary border-border">
            <SelectValue placeholder="Risk Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="Falls">Falls</SelectItem>
            <SelectItem value="Pressure Injury">Pressure Injury</SelectItem>
            <SelectItem value="Device Complication">Device Complication</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as 'riskScore' | 'lastUpdated' | 'id')}
          >
            <SelectTrigger className="w-[150px] bg-secondary border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="riskScore">Risk Score</SelectItem>
              <SelectItem value="lastUpdated">Last Updated</SelectItem>
              <SelectItem value="id">Patient ID</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

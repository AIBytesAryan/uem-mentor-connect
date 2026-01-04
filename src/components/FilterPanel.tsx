import React from 'react';
import { Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

export interface FilterState {
  domain: string;
  helpTypes: string[];
  availability: string;
  showFavoritesOnly: boolean;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const DOMAINS = [
  'All Domains',
  'AI/ML',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Data Science',
];

const HELP_TYPES = [
  { id: 'internship', label: 'Internship Guidance' },
  { id: 'placement', label: 'Placement Guidance' },
  { id: 'project', label: 'Project Help' },
  { id: 'dsa', label: 'DSA / Core Subjects' },
  { id: 'career', label: 'Career Guidance' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active Only' },
  { value: 'limited', label: 'Limited' },
];

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const handleDomainChange = (value: string) => {
    onFilterChange({ ...filters, domain: value });
  };

  const handleHelpTypeToggle = (helpType: string) => {
    const newHelpTypes = filters.helpTypes.includes(helpType)
      ? filters.helpTypes.filter(t => t !== helpType)
      : [...filters.helpTypes, helpType];
    onFilterChange({ ...filters, helpTypes: newHelpTypes });
  };

  const handleAvailabilityChange = (value: string) => {
    onFilterChange({ ...filters, availability: value });
  };

  const handleFavoritesToggle = () => {
    onFilterChange({ ...filters, showFavoritesOnly: !filters.showFavoritesOnly });
  };

  const clearFilters = () => {
    onFilterChange({
      domain: 'All Domains',
      helpTypes: [],
      availability: 'all',
      showFavoritesOnly: false,
    });
  };

  const hasActiveFilters = 
    filters.domain !== 'All Domains' || 
    filters.helpTypes.length > 0 || 
    filters.availability !== 'all' ||
    filters.showFavoritesOnly;

  return (
    <div className="filter-panel space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Filters</h2>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Clear all
          </Button>
        )}
      </div>

      {/* Favorites Toggle */}
      <Button
        variant={filters.showFavoritesOnly ? "default" : "outline"}
        size="sm"
        className="w-full justify-start gap-2"
        onClick={handleFavoritesToggle}
      >
        <Star className={`w-4 h-4 ${filters.showFavoritesOnly ? 'fill-current' : ''}`} />
        My Favorites
      </Button>

      {/* Domain Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Domain</Label>
        <RadioGroup value={filters.domain} onValueChange={handleDomainChange}>
          {DOMAINS.map(domain => (
            <div key={domain} className="flex items-center space-x-2">
              <RadioGroupItem value={domain} id={domain} />
              <Label htmlFor={domain} className="text-sm font-normal cursor-pointer">
                {domain}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Help Type Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Help Type</Label>
        <div className="space-y-2">
          {HELP_TYPES.map(type => (
            <div key={type.id} className="flex items-center space-x-2">
              <Checkbox
                id={type.id}
                checked={filters.helpTypes.includes(type.id)}
                onCheckedChange={() => handleHelpTypeToggle(type.id)}
              />
              <Label htmlFor={type.id} className="text-sm font-normal cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Availability</Label>
        <RadioGroup value={filters.availability} onValueChange={handleAvailabilityChange}>
          {AVAILABILITY_OPTIONS.map(option => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`avail-${option.value}`} />
              <Label htmlFor={`avail-${option.value}`} className="text-sm font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

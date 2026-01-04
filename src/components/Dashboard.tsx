import React, { useState, useMemo, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Header } from './Header';
import { FilterPanel, FilterState } from './FilterPanel';
import { MentorGrid } from './MentorGrid';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { db, SeniorProfile } from '@/lib/firebase';

interface DashboardProps {
  isBlurred?: boolean;
  onBecomeAMentor: () => void;
  onViewProfile: () => void;
}

export function Dashboard({ isBlurred = false, onBecomeAMentor, onViewProfile }: DashboardProps) {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<SeniorProfile[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    domain: 'All Domains',
    helpTypes: [],
    availability: 'all',
    showFavoritesOnly: false,
  });

  useEffect(() => {
    const allMentors = db.getSeniors();
    // Filter out unavailable mentors by default
    const availableMentors = allMentors.filter(m => m.availabilityStatus !== 'not_available');
    setMentors(availableMentors);
    
    if (user) {
      setFavorites(db.getFavorites(user.uid));
    }
  }, [user]);

  const filteredMentors = useMemo(() => {
    let result = [...mentors];
    
    // Filter by favorites
    if (filters.showFavoritesOnly) {
      result = result.filter(m => favorites.includes(m.id));
    }
    
    // Filter by domain
    if (filters.domain !== 'All Domains') {
      result = result.filter(m => 
        m.primaryDomain === filters.domain || m.secondaryDomain === filters.domain
      );
    }
    
    // Filter by help types
    if (filters.helpTypes.length > 0) {
      result = result.filter(m => 
        filters.helpTypes.some(type => m.mentorIntent.includes(type))
      );
    }
    
    // Filter by availability
    if (filters.availability !== 'all') {
      result = result.filter(m => m.availabilityStatus === filters.availability);
    }
    
    // Sort by priority score (descending)
    result.sort((a, b) => b.priorityScore - a.priorityScore);
    
    return result;
  }, [mentors, filters, favorites]);

  const handleToggleFavorite = (mentorId: string) => {
    if (!user) return;
    
    if (favorites.includes(mentorId)) {
      db.removeFavorite(user.uid, mentorId);
      setFavorites(prev => prev.filter(id => id !== mentorId));
    } else {
      db.addFavorite(user.uid, mentorId);
      setFavorites(prev => [...prev, mentorId]);
    }
  };

  const handleShowFavorites = () => {
    setFilters(prev => ({ ...prev, showFavoritesOnly: true }));
  };

  return (
    <div className={`min-h-screen bg-background transition-all duration-300 ${isBlurred ? 'blur-sm pointer-events-none select-none' : ''}`}>
      <Header 
        onShowFavorites={handleShowFavorites}
        onBecomeAMentor={onBecomeAMentor}
        onViewProfile={onViewProfile}
      />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Panel - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Filter Panel - Mobile */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-20 bg-background/80 backdrop-blur-sm">
              <div className="absolute top-20 left-4 right-4 bottom-20 flex flex-col">
                <div className="flex-1 overflow-auto">
                  <FilterPanel filters={filters} onFilterChange={setFilters} />
                </div>
                <Button
                  className="w-full mt-4 flex-shrink-0"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {filters.showFavoritesOnly ? 'My Favorite Mentors' : 'Available Mentors'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <Menu className="w-4 h-4" />
                Filters
              </Button>
            </div>
            
            <MentorGrid 
              mentors={filteredMentors}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

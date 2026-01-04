import React from 'react';
import { Users } from 'lucide-react';
import { MentorCard } from './MentorCard';
import { SeniorProfile } from '@/lib/firebase';

interface MentorGridProps {
  mentors: SeniorProfile[];
  favorites: string[];
  onToggleFavorite: (mentorId: string) => void;
}

export function MentorGrid({ mentors, favorites, onToggleFavorite }: MentorGridProps) {
  if (mentors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No mentors found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          Try adjusting your filters to see more mentors, or check back later for new additions.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mentors.map((mentor, index) => (
        <div 
          key={mentor.id} 
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <MentorCard
            mentor={mentor}
            isFavorite={favorites.includes(mentor.id)}
            onToggleFavorite={() => onToggleFavorite(mentor.id)}
          />
        </div>
      ))}
    </div>
  );
}

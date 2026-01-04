import React from 'react';
import { Star, Linkedin, Briefcase, GraduationCap, Code } from 'lucide-react';
import { SeniorProfile } from '@/lib/firebase';

interface MentorCardProps {
  mentor: SeniorProfile;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const INTENT_LABELS: Record<string, string> = {
  internship: 'Internship',
  placement: 'Placement',
  project: 'Projects',
  dsa: 'DSA',
  career: 'Career',
};

export function MentorCard({ mentor, isFavorite, onToggleFavorite }: MentorCardProps) {
  const getAvailabilityBadge = () => {
    switch (mentor.availabilityStatus) {
      case 'active':
        return <span className="badge-status badge-active">Active</span>;
      case 'limited':
        return <span className="badge-status badge-limited">Limited</span>;
      default:
        return null;
    }
  };

  const getExperienceBadges = () => {
    const badges = [];
    
    if (mentor.placementStatus === 'placed') {
      badges.push(
        <span key="placed" className="badge-status badge-placed flex items-center gap-1">
          <Briefcase className="w-3 h-3" /> Placed
        </span>
      );
    }
    
    if (mentor.internshipStatus === 'completed') {
      badges.push(
        <span key="intern" className="badge-status bg-purple-100 text-purple-700 flex items-center gap-1">
          <GraduationCap className="w-3 h-3" /> Intern
        </span>
      );
    }
    
    if (mentor.projectExperience === 'advanced') {
      badges.push(
        <span key="projects" className="badge-status bg-blue-100 text-blue-700 flex items-center gap-1">
          <Code className="w-3 h-3" /> 3+ Projects
        </span>
      );
    }
    
    return badges;
  };

  return (
    <div className="card-mentor relative">
      {/* Favorite Star */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-4 right-4 p-1 hover:scale-110 transition-transform"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star 
          className={`w-5 h-5 transition-colors ${
            isFavorite 
              ? 'text-amber-400 fill-amber-400' 
              : 'text-muted-foreground hover:text-amber-400'
          }`} 
        />
      </button>

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground pr-8">{mentor.name}</h3>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="badge-domain">{mentor.primaryDomain}</span>
          {mentor.secondaryDomain && (
            <span className="badge-domain opacity-80">{mentor.secondaryDomain}</span>
          )}
          {getAvailabilityBadge()}
        </div>
      </div>

      {/* Experience Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {getExperienceBadges()}
      </div>

      {/* Bio */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {mentor.bio}
      </p>

      {/* Mentor Intent Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {mentor.mentorIntent.map(intent => (
          <span 
            key={intent}
            className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
          >
            {INTENT_LABELS[intent] || intent}
          </span>
        ))}
      </div>

      {/* LinkedIn Button */}
      <a
        href={mentor.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-linkedin w-full justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Linkedin className="w-4 h-4" />
        Connect on LinkedIn
      </a>
    </div>
  );
}

import React from 'react';
import { UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleOnboardingModalProps {
  onSelectSenior: () => void;
  onSelectJunior: () => void;
}

export function RoleOnboardingModal({ onSelectSenior, onSelectJunior }: RoleOnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl p-8 animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Welcome! Tell us about yourself</h2>
          <p className="text-muted-foreground mt-2">
            Are you a senior willing to mentor juniors?
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={onSelectSenior}
            className="group p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
              <UserCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Yes, I'm a Senior</h3>
            <p className="text-sm text-muted-foreground">
              I want to guide and mentor juniors with my experience
            </p>
          </button>

          <button
            onClick={onSelectJunior}
            className="group p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-accent transition-all text-left"
          >
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 transition-colors group-hover:bg-muted">
              <Users className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No, I'm a Junior</h3>
            <p className="text-sm text-muted-foreground">
              I'm looking for mentors to guide me
            </p>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          You can always become a mentor later from the dashboard
        </p>
      </div>
    </div>
  );
}

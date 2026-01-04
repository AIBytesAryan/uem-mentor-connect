import React from 'react';
import { GraduationCap, User, Star, UserPlus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onShowFavorites: () => void;
  onBecomeAMentor: () => void;
  onViewProfile: () => void;
}

export function Header({ onShowFavorites, onBecomeAMentor, onViewProfile }: HeaderProps) {
  const { user, seniorProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary">UEM Mentor Connect</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Find your senior mentor</p>
          </div>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onShowFavorites}>
                <Star className="w-4 h-4 mr-2" />
                My Favorites
              </DropdownMenuItem>
              {seniorProfile ? (
                <DropdownMenuItem onClick={onViewProfile}>
                  <User className="w-4 h-4 mr-2" />
                  My Mentor Profile
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={onBecomeAMentor}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Become a Mentor
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

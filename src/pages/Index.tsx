import React, { useState, useEffect } from 'react';
import { LoginModal } from '@/components/LoginModal';
import { RoleOnboardingModal } from '@/components/RoleOnboardingModal';
import { Dashboard } from '@/components/Dashboard';
import { SeniorRegistrationForm } from '@/components/SeniorRegistrationForm';
import { useAuth } from '@/contexts/AuthContext';
import { initializeDemoData } from '@/lib/firebase';

type View = 'dashboard' | 'registration';

const Index = () => {
  const { user, seniorProfile, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [hasSeenRoleModal, setHasSeenRoleModal] = useState(false);

  useEffect(() => {
    initializeDemoData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setShowLoginModal(true);
      } else {
        setShowLoginModal(false);
        // Show role modal only if user is logged in, not a senior, and hasn't seen the modal
        if (!seniorProfile && !hasSeenRoleModal) {
          setShowRoleModal(true);
        }
      }
    }
  }, [user, seniorProfile, isLoading, hasSeenRoleModal]);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Role modal will be triggered by useEffect if needed
  };

  const handleSelectSenior = () => {
    setShowRoleModal(false);
    setHasSeenRoleModal(true);
    setCurrentView('registration');
  };

  const handleSelectJunior = () => {
    setShowRoleModal(false);
    setHasSeenRoleModal(true);
  };

  const handleBecomeAMentor = () => {
    setCurrentView('registration');
  };

  const handleRegistrationBack = () => {
    setCurrentView('dashboard');
  };

  const handleRegistrationSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleViewProfile = () => {
    // For now, just show registration form - could be extended to view/edit profile
    setCurrentView('registration');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentView === 'registration' && user) {
    return (
      <SeniorRegistrationForm 
        onBack={handleRegistrationBack}
        onSuccess={handleRegistrationSuccess}
      />
    );
  }

  return (
    <>
      <Dashboard 
        isBlurred={showLoginModal || showRoleModal}
        onBecomeAMentor={handleBecomeAMentor}
        onViewProfile={handleViewProfile}
      />
      
      {showLoginModal && (
        <LoginModal onSuccess={handleLoginSuccess} />
      )}
      
      {showRoleModal && (
        <RoleOnboardingModal 
          onSelectSenior={handleSelectSenior}
          onSelectJunior={handleSelectJunior}
        />
      )}
    </>
  );
};

export default Index;

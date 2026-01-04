import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { db, calculatePriorityScore, SeniorProfile } from '@/lib/firebase';

interface SeniorRegistrationFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const DOMAINS = [
  'AI/ML',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Data Science',
];

const PLACEMENT_OPTIONS = [
  { value: 'placed', label: 'Placed / PPO' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'not_placed', label: 'Not placed yet' },
];

const INTERNSHIP_OPTIONS = [
  { value: 'completed', label: 'Internship completed' },
  { value: 'ongoing', label: 'Internship ongoing' },
  { value: 'none', label: 'No internship' },
];

const PROJECT_OPTIONS = [
  { value: 'advanced', label: '3+ strong projects' },
  { value: 'intermediate', label: '1-2 projects' },
  { value: 'beginner', label: 'Beginner level' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'active', label: 'Actively available' },
  { value: 'limited', label: 'Limited availability' },
  { value: 'not_available', label: 'Not available' },
];

const MENTOR_INTENTS = [
  { id: 'internship', label: 'Internship guidance' },
  { id: 'placement', label: 'Placement guidance' },
  { id: 'project', label: 'Project help' },
  { id: 'dsa', label: 'DSA / Core subjects' },
  { id: 'career', label: 'Career guidance' },
];

export function SeniorRegistrationForm({ onBack, onSuccess }: SeniorRegistrationFormProps) {
  const { user, refreshSeniorProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    primaryDomain: '',
    secondaryDomain: '',
    linkedinUrl: '',
    placementStatus: '' as SeniorProfile['placementStatus'] | '',
    internshipStatus: '' as SeniorProfile['internshipStatus'] | '',
    projectExperience: '' as SeniorProfile['projectExperience'] | '',
    availabilityStatus: '' as SeniorProfile['availabilityStatus'] | '',
    mentorIntent: [] as string[],
    bio: '',
  });

  const handleIntentToggle = (intentId: string) => {
    setFormData(prev => ({
      ...prev,
      mentorIntent: prev.mentorIntent.includes(intentId)
        ? prev.mentorIntent.filter(i => i !== intentId)
        : [...prev.mentorIntent, intentId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    
    const priorityScore = calculatePriorityScore({
      placementStatus: formData.placementStatus as SeniorProfile['placementStatus'],
      internshipStatus: formData.internshipStatus as SeniorProfile['internshipStatus'],
      projectExperience: formData.projectExperience as SeniorProfile['projectExperience'],
      availabilityStatus: formData.availabilityStatus as SeniorProfile['availabilityStatus'],
    });
    
    db.addSenior({
      userId: user.uid,
      name: formData.name,
      email: user.email,
      primaryDomain: formData.primaryDomain,
      secondaryDomain: formData.secondaryDomain || undefined,
      linkedinUrl: formData.linkedinUrl,
      placementStatus: formData.placementStatus as SeniorProfile['placementStatus'],
      internshipStatus: formData.internshipStatus as SeniorProfile['internshipStatus'],
      projectExperience: formData.projectExperience as SeniorProfile['projectExperience'],
      availabilityStatus: formData.availabilityStatus as SeniorProfile['availabilityStatus'],
      mentorIntent: formData.mentorIntent,
      bio: formData.bio,
      priorityScore,
    });
    
    refreshSeniorProfile();
    setShowSuccess(true);
    
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Created!</h2>
          <p className="text-muted-foreground">
            Your mentor profile is now live. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="bg-card rounded-2xl p-6 md:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-2">Create Your Mentor Profile</h1>
          <p className="text-muted-foreground mb-8">
            Help juniors by sharing your expertise and experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Domains */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Domain *</Label>
                <Select
                  value={formData.primaryDomain}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, primaryDomain: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map(domain => (
                      <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Secondary Domain</Label>
                <Select
                  value={formData.secondaryDomain}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, secondaryDomain: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.filter(d => d !== formData.primaryDomain).map(domain => (
                      <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL *</Label>
              <Input
                id="linkedin"
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                placeholder="https://linkedin.com/in/yourprofile"
                required
              />
            </div>

            {/* Status Dropdowns */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Placement Status *</Label>
                <Select
                  value={formData.placementStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, placementStatus: value as SeniorProfile['placementStatus'] }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLACEMENT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Internship Status *</Label>
                <Select
                  value={formData.internshipStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, internshipStatus: value as SeniorProfile['internshipStatus'] }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERNSHIP_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Project Experience *</Label>
                <Select
                  value={formData.projectExperience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, projectExperience: value as SeniorProfile['projectExperience'] }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Availability *</Label>
                <Select
                  value={formData.availabilityStatus}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, availabilityStatus: value as SeniorProfile['availabilityStatus'] }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mentor Intent */}
            <div className="space-y-3">
              <Label>What can you help with? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MENTOR_INTENTS.map(intent => (
                  <div key={intent.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={intent.id}
                      checked={formData.mentorIntent.includes(intent.id)}
                      onCheckedChange={() => handleIntentToggle(intent.id)}
                    />
                    <Label htmlFor={intent.id} className="text-sm font-normal cursor-pointer">
                      {intent.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Short Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value.slice(0, 200) }))}
                placeholder="Tell juniors about your experience and how you can help them..."
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.bio.length}/200 characters
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium"
              disabled={isSubmitting || formData.mentorIntent.length === 0}
            >
              {isSubmitting ? 'Creating Profile...' : 'Create Mentor Profile'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

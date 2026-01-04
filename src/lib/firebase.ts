// Firebase configuration
// Note: In production, these would come from environment variables
// For demo purposes, we're using localStorage to simulate Firebase

export const ALLOWED_EMAIL_DOMAINS = ["@uem.edu.in", "@iem.edu.in"];


export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface SeniorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  primaryDomain: string;
  secondaryDomain?: string;
  linkedinUrl: string;
  placementStatus: 'placed' | 'interviewing' | 'not_placed';
  internshipStatus: 'completed' | 'ongoing' | 'none';
  projectExperience: 'advanced' | 'intermediate' | 'beginner';
  availabilityStatus: 'active' | 'limited' | 'not_available';
  mentorIntent: string[];
  bio: string;
  priorityScore: number;
  createdAt: number;
}

export interface Favorite {
  id: string;
  userId: string;
  mentorId: string;
}

// Calculate priority score based on profile
export function calculatePriorityScore(profile: Partial<SeniorProfile>): number {
  let score = 0;
  
  // Placement status (highest weight)
  if (profile.placementStatus === 'placed') score += 40;
  else if (profile.placementStatus === 'interviewing') score += 25;
  else score += 10;
  
  // Internship status (medium weight)
  if (profile.internshipStatus === 'completed') score += 25;
  else if (profile.internshipStatus === 'ongoing') score += 15;
  else score += 5;
  
  // Project experience (lower weight)
  if (profile.projectExperience === 'advanced') score += 20;
  else if (profile.projectExperience === 'intermediate') score += 12;
  else score += 5;
  
  // Availability boosts score
  if (profile.availabilityStatus === 'active') score += 15;
  else if (profile.availabilityStatus === 'limited') score += 8;
  
  return score;
}

export function isValidEmailDomain(email: string): boolean {
  const lowerEmail = email.toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some(domain => lowerEmail.endsWith(domain));
}


// Local storage keys
const STORAGE_KEYS = {
  USER: 'uem_mentor_user',
  SENIORS: 'uem_mentor_seniors',
  FAVORITES: 'uem_mentor_favorites',
};

// Simulated Firebase Auth functions
export const auth = {
  currentUser: null as User | null,
  
  signInWithEmail: async (email: string): Promise<{ user: User } | { error: string }> => {
    if (!isValidEmailDomain(email)) {
      return { error: `Only ${ALLOWED_EMAIL_DOMAINS.join(' or ')} emails are allowed` };

    }
    
    const user: User = {
      uid: btoa(email),
      email: email,
      displayName: email.split('@')[0],
    };
    
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    auth.currentUser = user;
    
    return { user };
  },
  
  signOut: async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    auth.currentUser = null;
  },
  
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (stored) {
      const user = JSON.parse(stored);
      auth.currentUser = user;
      return user;
    }
    return null;
  },
};

// Simulated Firestore functions
export const db = {
  // Senior profiles
  getSeniors: (): SeniorProfile[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SENIORS);
    return stored ? JSON.parse(stored) : [];
  },
  
  getSeniorByUserId: (userId: string): SeniorProfile | null => {
    const seniors = db.getSeniors();
    return seniors.find(s => s.userId === userId) || null;
  },
  
  addSenior: (profile: Omit<SeniorProfile, 'id' | 'createdAt'>): SeniorProfile => {
    const seniors = db.getSeniors();
    const newProfile: SeniorProfile = {
      ...profile,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    seniors.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.SENIORS, JSON.stringify(seniors));
    return newProfile;
  },
  
  updateSenior: (id: string, updates: Partial<SeniorProfile>): void => {
    const seniors = db.getSeniors();
    const index = seniors.findIndex(s => s.id === id);
    if (index !== -1) {
      seniors[index] = { ...seniors[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.SENIORS, JSON.stringify(seniors));
    }
  },
  
  // Favorites
  getFavorites: (userId: string): string[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: Favorite[] = stored ? JSON.parse(stored) : [];
    return favorites.filter(f => f.userId === userId).map(f => f.mentorId);
  },
  
  addFavorite: (userId: string, mentorId: string): void => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: Favorite[] = stored ? JSON.parse(stored) : [];
    
    if (!favorites.some(f => f.userId === userId && f.mentorId === mentorId)) {
      favorites.push({
        id: crypto.randomUUID(),
        userId,
        mentorId,
      });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  },
  
  removeFavorite: (userId: string, mentorId: string): void => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const favorites: Favorite[] = stored ? JSON.parse(stored) : [];
    const filtered = favorites.filter(f => !(f.userId === userId && f.mentorId === mentorId));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  },
};

// Initialize with demo data if empty
export function initializeDemoData(): void {
  const seniors = db.getSeniors();
  if (seniors.length === 0) {
    const demoSeniors: Omit<SeniorProfile, 'id' | 'createdAt'>[] = [
      {
        userId: 'demo1',
        name: 'Arjun Sharma',
        email: 'arjun.sharma@uem.edu.in',
        primaryDomain: 'AI/ML',
        secondaryDomain: 'Data Science',
        linkedinUrl: 'https://linkedin.com/in/arjunsharma',
        placementStatus: 'placed',
        internshipStatus: 'completed',
        projectExperience: 'advanced',
        availabilityStatus: 'active',
        mentorIntent: ['placement', 'internship', 'project'],
        bio: 'Placed at Google. Love helping juniors crack FAANG interviews. Strong in ML and system design.',
        priorityScore: 100,
      },
      {
        userId: 'demo2',
        name: 'Priya Patel',
        email: 'priya.patel@uem.edu.in',
        primaryDomain: 'Web Development',
        linkedinUrl: 'https://linkedin.com/in/priyapatel',
        placementStatus: 'placed',
        internshipStatus: 'completed',
        projectExperience: 'advanced',
        availabilityStatus: 'active',
        mentorIntent: ['project', 'career', 'dsa'],
        bio: 'Full-stack developer at Microsoft. Expert in React, Node.js, and cloud technologies.',
        priorityScore: 95,
      },
      {
        userId: 'demo3',
        name: 'Rahul Verma',
        email: 'rahul.verma@uem.edu.in',
        primaryDomain: 'Cybersecurity',
        secondaryDomain: 'Web Development',
        linkedinUrl: 'https://linkedin.com/in/rahulverma',
        placementStatus: 'interviewing',
        internshipStatus: 'completed',
        projectExperience: 'intermediate',
        availabilityStatus: 'limited',
        mentorIntent: ['internship', 'project'],
        bio: 'Security researcher with CTF experience. Interned at Deloitte. Happy to guide on security basics.',
        priorityScore: 60,
      },
      {
        userId: 'demo4',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@uem.edu.in',
        primaryDomain: 'App Development',
        linkedinUrl: 'https://linkedin.com/in/snehagupta',
        placementStatus: 'placed',
        internshipStatus: 'ongoing',
        projectExperience: 'advanced',
        availabilityStatus: 'active',
        mentorIntent: ['placement', 'project', 'career'],
        bio: 'Mobile dev at Flipkart. Built 5+ production apps. Can help with React Native and Flutter.',
        priorityScore: 85,
      },
      {
        userId: 'demo5',
        name: 'Vikram Singh',
        email: 'vikram.singh@uem.edu.in',
        primaryDomain: 'Data Science',
        secondaryDomain: 'AI/ML',
        linkedinUrl: 'https://linkedin.com/in/vikramsingh',
        placementStatus: 'placed',
        internshipStatus: 'completed',
        projectExperience: 'advanced',
        availabilityStatus: 'limited',
        mentorIntent: ['dsa', 'placement', 'internship'],
        bio: 'Data Scientist at Amazon. Strong in statistics and ML. Can help with interview prep.',
        priorityScore: 88,
      },
    ];
    
    demoSeniors.forEach(senior => db.addSenior(senior));
  }
}


// Core types for the SchoolPortal platform
export interface User {
  id?: string;
  uid?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  verified?: boolean;
  roles?: string[];
  permissions?: string[];
  schoolId?: string;
  userType?: 'admin' | 'teacher' | 'student' | 'parent';
  status?: 'pending' | 'approved' | 'suspended';
  createdAt?: string;
  updatedAt?: string;
}

export interface School {
  id: string;
  uid: string;
  name: string;
  slug: string;
  ownerId: string;
  logo?: string;
  favicon?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone: string;
  currency: string;
  status: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  onboardingCompleted?: boolean;
  customDomain?: string;
  branding?: SchoolBranding;
  createdAt?: string;
  updatedAt?: string;
}

export interface SchoolBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logo: string;
  favicon: string;
  headerStyle: string;
  footerStyle: string;
}

export interface Page {
  id: string;
  uid: string;
  schoolId: string;
  title: string;
  slug: string;
  type: 'homepage' | 'about' | 'programs' | 'classes' | 'admissions' | 'blog' | 'events' | 'contact' | 'gallery' | 'calendar' | 'faq' | 'custom';
  status: 'draft' | 'published' | 'scheduled';
  sections: PageSection[];
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageSection {
  id: string;
  type: string;
  styleId: string;
  content: Record<string, any>;
  settings: Record<string, any>;
  order: number;
  visible: boolean;
}

export interface SectionStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  fields: SectionField[];
}

export interface SectionField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'image' | 'video' | 'link' | 'repeater' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface Program {
  id: string;
  uid: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  type: 'academic' | 'extracurricular' | 'sports' | 'arts';
  duration: string;
  fee: number;
  capacity?: number;
  enrolled?: number;
  status: 'active' | 'inactive';
  featuredImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: string;
  uid: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  teacherId?: string;
  programId?: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  capacity: number;
  enrolled: number;
  fee?: number;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  uid: string;
  schoolId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  authorId: string;
  status: 'draft' | 'published';
  featuredImage?: string;
  tags: string[];
  categories: string[];
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  id: string;
  uid: string;
  schoolId: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: 'academic' | 'sports' | 'cultural' | 'general';
  rsvpRequired: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  featuredImage?: string;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface Gallery {
  id: string;
  uid: string;
  schoolId: string;
  title: string;
  slug: string;
  description?: string;
  images: GalleryImage[];
  category: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface FAQ {
  id: string;
  uid: string;
  schoolId: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  uid: string;
  schoolId: string;
  title: string;
  content: string;
  authorId: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  targetAudience: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdmissionApplication {
  id: string;
  uid: string;
  schoolId: string;
  studentName: string;
  email: string;
  phone?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  programId?: string;
  grade?: string;
  previousSchool?: string;
  documents: ApplicationDocument[];
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  notes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Section {
  id: string;
  type: string;
  styleId: string;
  content: any;
  settings: any;
  order: number;
  visible: boolean;
}

export interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  countdown?: string;
  category?: string;
  tags?: string[];
}

export interface Page {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  type: 'homepage' | 'about' | 'classes_archive' | 'class_single' | 'programs_archive' | 'program_single' | 'gallery_archive' | 'gallery_single' | 'calendar_archive' | 'calendar_single' | 'contact' | 'admissions_archive' | 'admission_single' | 'apply_now' | 'blog_archive' | 'blog_single' | 'news_archive' | 'news_single' | 'elibrary_archive' | 'elibrary_single' | 'faq' | 'events_archive' | 'event_single' | 'ecourses_archive' | 'ecourse_single' | 'careers_archive' | 'career_single' | 'custom';
  status: 'published' | 'draft' | 'archived';
  sections: Section[];
  seoTitle?: string;
  seoDescription?: string;
  showOnHeader?: boolean;
  showOnFooter?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SectionProps {
  content: any;
  settings: any;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
}

export interface Form {
  id: string;
  schoolId: string;
  title: string;
  slug: string;
  description: string;
  fields: FormField[];
  settings: {
    allowMultipleSubmissions: boolean;
    requireLogin: boolean;
    showProgressBar: boolean;
    customTheme: any;
    notifications: {
      email: boolean;
      sms: boolean;
      webhook: string;
    };
  };
  status: string;
  submissions: any[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  shareUrl: string;
  analytics: {
    views: number;
    submissions: number;
    conversionRate: number;
  };
}

export interface User {
  id: string;
  uid?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions?: string[];
  schoolId?: string;
  userType: 'platform_admin' | 'school_owner' | 'school_admin' | 'teacher' | 'student' | 'parent' | 'staff';
  verified: boolean;
  status: 'pending' | 'approved' | 'denied' | 'active' | 'suspended';
  approvalStatus?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  stock: number;
  sku?: string;
  tags?: string[];
  status: 'published' | 'draft' | 'archived';
  createdAt: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  schoolId: string;
  customerId: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

export interface Customer {
  id: string;
  schoolId: string;
  userId?: string; 
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: any[];
  createdAt: string;
}

export interface QuickFact {
  icon?: string;
  label: string;
  value: string;
  unit?: string;
  group?: string;
  graphPoint?: number;
}

export interface School {
  id: string;
  uid?: string;
  name: string;
  slug: string;
  ownerId: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  currency?: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  onboardingCompleted: boolean;
  branding: {
    theme?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
    logoUrl?: string;
    headerStyle?: string;
    footerStyle?: string;
    blogPostStyle?: string;
    blogArchiveStyle?: string;
    announcementPostStyle?: string;
    announcementArchiveStyle?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

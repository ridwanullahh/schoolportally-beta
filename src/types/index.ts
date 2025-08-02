export interface PaymentResult {
  status: 'success' | 'failed';
  transactionId?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  message?: string;
}

export interface QuickFact {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  group?: string;
  graphPoint?: number;
}

export interface Branding {
  // Core brand colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Background colors
  primaryBackgroundColor?: string;
  secondaryBackgroundColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;

  // Text colors
  primaryTextColor?: string;
  secondaryTextColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;

  // Button colors
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonTextColor?: string;

  // Additional colors
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  infoColor?: string;

  // Typography
  fontFamily?: string;
  headingFontFamily?: string;

  // Assets
  logoUrl?: string;
  faviconUrl?: string;

  // Style selections
  headerStyle?: string;
  footerStyle?: string;
  theme?: string;
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
  status?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  onboardingCompleted?: boolean;
  branding?: Branding;
  createdAt: string;
  updatedAt: string;

  // Style configurations
  headerStyle?: string;
  footerStyle?: string;
  blogPostStyle?: string;
  blogArchiveStyle?: string;
  announcementPostStyle?: string;
  announcementArchiveStyle?: string;
  eventPostStyle?: string;
  eventArchiveStyle?: string;
  programPostStyle?: string;
  programArchiveStyle?: string;
  classPostStyle?: string;
  classArchiveStyle?: string;
  coursePostStyle?: string;
  courseArchiveStyle?: string;
  galleryPostStyle?: string;
  galleryArchiveStyle?: string;
  elibraryBookPostStyle?: string;
  elibraryBookArchiveStyle?: string;
  knowledgebasePostStyle?: string;
  knowledgebaseArchiveStyle?: string;
  faqPostStyle?: string;
  faqArchiveStyle?: string;
  jobPostStyle?: string;
  jobArchiveStyle?: string;
}

export interface Section {
  id: string;
  type: string;
  content: { [key: string]: any };
  styleId: string;
  settings?: { [key: string]: any };
  order: number;
  visible: boolean;
}

export interface Page {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  sections?: Section[];
  seoTitle?: string;
  seoDescription?: string;
  showOnHeader?: boolean;
  showOnFooter?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  comments?: any[];
  relatedPosts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  inventory?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

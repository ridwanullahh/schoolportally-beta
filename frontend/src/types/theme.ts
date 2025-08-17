export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'bold' | 'tech' | 'warm' | 'cool' | 'corporate' | 'nature' | 'elegant';
  styles: ThemeStyles;
  colorScheme: ColorScheme;
  typography: Typography;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeStyles {
  header: string;
  footer: string;
  breadcrumb: string;
  sections: Record<string, string>;
  archives: {
    blog: string;
    events: string;
    news: string;
    gallery: string;
  };
  singlePosts: {
    blog: string;
    event: string;
    news: string;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface Typography {
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
}

export interface BreadcrumbStyle {
  id: string;
  name: string;
  category: string;
  cssClass: string;
  preview: string;
}

export interface SectionStyle {
  id: string;
  name: string;
  category: string;
  cssClass: string;
  description: string;
  preview: string;
}

export interface ArchiveStyle {
  id: string;
  name: string;
  category: string;
  cssClass: string;
  description: string;
  preview: string;
}

export interface SinglePostStyle {
  id: string;
  name: string;
  category: string;
  cssClass: string;
  description: string;
  preview: string;
}
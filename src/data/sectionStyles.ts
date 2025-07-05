
import { SectionStyle } from '@/types';

// Hero Section Styles (15 unique layouts)
export const heroStyles: SectionStyle[] = [
  {
    id: 'hero-1',
    name: 'Classic Center',
    description: 'Centered content with large heading and CTA buttons',
    preview: '/previews/hero-1.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
      { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' },
      { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' },
      { id: 'backgroundImage', name: 'backgroundImage', type: 'image' as const, label: 'Background Image' },
    ]
  },
  {
    id: 'hero-2',
    name: 'Split Layout',
    description: 'Content on left, image on right',
    preview: '/previews/hero-2.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
      { id: 'image', name: 'image', type: 'image' as const, label: 'Hero Image', required: true },
    ]
  },
  {
    id: 'hero-3',
    name: 'Video Background',
    description: 'Full-screen video with overlay content',
    preview: '/previews/hero-3.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
      { id: 'videoUrl', name: 'videoUrl', type: 'video' as const, label: 'Background Video', required: true },
    ]
  },
  {
    id: 'hero-4',
    name: 'Minimal Text',
    description: 'Clean, minimal design with focus on typography',
    preview: '/previews/hero-4.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
    ]
  },
  {
    id: 'hero-5',
    name: 'Card Overlay',
    description: 'Content in a card overlaying the background',
    preview: '/previews/hero-5.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
      { id: 'backgroundImage', name: 'backgroundImage', type: 'image' as const, label: 'Background Image' },
    ]
  },
  {
    id: 'hero-6',
    name: 'Diagonal Split',
    description: 'Diagonal division with content and image',
    preview: '/previews/hero-6.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' },
      { id: 'image', name: 'image', type: 'image' as const, label: 'Hero Image', required: true },
    ]
  },
  {
    id: 'hero-7',
    name: 'Parallax Background',
    description: 'Parallax scrolling background effect',
    preview: '/previews/hero-7.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'backgroundImage', name: 'backgroundImage', type: 'image' as const, label: 'Background Image' },
    ]
  },
  {
    id: 'hero-8',
    name: 'Animated Gradient',
    description: 'Animated gradient background with centered content',
    preview: '/previews/hero-8.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
    ]
  },
  {
    id: 'hero-9',
    name: 'Split Screen Video',
    description: 'Split screen with video on one side',
    preview: '/previews/hero-9.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'videoUrl', name: 'videoUrl', type: 'video' as const, label: 'Video URL' },
    ]
  },
  {
    id: 'hero-10',
    name: 'Layered Cards',
    description: 'Multiple layered cards with depth effect',
    preview: '/previews/hero-10.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'image', name: 'image', type: 'image' as const, label: 'Hero Image' },
    ]
  },
  {
    id: 'hero-11',
    name: 'Full Width Image',
    description: 'Full width background image with overlay text',
    preview: '/previews/hero-11.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'backgroundImage', name: 'backgroundImage', type: 'image' as const, label: 'Background Image' },
    ]
  },
  {
    id: 'hero-12',
    name: 'Geometric Shapes',
    description: 'Modern design with geometric shapes and patterns',
    preview: '/previews/hero-12.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
    ]
  },
  {
    id: 'hero-13',
    name: 'Carousel Hero',
    description: 'Multiple slides with different content',
    preview: '/previews/hero-13.jpg',
    category: 'hero',
    fields: [
      { id: 'slides', name: 'slides', type: 'repeater' as const, label: 'Hero Slides' },
    ]
  },
  {
    id: 'hero-14',
    name: 'Interactive Elements',
    description: 'Hero with interactive hover effects',
    preview: '/previews/hero-14.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Interactive Features' },
    ]
  },
  {
    id: 'hero-15',
    name: 'Timeline Hero',
    description: 'Hero section with timeline elements',
    preview: '/previews/hero-15.jpg',
    category: 'hero',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' },
      { id: 'timeline', name: 'timeline', type: 'repeater' as const, label: 'Timeline Items' },
    ]
  }
];

// Features Section Styles (15 unique layouts)
export const featuresStyles: SectionStyle[] = [
  {
    id: 'features-1',
    name: '3 Column Grid',
    description: 'Three column grid layout with icons',
    preview: '/previews/features-1.jpg',
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Section Subtitle' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Features' },
    ]
  },
  {
    id: 'features-2',
    name: 'Alternating Rows',
    description: 'Alternating left-right layout with images',
    preview: '/previews/features-2.jpg',
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Section Subtitle' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Features' },
    ]
  },
  {
    id: 'features-3',
    name: 'Card Stack',
    description: 'Stacked cards with hover effects',
    preview: '/previews/features-3.jpg',
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Features' },
    ]
  },
  {
    id: 'features-4',
    name: 'Icon Timeline',
    description: 'Timeline layout with icons and descriptions',
    preview: '/previews/features-4.jpg',
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Timeline Features' },
    ]
  },
  {
    id: 'features-5',
    name: 'Tabbed Features',
    description: 'Tabbed interface for different feature categories',
    preview: '/previews/features-5.jpg',
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'tabs', name: 'tabs', type: 'repeater' as const, label: 'Feature Tabs' },
    ]
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `features-${i + 6}`,
    name: `Features Style ${i + 6}`,
    description: `Unique features layout variation ${i + 6}`,
    preview: `/previews/features-${i + 6}.jpg`,
    category: 'features',
    fields: [
      { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
      { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Section Subtitle' },
      { id: 'features', name: 'features', type: 'repeater' as const, label: 'Features' },
    ]
  }))
];

// About Section Styles (15 unique layouts)
export const aboutStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `about-${i + 1}`,
  name: `About Style ${i + 1}`,
  description: `Unique about section layout ${i + 1}`,
  preview: `/previews/about-${i + 1}.jpg`,
  category: 'about',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
    { id: 'image', name: 'image', type: 'image' as const, label: 'Image' },
    { id: 'stats', name: 'stats', type: 'repeater' as const, label: 'Statistics' },
  ]
}));

// Testimonials Section Styles (15 unique layouts)
export const testimonialsStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `testimonials-${i + 1}`,
  name: `Testimonials Style ${i + 1}`,
  description: `Unique testimonials layout ${i + 1}`,
  preview: `/previews/testimonials-${i + 1}.jpg`,
  category: 'testimonials',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'testimonials', name: 'testimonials', type: 'repeater' as const, label: 'Testimonials' },
  ]
}));

// CTA Section Styles (15 unique layouts)
export const ctaStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `cta-${i + 1}`,
  name: `CTA Style ${i + 1}`,
  description: `Unique call-to-action layout ${i + 1}`,
  preview: `/previews/cta-${i + 1}.jpg`,
  category: 'cta',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'CTA Title' },
    { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
    { id: 'buttonText', name: 'buttonText', type: 'text' as const, label: 'Button Text' },
    { id: 'buttonLink', name: 'buttonLink', type: 'link' as const, label: 'Button Link' },
  ]
}));

// Gallery Section Styles (15 unique layouts)
export const galleryStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `gallery-${i + 1}`,
  name: `Gallery Style ${i + 1}`,
  description: `Unique gallery layout ${i + 1}`,
  preview: `/previews/gallery-${i + 1}.jpg`,
  category: 'gallery',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'images', name: 'images', type: 'repeater' as const, label: 'Images' },
    { id: 'layout', name: 'layout', type: 'select' as const, label: 'Gallery Layout' },
  ]
}));

// Contact Section Styles (15 unique layouts)
export const contactStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `contact-${i + 1}`,
  name: `Contact Style ${i + 1}`,
  description: `Unique contact section layout ${i + 1}`,
  preview: `/previews/contact-${i + 1}.jpg`,
  category: 'contact',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' },
    { id: 'showForm', name: 'showForm', type: 'select' as const, label: 'Show Contact Form' },
    { id: 'showMap', name: 'showMap', type: 'select' as const, label: 'Show Map' },
  ]
}));

// Blog Section Styles (15 unique layouts)
export const blogStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `blog-${i + 1}`,
  name: `Blog Style ${i + 1}`,
  description: `Unique blog section layout ${i + 1}`,
  preview: `/previews/blog-${i + 1}.jpg`,
  category: 'blog',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'postsToShow', name: 'postsToShow', type: 'text' as const, label: 'Number of Posts' },
    { id: 'layout', name: 'layout', type: 'select' as const, label: 'Blog Layout' },
  ]
}));

// FAQ Section Styles (15 unique layouts)
export const faqStyles: SectionStyle[] = Array.from({ length: 15 }, (_, i) => ({
  id: `faq-${i + 1}`,
  name: `FAQ Style ${i + 1}`,
  description: `Unique FAQ section layout ${i + 1}`,
  preview: `/previews/faq-${i + 1}.jpg`,
  category: 'faq',
  fields: [
    { id: 'title', name: 'title', type: 'text' as const, label: 'Section Title' },
    { id: 'faqs', name: 'faqs', type: 'repeater' as const, label: 'FAQ Items' },
    { id: 'layout', name: 'layout', type: 'select' as const, label: 'FAQ Layout' },
  ]
}));

// Export all styles grouped by category
export const allSectionStyles: Record<string, SectionStyle[]> = {
  hero: heroStyles,
  features: featuresStyles,
  about: aboutStyles,
  testimonials: testimonialsStyles,
  cta: ctaStyles,
  gallery: galleryStyles,
  contact: contactStyles,
  blog: blogStyles,
  faq: faqStyles,
};

// Helper function to get styles by category
export const getStylesByCategory = (category: string): SectionStyle[] => {
  return allSectionStyles[category] || [];
};

// Helper function to get style by ID
export const getStyleById = (styleId: string): SectionStyle | null => {
  for (const styles of Object.values(allSectionStyles)) {
    const style = styles.find(s => s.id === styleId);
    if (style) return style;
  }
  return null;
};

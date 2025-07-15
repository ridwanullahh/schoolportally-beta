
import { SectionStyle } from '@/types';

// Hero Section Styles (15 unique layouts)
export const heroStyles: SectionStyle[] = [
  { id: 'hero-center-stage', name: 'Center Stage', description: 'Full viewport height, flexbox centering, fade-in animation', preview: '/previews/hero-1.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-split-columns', name: 'Split Columns', description: 'CSS Grid 2-column layout, content left, breathing space right', preview: '/previews/hero-2.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-full-card', name: 'Full Card Hero', description: 'Full-width card with prominent shadow and bordered container', preview: '/previews/hero-3.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-overlay-frame', name: 'Overlay Frame', description: 'Top-padded frame with floating elements', preview: '/previews/hero-4.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-grid-power', name: 'Grid Power', description: 'CSS Grid with emphasized hierarchy and structured layout', preview: '/previews/hero-5.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-minimal-punch', name: 'Minimal Punch', description: 'Compact top section with bottom accent border', preview: '/previews/hero-6.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-dynamic-fold', name: 'Dynamic Fold', description: 'Folded section with slide-in animation from side', preview: '/previews/hero-7.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-sticky-topline', name: 'Sticky Topline', description: 'Sticky hero that shrinks on scroll', preview: '/previews/hero-8.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-block-statement', name: 'Block Statement', description: 'Side floating headline with sharp geometric corners', preview: '/previews/hero-9.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-slide-reveal', name: 'Slide Reveal', description: 'Horizontal slide-in animation from edge', preview: '/previews/hero-10.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-skew-panel', name: 'Skew Panel', description: 'Angled hero block with bold skewed layout', preview: '/previews/hero-11.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-minimalist-clean', name: 'Minimalist Clean', description: 'Clean, simple, and modern design', preview: '/previews/hero-12.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-bold-geometric', name: 'Bold Geometric Shapes', description: 'Striking design with geometric shapes', preview: '/previews/hero-13.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-gradient-waves', name: 'Gradient Waves', description: 'Animated gradient with wave-like shapes', preview: '/previews/hero-14.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-split-yin-yang', name: 'Split Screen Yin-Yang', description: 'Diagonally split screen with contrasting colors', preview: '/previews/hero-15.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-floating-card-deck', name: 'Floating Card Deck', description: 'A stack of floating cards with a modern look', preview: '/previews/hero-16.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-dot-matrix', name: 'Animated Dot Matrix', description: 'Background with an animated dot matrix', preview: '/previews/hero-17.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-typography-sculpture', name: 'Typography Sculpture', description: 'Creative use of typography as a design element', preview: '/previews/hero-18.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-hexagonal-grid', name: 'Hexagonal Grid', description: 'A background made of a hexagonal grid', preview: '/previews/hero-19.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-circular-orbit', name: 'Circular Orbit', description: 'Elements orbiting a central point', preview: '/previews/hero-20.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-glass-morphism', name: 'Glass Morphism Stack', description: 'Frosted glass effect with stacked layers', preview: '/previews/hero-21.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-skewed-perspective', name: 'Skewed Perspective', description: 'Content with a 3D skewed perspective', preview: '/previews/hero-22.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-neumorphic', name: 'Neumorphic Landscape', description: 'Soft UI with a neumorphic design', preview: '/previews/hero-23.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-magazine-editorial', name: 'Magazine Editorial', description: 'Layout inspired by a magazine editorial', preview: '/previews/hero-24.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-liquid-wave', name: 'Liquid Wave Motion', description: 'Animated liquid wave effect', preview: '/previews/hero-25.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-brutalist', name: 'Brutalist Concrete', description: 'Raw, brutalist design with a concrete texture', preview: '/previews/hero-26.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-neon-cyber', name: 'Neon Cyber Glow', description: 'Cyberpunk-inspired design with neon glows', preview: '/previews/hero-27.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-3d-isometric', name: '3D Isometric Blocks', description: '3D isometric blocks with a sense of depth', preview: '/previews/hero-28.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-origami-folds', name: 'Origami Paper Folds', description: 'Design inspired by origami paper folds', preview: '/previews/hero-29.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-particle-burst', name: 'Particle Burst', description: 'An explosion of particles for a dynamic effect', preview: '/previews/hero-30.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-layered-depth', name: 'Layered Depth Parallax', description: 'Parallax effect with multiple layers', preview: '/previews/hero-31.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-ribbon-banner-flow', name: 'Ribbon Banner Flow', description: 'Flowing ribbon banners for a decorative touch', preview: '/previews/hero-32.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-organic-blob', name: 'Organic Blob Shapes', description: 'Soft, organic blob shapes for a friendly feel', preview: '/previews/hero-33.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-terminal', name: 'Terminal Command Line', description: 'A retro terminal command line interface', preview: '/previews/hero-34.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-art-deco', name: 'Art Deco Geometric', description: 'Elegant art deco geometric patterns', preview: '/previews/hero-35.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
  { id: 'hero-flowing-lines', name: 'Flowing Line Art', description: 'Elegant and simple flowing line art', preview: '/previews/hero-36.jpg', category: 'hero', fields: [ { id: 'title', name: 'title', type: 'text' as const, label: 'Main Title', required: true }, { id: 'subtitle', name: 'subtitle', type: 'text' as const, label: 'Subtitle' }, { id: 'description', name: 'description', type: 'textarea' as const, label: 'Description' }, { id: 'primaryButton', name: 'primaryButton', type: 'text' as const, label: 'Primary Button Text' }, { id: 'primaryLink', name: 'primaryLink', type: 'link' as const, label: 'Primary Button Link' }, { id: 'secondaryButton', name: 'secondaryButton', type: 'text' as const, label: 'Secondary Button Text' }, { id: 'secondaryLink', name: 'secondaryLink', type: 'link' as const, label: 'Secondary Button Link' } ] },
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

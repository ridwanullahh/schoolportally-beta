export interface HeroStyleConfig {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'creative' | 'minimal' | 'interactive';
  preview: string;
  features: string[];
  bestFor: string[];
}

export const heroStyles: HeroStyleConfig[] = [
  {
    id: 'hero-floating-glass',
    name: 'Floating Glass',
    description: 'Modern glassmorphism design with floating card effect and backdrop blur',
    category: 'modern',
    preview: '/previews/hero-floating-glass.jpg',
    features: ['Glassmorphism effect', 'Floating animation', 'Backdrop blur', 'Gradient background'],
    bestFor: ['Modern schools', 'Tech-focused institutions', 'Contemporary design']
  },
  {
    id: 'hero-split-modern',
    name: 'Split Screen Modern',
    description: 'Clean split layout with content on one side and geometric patterns on the other',
    category: 'modern',
    preview: '/previews/hero-split-modern.jpg',
    features: ['Split layout', 'Geometric patterns', 'Responsive design', 'Image support'],
    bestFor: ['Professional institutions', 'Universities', 'Corporate schools']
  },
  {
    id: 'hero-minimal-centered',
    name: 'Minimal Centered',
    description: 'Clean, centered design focusing on typography and simplicity',
    category: 'minimal',
    preview: '/previews/hero-minimal-centered.jpg',
    features: ['Centered layout', 'Typography focus', 'Clean design', 'Subtle animations'],
    bestFor: ['Minimalist brands', 'Art schools', 'Design institutions']
  },
  {
    id: 'hero-gradient-mesh',
    name: 'Gradient Mesh',
    description: 'Beautiful gradient mesh background with glassmorphism content container',
    category: 'creative',
    preview: '/previews/hero-gradient-mesh.jpg',
    features: ['Gradient mesh', 'Color blending', 'Glass container', 'Dynamic colors'],
    bestFor: ['Creative schools', 'Art institutions', 'Modern academies']
  },
  {
    id: 'hero-asymmetric',
    name: 'Asymmetric Layout',
    description: 'Dynamic asymmetric grid with animated background patterns',
    category: 'modern',
    preview: '/previews/hero-asymmetric.jpg',
    features: ['Asymmetric grid', 'Animated patterns', 'Visual hierarchy', 'Modern layout'],
    bestFor: ['Design schools', 'Architecture programs', 'Creative institutions']
  },
  {
    id: 'hero-layered-cards',
    name: 'Layered Cards',
    description: 'Stacked card design with depth and shadow effects',
    category: 'modern',
    preview: '/previews/hero-layered-cards.jpg',
    features: ['Card stacking', 'Depth effects', 'Shadow layers', 'Material design'],
    bestFor: ['Business schools', 'Professional training', 'Corporate education']
  },
  {
    id: 'hero-diagonal-split',
    name: 'Diagonal Split',
    description: 'Dynamic diagonal split with contrasting sections and smooth transitions',
    category: 'creative',
    preview: '/previews/hero-diagonal-split.jpg',
    features: ['Diagonal layout', 'Color contrast', 'Smooth transitions', 'Visual impact'],
    bestFor: ['Sports academies', 'Dynamic institutions', 'Youth programs']
  },
  {
    id: 'hero-neumorphism',
    name: 'Neumorphism',
    description: 'Soft, tactile design with subtle shadows and highlights',
    category: 'modern',
    preview: '/previews/hero-neumorphism.jpg',
    features: ['Soft shadows', 'Tactile feel', 'Subtle highlights', 'Modern aesthetic'],
    bestFor: ['Tech schools', 'Modern institutions', 'Innovation centers']
  },
  {
    id: 'hero-animated-particles',
    name: 'Animated Particles',
    description: 'Dynamic particle system with floating elements and smooth animations',
    category: 'interactive',
    preview: '/previews/hero-animated-particles.jpg',
    features: ['Particle animation', 'Floating elements', 'Dynamic movement', 'Interactive feel'],
    bestFor: ['Science schools', 'Tech institutions', 'Innovation academies']
  },
  {
    id: 'hero-typography-focus',
    name: 'Typography Focus',
    description: 'Bold typography-driven design with emphasis on text hierarchy',
    category: 'minimal',
    preview: '/previews/hero-typography-focus.jpg',
    features: ['Bold typography', 'Text hierarchy', 'Minimal design', 'Strong impact'],
    bestFor: ['Literature schools', 'Language institutes', 'Academic institutions']
  },
  {
    id: 'hero-geometric-shapes',
    name: 'Geometric Shapes',
    description: 'Playful geometric elements with animated shapes and modern layout',
    category: 'creative',
    preview: '/previews/hero-geometric-shapes.jpg',
    features: ['Geometric elements', 'Shape animations', 'Playful design', 'Modern aesthetics'],
    bestFor: ['Elementary schools', 'Creative programs', 'Design institutions']
  },
  {
    id: 'hero-video-bg',
    name: 'Video Background',
    description: 'Immersive video background with overlay content and cinematic feel',
    category: 'interactive',
    preview: '/previews/hero-video-bg.jpg',
    features: ['Video background', 'Overlay content', 'Cinematic feel', 'High impact'],
    bestFor: ['Film schools', 'Media institutions', 'Premium academies']
  },
  {
    id: 'hero-parallax-layers',
    name: 'Parallax Layers',
    description: 'Multi-layered parallax effect with depth and smooth scrolling',
    category: 'interactive',
    preview: '/previews/hero-parallax-layers.jpg',
    features: ['Parallax scrolling', 'Layer depth', 'Smooth animation', 'Interactive design'],
    bestFor: ['Modern schools', 'Tech institutions', 'Interactive programs']
  },
  {
    id: 'hero-morphing-blob',
    name: 'Morphing Blob',
    description: 'Organic blob shapes with smooth morphing animations',
    category: 'creative',
    preview: '/previews/hero-morphing-blob.jpg',
    features: ['Morphing animation', 'Organic shapes', 'Fluid design', 'Creative aesthetics'],
    bestFor: ['Art schools', 'Creative institutions', 'Design programs']
  },
  {
    id: 'hero-interactive-grid',
    name: 'Interactive Grid',
    description: 'Dynamic grid system with hover effects and interactive elements',
    category: 'interactive',
    preview: '/previews/hero-interactive-grid.jpg',
    features: ['Interactive grid', 'Hover effects', 'Dynamic elements', 'Engaging design'],
    bestFor: ['Tech schools', 'Interactive programs', 'Modern institutions']
  }
];

export const getHeroStylesByCategory = (category: string) => {
  return heroStyles.filter(style => style.category === category);
};

export const getHeroStyleById = (id: string) => {
  return heroStyles.find(style => style.id === id);
};

export const heroStyleCategories = [
  { id: 'modern', name: 'Modern', description: 'Clean, contemporary designs' },
  { id: 'creative', name: 'Creative', description: 'Artistic and expressive layouts' },
  { id: 'minimal', name: 'Minimal', description: 'Simple, focused designs' },
  { id: 'interactive', name: 'Interactive', description: 'Dynamic and engaging elements' }
];

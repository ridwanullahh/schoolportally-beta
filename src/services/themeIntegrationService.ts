// Theme Integration Service - Manages complete theme system with section styles
import { Theme, School } from '@/types';

interface ThemeStyleMapping {
  [sectionType: string]: {
    [styleNumber: string]: string;
  };
}

interface ThemeComponentMapping {
  [themeId: string]: {
    cssFiles: string[];
    components: {
      [sectionType: string]: string;
    };
  };
}

class ThemeIntegrationService {
  private themeStyleMappings: ThemeStyleMapping = {};
  private themeComponents: ThemeComponentMapping = {};
  private loadedCSSFiles = new Set<string>();

  constructor() {
    this.initializeStyleMappings();
    this.initializeThemeComponents();
  }

  private initializeStyleMappings(): void {
    // Define how each theme maps to section styles
    this.themeStyleMappings = {
      hero: {
        '1': 'hero-modern-clean',
        '2': 'hero-modern-gradient',
        '3': 'hero-modern-split',
        '4': 'hero-modern-card',
        '5': 'hero-modern-minimal',
        '6': 'hero-modern-animated',
        '7': 'hero-modern-video',
        '8': 'hero-modern-parallax',
        '9': 'hero-modern-interactive',
        '10': 'hero-modern-typography',
        '11': 'hero-modern-geometric',
        '12': 'hero-floating-glass',
        '13': 'hero-split-screen-modern',
        '14': 'hero-minimal-centered',
        '15': 'hero-gradient-mesh',
        '16': 'hero-asymmetric-layout',
        '17': 'hero-layered-cards',
        '18': 'hero-diagonal-split',
        '19': 'hero-neumorphism',
        '20': 'hero-animated-particles',
        '21': 'hero-typography-focus',
        '22': 'hero-geometric-shapes',
        '23': 'hero-video-background',
        '24': 'hero-parallax-layers',
        '25': 'hero-morphing-blob',
        '26': 'hero-interactive-grid'
      },
      blog_posts: {
        '1': 'blog-modern-grid',
        '2': 'blog-modern-cards',
        '3': 'blog-modern-display',
        '4': 'blog-modern-gallery',
        '5': 'blog-modern-showcase',
        '6': 'blog-modern-timeline',
        '7': 'blog-modern-masonry',
        '8': 'blog-modern-featured',
        '9': 'blog-modern-compact',
        '10': 'blog-modern-magazine',
        '11': 'blog-modern-slider',
        '12': 'blog-floating-glass',
        '13': 'blog-holographic-cards',
        '14': 'blog-neon-grid',
        '15': 'blog-particle-bg',
        '16': 'blog-morphing-cards',
        '17': 'blog-cyber-grid',
        '18': 'blog-liquid-metal',
        '19': 'blog-aurora-bg',
        '20': 'blog-matrix-rain',
        '21': 'blog-quantum-field',
        '22': 'blog-neural-network',
        '23': 'blog-hologram-effect',
        '24': 'blog-energy-waves',
        '25': 'blog-digital-rain',
        '26': 'blog-mosaic-layout'
      },
      classes: {
        '1': 'classes-modern-grid',
        '2': 'classes-modern-cards',
        '3': 'classes-modern-display',
        '4': 'classes-modern-gallery',
        '5': 'classes-modern-showcase',
        '6': 'classes-modern-timeline',
        '7': 'classes-modern-masonry',
        '8': 'classes-modern-featured',
        '9': 'classes-modern-compact',
        '10': 'classes-modern-magazine',
        '11': 'classes-modern-slider',
        '12': 'classes-floating-glass',
        '13': 'classes-holographic-cards',
        '14': 'classes-neon-grid',
        '15': 'classes-particle-bg',
        '16': 'classes-morphing-cards',
        '17': 'classes-cyber-grid',
        '18': 'classes-liquid-metal',
        '19': 'classes-aurora-bg',
        '20': 'classes-matrix-rain',
        '21': 'classes-quantum-field',
        '22': 'classes-neural-network',
        '23': 'classes-hologram-effect',
        '24': 'classes-energy-waves',
        '25': 'classes-digital-rain',
        '26': 'classes-mosaic-layout'
      },
      programs: {
        '1': 'programs-modern-grid',
        '2': 'programs-modern-cards',
        '3': 'programs-modern-display',
        '4': 'programs-modern-gallery',
        '5': 'programs-modern-showcase',
        '6': 'programs-modern-timeline',
        '7': 'programs-modern-masonry',
        '8': 'programs-modern-featured',
        '9': 'programs-modern-compact',
        '10': 'programs-modern-magazine',
        '11': 'programs-modern-slider',
        '12': 'programs-floating-glass',
        '13': 'programs-holographic-cards',
        '14': 'programs-neon-grid',
        '15': 'programs-particle-bg',
        '16': 'programs-morphing-cards',
        '17': 'programs-cyber-grid',
        '18': 'programs-liquid-metal',
        '19': 'programs-aurora-bg',
        '20': 'programs-matrix-rain',
        '21': 'programs-quantum-field',
        '22': 'programs-neural-network',
        '23': 'programs-hologram-effect',
        '24': 'programs-energy-waves',
        '25': 'programs-digital-rain',
        '26': 'programs-mosaic-layout'
      },
      // Add more section types as needed
      features: this.generateStyleMapping('features'),
      testimonials: this.generateStyleMapping('testimonials'),
      cta: this.generateStyleMapping('cta'),
      faculty: this.generateStyleMapping('faculty'),
      gallery: this.generateStyleMapping('gallery'),
      library: this.generateStyleMapping('library')
    };
  }

  private generateStyleMapping(sectionType: string): { [key: string]: string } {
    const mapping: { [key: string]: string } = {};
    for (let i = 1; i <= 26; i++) {
      if (i <= 11) {
        mapping[i.toString()] = `${sectionType}-modern-style-${i}`;
      } else {
        mapping[i.toString()] = `${sectionType}-ultra-modern-style-${i}`;
      }
    }
    return mapping;
  }

  private initializeThemeComponents(): void {
    // Define CSS files and components for each theme
    for (let i = 1; i <= 26; i++) {
      const themeId = `theme-${i}`;
      this.themeComponents[themeId] = {
        cssFiles: [
          '/themes/styles/sections/hero-styles-complete.css',
          '/themes/styles/sections/hero-styles-extended.css',
          '/themes/styles/sections/blog-section-styles.css',
          '/themes/styles/sections/classes-section-styles.css',
          '/themes/styles/comprehensive-themes.css'
        ],
        components: {
          hero: 'HeroSection',
          blog_posts: 'BlogPostsSection',
          classes: 'ClassesSection',
          programs: 'ProgramsSection',
          features: 'FeaturesSection',
          testimonials: 'TestimonialsSection',
          cta: 'CtaSection',
          faculty: 'FacultySection',
          gallery: 'GallerySection',
          library: 'LibrarySection'
        }
      };
    }
  }

  async applyTheme(themeId: string, school: School): Promise<void> {
    try {
      // Load theme-specific CSS files
      await this.loadThemeCSS(themeId);
      
      // Apply theme colors and branding
      this.applyThemeColors(themeId, school);
      
      // Apply theme-specific section styles
      this.applyThemeSectionStyles(themeId);
      
      // Store current theme
      localStorage.setItem('currentTheme', themeId);
      localStorage.setItem('themeAppliedAt', new Date().toISOString());
      
    } catch (error) {
      console.error('Failed to apply theme:', error);
      throw error;
    }
  }

  private async loadThemeCSS(themeId: string): Promise<void> {
    const themeConfig = this.themeComponents[themeId];
    if (!themeConfig) return;

    // In Vite, CSS is bundled via imports. We ensure they are imported in ThemeSwitcher.
    // Here we simply mark them as loaded to avoid redundant work.
    themeConfig.cssFiles.forEach((cssFile) => this.loadedCSSFiles.add(cssFile));
  }

  private applyThemeColors(themeId: string, school: School): void {
    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    for (let i = 1; i <= 26; i++) {
      body.classList.remove(`theme-${i}`);
    }

    // Apply new theme class
    body.classList.add(themeId);

    // Apply school branding colors
    const branding = school.branding || {};
    
    const colorMappings = {
      '--school-brand-primary': branding.primaryColor,
      '--school-brand-secondary': branding.secondaryColor,
      '--school-brand-accent': branding.accentColor,
      '--school-brand-background': branding.lightBackgroundColor || branding.primaryBackgroundColor,
      '--school-brand-text': branding.primaryTextColor,
      '--school-brand-text-secondary': branding.secondaryTextColor,
      '--school-brand-text-light': branding.lightTextColor || '#ffffff',
      '--school-brand-bg-primary': branding.lightBackgroundColor || '#ffffff',
      '--school-brand-bg-secondary': branding.secondaryBackgroundColor || '#f8fafc',
      '--school-brand-bg-tertiary': branding.darkBackgroundColor || '#f1f5f9'
    };

    Object.entries(colorMappings).forEach(([property, value]) => {
      if (value) {
        root.style.setProperty(property, value);
      }
    });

    // Apply typography
    if (branding.fontFamily) {
      root.style.setProperty('--theme-font-family', branding.fontFamily);
      root.style.setProperty('--theme-body-font', branding.fontFamily);
    }
    
    if (branding.headingFontFamily) {
      root.style.setProperty('--theme-heading-font', branding.headingFontFamily);
    }
  }

  private applyThemeSectionStyles(themeId: string): void {
    const themeNumber = themeId.replace('theme-', '');
    
    // Apply default section styles based on theme
    Object.keys(this.themeStyleMappings).forEach(sectionType => {
      const styleMapping = this.themeStyleMappings[sectionType];
      const defaultStyle = styleMapping[themeNumber];
      
      if (defaultStyle) {
        // Store default style for this section type
        localStorage.setItem(`default-${sectionType}-style`, defaultStyle);
      }
    });
  }

  getSectionStyleClass(sectionType: string, styleId?: string, themeId?: string): string {
    const currentTheme = themeId || localStorage.getItem('currentTheme') || 'theme-1';
    const themeNumber = currentTheme.replace('theme-', '');
    
    // If specific style is provided, use it
    if (styleId) {
      const styleMapping = this.themeStyleMappings[sectionType];
      return styleMapping?.[styleId] || styleMapping?.['1'] || `${sectionType}-modern-style-1`;
    }
    
    // Otherwise, use theme default
    const defaultStyle = localStorage.getItem(`default-${sectionType}-style`);
    if (defaultStyle) {
      return defaultStyle;
    }
    
    // Fallback to theme-based default
    const styleMapping = this.themeStyleMappings[sectionType];
    return styleMapping?.[themeNumber] || styleMapping?.['1'] || `${sectionType}-modern-style-1`;
  }

  getAvailableStyles(sectionType: string): Array<{ id: string; name: string; category: string }> {
    const styleMapping = this.themeStyleMappings[sectionType];
    if (!styleMapping) return [];

    return Object.entries(styleMapping).map(([id, className]) => ({
      id,
      name: this.formatStyleName(className),
      category: parseInt(id) <= 11 ? 'modern' : 'ultra-modern'
    }));
  }

  private formatStyleName(className: string): string {
    return className
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  previewTheme(themeId: string, school: School): Promise<void> {
    // Create a temporary preview without affecting the current theme
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // Apply theme to iframe
      setTimeout(() => {
        document.body.removeChild(iframe);
        resolve();
      }, 1000);
    });
  }

  getCurrentTheme(): string {
    return localStorage.getItem('currentTheme') || 'theme-1';
  }

  getThemeMetadata(themeId: string): any {
    return {
      id: themeId,
      appliedAt: localStorage.getItem('themeAppliedAt'),
      cssFiles: this.themeComponents[themeId]?.cssFiles || [],
      components: this.themeComponents[themeId]?.components || {}
    };
  }

  clearThemeCache(): void {
    this.loadedCSSFiles.clear();
    localStorage.removeItem('currentTheme');
    localStorage.removeItem('themeAppliedAt');
    
    // Remove all theme-related localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('default-') && key.endsWith('-style')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const themeIntegrationService = new ThemeIntegrationService();
export default themeIntegrationService;

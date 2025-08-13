import { Theme, BreadcrumbStyle } from '@/types';

class ThemeService {
  private themes: Theme[] = [];
  private breadcrumbStyles: BreadcrumbStyle[] = [];

  constructor() {
    this.initializeDefaultThemes();
    this.initializeBreadcrumbStyles();
  }

  private initializeDefaultThemes() {
    // Generate 26 themes with different style combinations
    this.themes = [];

    const themeConfigs = [
      // Themes 1-11: Modern UI/UX
      { id: 'theme-1', name: 'Modern Professional', description: 'Clean, professional design perfect for academic institutions', category: 'modern', styleBase: 1, colors: { primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa', background: '#ffffff', text: '#1f2937' }, font: 'Inter' },
      { id: 'theme-2', name: 'Modern Vibrant', description: 'Energetic and colorful design for dynamic institutions', category: 'modern', styleBase: 2, colors: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', background: '#ffffff', text: '#1f2937' }, font: 'Poppins' },
      { id: 'theme-3', name: 'Modern Elegant', description: 'Sophisticated and refined design for prestigious institutions', category: 'modern', styleBase: 3, colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399', background: '#ffffff', text: '#1f2937' }, font: 'Playfair Display' },
      { id: 'theme-4', name: 'Modern Corporate', description: 'Business-focused design for professional education', category: 'modern', styleBase: 4, colors: { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171', background: '#ffffff', text: '#1f2937' }, font: 'Roboto' },
      { id: 'theme-5', name: 'Modern Creative', description: 'Artistic and innovative design for creative institutions', category: 'creative', styleBase: 5, colors: { primary: '#ea580c', secondary: '#fb923c', accent: '#fdba74', background: '#ffffff', text: '#1f2937' }, font: 'Montserrat' },
      { id: 'theme-6', name: 'Modern Tech', description: 'Technology-focused design for STEM education', category: 'modern', styleBase: 6, colors: { primary: '#0891b2', secondary: '#06b6d4', accent: '#67e8f9', background: '#ffffff', text: '#1f2937' }, font: 'Source Sans Pro' },
      { id: 'theme-7', name: 'Modern Warm', description: 'Warm and welcoming design for community schools', category: 'modern', styleBase: 7, colors: { primary: '#c2410c', secondary: '#ea580c', accent: '#fb923c', background: '#fefdf8', text: '#1c1917' }, font: 'Nunito' },
      { id: 'theme-8', name: 'Modern Cool', description: 'Cool and calming design for focused learning', category: 'modern', styleBase: 8, colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#93c5fd', background: '#f8fafc', text: '#1e293b' }, font: 'Lato' },
      { id: 'theme-9', name: 'Modern Bold', description: 'Bold and confident design for leadership institutions', category: 'bold', styleBase: 9, colors: { primary: '#be123c', secondary: '#e11d48', accent: '#fb7185', background: '#ffffff', text: '#1f2937' }, font: 'Raleway' },
      { id: 'theme-10', name: 'Modern Nature', description: 'Nature-inspired design for environmental education', category: 'modern', styleBase: 10, colors: { primary: '#166534', secondary: '#16a34a', accent: '#4ade80', background: '#f0fdf4', text: '#14532d' }, font: 'Lora' },
      { id: 'theme-11', name: 'Modern Minimal', description: 'Ultra-clean minimalist design focusing on content', category: 'minimal', styleBase: 11, colors: { primary: '#374151', secondary: '#4b5563', accent: '#6b7280', background: '#ffffff', text: '#111827' }, font: 'Inter' },

      // Themes 12-26: Ultra-Modern (Existing styles)
      { id: 'theme-12', name: 'Ultra-Modern Glass', description: 'Floating glass elements with modern aesthetics', category: 'modern', styleBase: 12, colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#a855f7', background: '#ffffff', text: '#1f2937' }, font: 'Inter' },
      { id: 'theme-13', name: 'Ultra-Modern Neon', description: 'Neon-inspired design with vibrant colors', category: 'creative', styleBase: 13, colors: { primary: '#ec4899', secondary: '#f472b6', accent: '#f9a8d4', background: '#0f0f23', text: '#ffffff' }, font: 'Poppins' },
      { id: 'theme-14', name: 'Ultra-Modern Geometric', description: 'Geometric shapes and patterns', category: 'creative', styleBase: 14, colors: { primary: '#f59e0b', secondary: '#fbbf24', accent: '#fcd34d', background: '#ffffff', text: '#1f2937' }, font: 'Montserrat' },
      { id: 'theme-15', name: 'Ultra-Modern Minimal', description: 'Clean lines and minimal design', category: 'minimal', styleBase: 15, colors: { primary: '#64748b', secondary: '#94a3b8', accent: '#cbd5e1', background: '#ffffff', text: '#0f172a' }, font: 'Roboto' },
      { id: 'theme-16', name: 'Ultra-Modern Hexagon', description: 'Hexagonal grid patterns', category: 'creative', styleBase: 16, colors: { primary: '#7c2d12', secondary: '#ea580c', accent: '#fb923c', background: '#ffffff', text: '#1f2937' }, font: 'Source Sans Pro' },
      { id: 'theme-17', name: 'Ultra-Modern Sliding', description: 'Dynamic sliding panel effects', category: 'modern', styleBase: 17, colors: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#60a5fa', background: '#ffffff', text: '#1f2937' }, font: 'Nunito' },
      { id: 'theme-18', name: 'Ultra-Modern Isometric', description: '3D isometric design elements', category: 'creative', styleBase: 18, colors: { primary: '#7e22ce', secondary: '#a855f7', accent: '#c084fc', background: '#ffffff', text: '#1f2937' }, font: 'Lato' },
      { id: 'theme-19', name: 'Ultra-Modern Liquid', description: 'Liquid morphing effects', category: 'creative', styleBase: 19, colors: { primary: '#0d9488', secondary: '#14b8a6', accent: '#5eead4', background: '#ffffff', text: '#1f2937' }, font: 'Raleway' },
      { id: 'theme-20', name: 'Ultra-Modern Gradient', description: 'Gradient orbs and effects', category: 'modern', styleBase: 20, colors: { primary: '#be185d', secondary: '#ec4899', accent: '#f472b6', background: '#ffffff', text: '#1f2937' }, font: 'Playfair Display' },
      { id: 'theme-21', name: 'Ultra-Modern Paper', description: 'Paper stack layered design', category: 'classic', styleBase: 21, colors: { primary: '#92400e', secondary: '#d97706', accent: '#fbbf24', background: '#fefdf8', text: '#1c1917' }, font: 'Crimson Text' },
      { id: 'theme-22', name: 'Ultra-Modern Outline', description: 'Neon outline effects', category: 'creative', styleBase: 22, colors: { primary: '#1e40af', secondary: '#3b82f6', accent: '#93c5fd', background: '#0f172a', text: '#ffffff' }, font: 'Inter' },
      { id: 'theme-23', name: 'Ultra-Modern Mosaic', description: 'Mosaic tile layouts', category: 'creative', styleBase: 23, colors: { primary: '#dc2626', secondary: '#ef4444', accent: '#fca5a5', background: '#ffffff', text: '#1f2937' }, font: 'Poppins' },
      { id: 'theme-24', name: 'Ultra-Modern Holographic', description: 'Holographic card effects', category: 'creative', styleBase: 24, colors: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#c4b5fd', background: '#ffffff', text: '#1f2937' }, font: 'Montserrat' },
      { id: 'theme-25', name: 'Ultra-Modern Progress', description: 'Progress reveal animations', category: 'modern', styleBase: 25, colors: { primary: '#059669', secondary: '#10b981', accent: '#6ee7b7', background: '#ffffff', text: '#1f2937' }, font: 'Roboto' },
      { id: 'theme-26', name: 'Ultra-Modern Circular', description: 'Circular frame designs', category: 'modern', styleBase: 26, colors: { primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa', background: '#ffffff', text: '#1f2937' }, font: 'Source Sans Pro' }
    ];

    themeConfigs.forEach((config, index) => {
      const theme: Theme = {
        id: config.id,
        name: config.name,
        description: config.description,
        category: config.category as any,
        styles: this.generateThemeStyles(config.styleBase),
        colorScheme: config.colors,
        typography: {
          fontFamily: config.font,
          headingFont: config.font,
          bodyFont: config.font
        },
        isDefault: index === 0, // First theme is default
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.themes.push(theme);
    });
  }

  private generateThemeStyles(styleBase: number): any {
    // Generate styles for all sections using the theme's base style number
    const sections = [
      'hero', 'quick_facts', 'value_prop', 'teaser', 'features', 'testimonials',
      'events_snapshot', 'gallery_preview', 'blog_posts', 'cta', 'partners',
      'mission_vision', 'history', 'leadership', 'faculty', 'classes', 'programs',
      'courses', 'announcements', 'library', 'gallery', 'knowledgebase', 'jobs',
      'faq', 'academic_calendar', 'result_checker', 'form', 'products'
    ];

    const sectionStyles: any = {};
    sections.forEach(section => {
      sectionStyles[section] = styleBase.toString();
    });

    return {
      header: styleBase.toString(),
      footer: styleBase.toString(),
      breadcrumb: styleBase.toString(), // All 26 breadcrumb styles available
      sections: sectionStyles,
      archives: {
        blog: styleBase.toString(),
        events: styleBase.toString(),
        news: styleBase.toString(),
        gallery: styleBase.toString()
      },
      singlePosts: {
        blog: styleBase.toString(),
        event: styleBase.toString(),
        news: styleBase.toString()
      }
    };
  }

  private initializeBreadcrumbStyles() {
    const breadcrumbConfigs = [
      { id: '1', name: 'Classic Arrow', category: 'classic', preview: 'Home → About → History' },
      { id: '2', name: 'Modern Gradient', category: 'modern', preview: 'Home / About / History' },
      { id: '3', name: 'Pill Design', category: 'modern', preview: 'Home › About › History' },
      { id: '4', name: 'Gradient Background', category: 'modern', preview: 'Home ▶ About ▶ History' },
      { id: '5', name: 'Card Style', category: 'modern', preview: 'Home → About → History' },
      { id: '6', name: 'Minimal Line', category: 'minimal', preview: 'Home — About — History' },
      { id: '7', name: 'Dots Separator', category: 'modern', preview: 'Home • About • History' },
      { id: '8', name: 'Chevron Classic', category: 'classic', preview: 'Home » About » History' },
      { id: '9', name: 'Floating Design', category: 'modern', preview: 'Home ⟩ About ⟩ History' },
      { id: '10', name: 'Bordered Sections', category: 'classic', preview: 'Home | About | History' },
      { id: '11', name: 'Neumorphism', category: 'modern', preview: 'Home → About → History' },
      { id: '12', name: 'Glassmorphism', category: 'modern', preview: 'Home ▸ About ▸ History' },
      { id: '13', name: 'Neon Glow', category: 'modern', preview: 'Home → About → History' },
      { id: '14', name: 'Retro Wave', category: 'retro', preview: 'Home ▶ About ▶ History' },
      { id: '15', name: 'Simple Clean', category: 'minimal', preview: 'Home → About → History' },
      { id: '16', name: 'Elegant Border', category: 'classic', preview: 'Home → About → History' },
      { id: '17', name: 'Modern Rounded', category: 'modern', preview: 'Home → About → History' },
      { id: '18', name: 'Professional', category: 'classic', preview: 'Home → About → History' },
      { id: '19', name: 'Creative Flow', category: 'modern', preview: 'Home → About → History' },
      { id: '20', name: 'Minimalist Pro', category: 'minimal', preview: 'Home → About → History' },
      { id: '21', name: 'Bold Modern', category: 'modern', preview: 'Home → About → History' },
      { id: '22', name: 'Subtle Elegant', category: 'classic', preview: 'Home → About → History' },
      { id: '23', name: 'Dynamic Style', category: 'modern', preview: 'Home → About → History' },
      { id: '24', name: 'Clean Corporate', category: 'classic', preview: 'Home → About → History' },
      { id: '25', name: 'Artistic Flair', category: 'modern', preview: 'Home → About → History' },
      { id: '26', name: 'Ultra Modern', category: 'modern', preview: 'Home → About → History' }
    ];

    this.breadcrumbStyles = breadcrumbConfigs.map(config => ({
      id: config.id,
      name: config.name,
      category: config.category,
      cssClass: `breadcrumb-style-${config.id}`,
      preview: config.preview
    }));
  }

  getThemes(): Theme[] {
    return this.themes;
  }

  getThemeById(id: string): Theme | undefined {
    return this.themes.find(theme => theme.id === id);
  }

  getDefaultTheme(): Theme {
    return this.themes.find(theme => theme.isDefault) || this.themes[0];
  }

  getBreadcrumbStyles(): BreadcrumbStyle[] {
    return this.breadcrumbStyles;
  }

  getBreadcrumbStyleById(id: string): BreadcrumbStyle | undefined {
    return this.breadcrumbStyles.find(style => style.id === id);
  }

  applyTheme(themeId: string, schoolBranding: any = {}): void {
    const theme = this.getThemeById(themeId);
    if (!theme) return;

    const root = document.documentElement;
    const body = document.body;

    // Remove existing theme classes
    for (let i = 1; i <= 26; i++) {
      body.classList.remove(`theme-${i}`);
    }

    // Apply new theme class
    body.classList.add(themeId);

    // Set CSS custom properties for the theme (both old and new naming)
    const primaryColor = schoolBranding.primaryColor || theme.colorScheme.primary;
    const secondaryColor = schoolBranding.secondaryColor || theme.colorScheme.secondary;
    const accentColor = schoolBranding.accentColor || theme.colorScheme.accent;
    const backgroundColor = schoolBranding.lightBackgroundColor || schoolBranding.primaryBackgroundColor || theme.colorScheme.background;
    const textColor = schoolBranding.primaryTextColor || theme.colorScheme.text;

    // Apply both naming conventions for compatibility
    root.style.setProperty('--theme-primary', primaryColor);
    root.style.setProperty('--theme-secondary', secondaryColor);
    root.style.setProperty('--theme-accent', accentColor);
    root.style.setProperty('--theme-background', backgroundColor);
    root.style.setProperty('--theme-text', textColor);

    root.style.setProperty('--school-brand-primary', primaryColor);
    root.style.setProperty('--school-brand-secondary', secondaryColor);
    root.style.setProperty('--school-brand-accent', accentColor);
    root.style.setProperty('--school-brand-background', backgroundColor);
    root.style.setProperty('--school-brand-text', textColor);

    // Apply typography
    const fontFamily = schoolBranding.fontFamily || theme.typography.fontFamily;
    const headingFont = schoolBranding.headingFontFamily || theme.typography.headingFont;

    root.style.setProperty('--theme-font-family', fontFamily);
    root.style.setProperty('--theme-heading-font', headingFont);
    root.style.setProperty('--theme-body-font', fontFamily);

    // Store current theme
    localStorage.setItem('currentTheme', themeId);
  }

  getCurrentTheme(): string {
    return localStorage.getItem('currentTheme') || this.getDefaultTheme().id;
  }

  getStyleForSection(sectionType: string, themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.sections[sectionType] || '1';
  }

  getStyleForArchive(archiveType: string, themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.archives[archiveType] || '1';
  }

  getStyleForSinglePost(postType: string, themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.singlePosts[postType] || '1';
  }

  getHeaderStyle(themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.header || '1';
  }

  getFooterStyle(themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.footer || '1';
  }

  getBreadcrumbStyle(themeId?: string): string {
    const theme = this.getThemeById(themeId || this.getCurrentTheme());
    return theme?.styles.breadcrumb || '1';
  }
}

export const themeService = new ThemeService();
export default themeService;

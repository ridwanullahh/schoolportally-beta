import { useSchool } from '@/contexts/SchoolContext';

/**
 * Service for integrating theme styles with components
 */
export class ThemeIntegrationService {
  /**
   * Get the CSS class name for a section based on its style ID
   * @param sectionType The type of section (e.g., 'cta', 'hero', 'blog_posts')
   * @param styleId The style ID for the section
   * @returns CSS class name for the section
   */
  getSectionStyleClass(sectionType: string, styleId: string): string {
    if (!styleId) {
      return `${sectionType}-style-1`;
    }
    
    // Normalize the style ID
    const normalizedStyleId = this.normalizeStyleId(styleId);
    
    // Return the class name in format: sectionType-style-normalizedId
    return `${sectionType}-style-${normalizedStyleId}`;
  }

  /**
   * Get the CSS class name for a component based on its style ID
   * @param componentType The type of component (e.g., 'header', 'footer', 'breadcrumb')
   * @param styleId The style ID for the component
   * @returns CSS class name for the component
   */
  getComponentStyleClass(componentType: string, styleId: string): string {
    if (!styleId) {
      return `${componentType}-style-1`;
    }
    
    const normalizedStyleId = this.normalizeStyleId(styleId);
    return `${componentType}-style-${normalizedStyleId}`;
  }

  /**
   * Get the CSS class name for a page template based on its style ID
   * @param pageType The type of page (e.g., 'blog', 'announcement', 'event')
   * @param styleId The style ID for the page
   * @returns CSS class name for the page
   */
  getPageStyleClass(pageType: string, styleId: string): string {
    if (!styleId) {
      return `${pageType}-style-1`;
    }
    
    const normalizedStyleId = this.normalizeStyleId(styleId);
    return `${pageType}-style-${normalizedStyleId}`;
  }

  /**
   * Normalize style ID to ensure consistent format
   * @param styleId The style ID to normalize
   * @returns Normalized style ID
   */
  private normalizeStyleId(styleId: string): string {
    if (!styleId) return '1';
    
    // Extract the number from the style ID
    const match = styleId.match(/(\d+)$/);
    if (match) {
      return match[1];
    }
    
    // If no number found, try to extract from the full style ID
    const fullMatch = styleId.match(/style-(\d+)/);
    if (fullMatch) {
      return fullMatch[1];
    }
    
    // Default to 1 if no number found
    return '1';
  }

  /**
   * Get the current theme settings from the school context
   * @returns Current theme settings or null if not available
   */
  getCurrentThemeSettings(): any {
    try {
      const { school } = useSchool();
      return school?.branding || null;
    } catch (error) {
      console.warn('Unable to get current theme settings:', error);
      return null;
    }
  }

  /**
   * Get the CSS custom properties for the current theme
   * @returns CSS custom properties object
   */
  getThemeCustomProperties(): Record<string, string> {
    const themeSettings = this.getCurrentThemeSettings();
    
    if (!themeSettings) {
      return this.getDefaultThemeProperties();
    }
    
    return {
      '--primary-color': themeSettings.primaryColor || '#2d7d32',
      '--secondary-color': themeSettings.secondaryColor || '#4caf50',
      '--accent-color': themeSettings.accentColor || '#81c784',
      '--primary-background': themeSettings.primaryBackgroundColor || '#f8fffe',
      '--secondary-background': themeSettings.secondaryBackgroundColor || '#e8f5e8',
      '--light-background': themeSettings.lightBackgroundColor || '#ffffff',
      '--dark-background': themeSettings.darkBackgroundColor || '#1a1a1a',
      '--primary-text': themeSettings.primaryTextColor || '#1f2937',
      '--secondary-text': themeSettings.secondaryTextColor || '#6b7280',
      '--light-text': themeSettings.lightTextColor || '#ffffff',
      '--dark-text': themeSettings.darkTextColor || '#000000',
      '--primary-button': themeSettings.primaryButtonColor || '#2d7d32',
      '--secondary-button': themeSettings.secondaryButtonColor || '#4caf50',
      '--primary-button-text': themeSettings.primaryButtonTextColor || '#ffffff',
      '--secondary-button-text': themeSettings.secondaryButtonTextColor || '#ffffff',
      '--success-color': themeSettings.successColor || '#10b981',
      '--warning-color': themeSettings.warningColor || '#f59e0b',
      '--error-color': themeSettings.errorColor || '#ef4444',
      '--info-color': themeSettings.infoColor || '#3b82f6',
      '--font-family': themeSettings.fontFamily || 'Inter, system-ui, sans-serif',
      '--heading-font-family': themeSettings.headingFontFamily || 'Inter, system-ui, sans-serif',
    };
  }

  /**
   * Get default theme properties
   * @returns Default CSS custom properties
   */
  private getDefaultThemeProperties(): Record<string, string> {
    return {
      '--primary-color': '#2d7d32',
      '--secondary-color': '#4caf50',
      '--accent-color': '#81c784',
      '--primary-background': '#f8fffe',
      '--secondary-background': '#e8f5e8',
      '--light-background': '#ffffff',
      '--dark-background': '#1a1a1a',
      '--primary-text': '#1f2937',
      '--secondary-text': '#6b7280',
      '--light-text': '#ffffff',
      '--dark-text': '#000000',
      '--primary-button': '#2d7d32',
      '--secondary-button': '#4caf50',
      '--primary-button-text': '#ffffff',
      '--secondary-button-text': '#ffffff',
      '--success-color': '#10b981',
      '--warning-color': '#f59e0b',
      '--error-color': '#ef4444',
      '--info-color': '#3b82f6',
      '--font-family': 'Inter, system-ui, sans-serif',
      '--heading-font-family': 'Inter, system-ui, sans-serif',
    };
  }

  /**
   * Apply theme custom properties to the document root
   */
  applyThemeToDocument(): void {
    const properties = this.getThemeCustomProperties();
    const root = document.documentElement;
    
    Object.entries(properties).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  /**
   * Get style configuration for a specific section type
   * @param sectionType The section type
   * @returns Style configuration object
   */
  getSectionStyleConfig(sectionType: string): any {
    const themeSettings = this.getCurrentThemeSettings();
    
    // Get the style ID for this section type from theme settings
    const styleKey = `${sectionType}Style`;
    const styleId = themeSettings?.[styleKey] || `${sectionType}-style-1`;
    
    return {
      styleId,
      styleClass: this.getSectionStyleClass(sectionType, styleId),
      themeProperties: this.getThemeCustomProperties(),
    };
  }

  /**
   * Check if a specific style is available for a section type
   * @param sectionType The section type
   * @param styleId The style ID to check
   * @returns True if the style is available
   */
  isStyleAvailable(sectionType: string, styleId: string): boolean {
    // For now, assume all styles 1-26 are available for each section type
    const styleNumber = parseInt(this.normalizeStyleId(styleId));
    return styleNumber >= 1 && styleNumber <= 26;
  }

  /**
   * Get all available style IDs for a section type
   * @param sectionType The section type
   * @returns Array of available style IDs
   */
  getAvailableStyleIds(sectionType: string): string[] {
    return Array.from({ length: 26 }, (_, i) => `${sectionType}-style-${i + 1}`);
  }
}

// Export a singleton instance
export const themeIntegrationService = new ThemeIntegrationService();

// Also export as default for backward compatibility
export default themeIntegrationService;
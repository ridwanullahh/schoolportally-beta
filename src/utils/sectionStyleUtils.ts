/**
 * Utility functions for section style management
 */

/**
 * Apply section style to an element
 * @param elementType The type of element (e.g., 'section', 'container', 'content')
 * @param styleId The normalized style ID
 * @param additionalClasses Additional CSS classes to include
 * @returns Combined CSS class string
 */
export const applySectionStyle = (elementType: string, styleId: string, additionalClasses: string[] = []): string => {
  const baseClass = `${elementType}-${styleId}`;
  const additional = additionalClasses.filter(Boolean).join(' ');
  return additional ? `${baseClass} ${additional}` : baseClass;
};

/**
 * Get CSS classes for section container
 * @param styleId The normalized style ID
 * @returns CSS class string for container
 */
export const getSectionContainerClasses = (styleId: string): string => {
  return `container-${styleId}`;
};

/**
 * Get CSS classes for section content
 * @param styleId The normalized style ID
 * @param itemCount Optional number of items in the section
 * @returns CSS class string for content
 */
export const getSectionContentClasses = (styleId: string, itemCount?: number): string => {
  const baseClass = `content-${styleId}`;
  if (itemCount && itemCount > 0) {
    return `${baseClass} content-${styleId}-${itemCount}`;
  }
  return baseClass;
};

/**
 * Normalize style ID to ensure consistent format
 * @param styleId The style ID to normalize
 * @returns Normalized style ID
 */
export const normalizeStyleId = (styleId: string): string => {
  if (!styleId) return '1';
  
  // Remove any existing style suffix if present
  let normalized = styleId.replace(/-style-\d+$/, '');
  
  // Remove any section type prefix if present
  normalized = normalized.replace(/^(hero|quick_facts|value_prop|teaser|features|testimonials|events_snapshot|gallery_preview|blog_posts|cta|partners|mission_vision|history|leadership|faculty|classes|programs|courses|announcements|library|gallery|knowledgebase|jobs|faq|academic_calendar|result_checker|form_embed|products)-/, '');
  
  // Convert underscores and hyphens to consistent format
  normalized = normalized.replace(/[_-]/g, '-');
  
  // Remove any leading/trailing hyphens
  normalized = normalized.replace(/^-+|-+$/g, '');
  
  // Convert to lowercase
  normalized = normalized.toLowerCase();
  
  // If the result is empty, return a default
  if (!normalized) {
    return '1';
  }
  
  return normalized;
};

/**
 * Get style class name from style ID
 * @param styleId The style ID
 * @param prefix Optional prefix for the class name
 * @returns CSS class name
 */
export const getStyleClassName = (styleId: string, prefix: string = ''): string => {
  const normalized = normalizeStyleId(styleId);
  return prefix ? `${prefix}-${normalized}` : normalized;
};

/**
 * Check if a style ID is valid
 * @param styleId The style ID to check
 * @returns True if valid, false otherwise
 */
export const isValidStyleId = (styleId: string): boolean => {
  if (!styleId || typeof styleId !== 'string') {
    return false;
  }
  
  // Basic validation - should contain alphanumeric characters and hyphens/underscores
  return /^[a-zA-Z0-9_-]+$/.test(styleId);
};

/**
 * Extract section type from style ID
 * @param styleId The style ID
 * @returns Section type or empty string if not found
 */
export const extractSectionType = (styleId: string): string => {
  if (!styleId) return '';
  
  const match = styleId.match(/^(hero|quick_facts|value_prop|teaser|features|testimonials|events_snapshot|gallery_preview|blog_posts|cta|partners|mission_vision|history|leadership|faculty|classes|programs|courses|announcements|library|gallery|knowledgebase|jobs|faq|academic_calendar|result_checker|form_embed|products)/);
  
  return match ? match[1] : '';
};

/**
 * Get style number from style ID
 * @param styleId The style ID
 * @returns Style number or 1 if not found
 */
export const getStyleNumber = (styleId: string): number => {
  if (!styleId) return 1;
  
  const match = styleId.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
};

/**
 * Generate a style ID from section type and style number
 * @param sectionType The section type
 * @param styleNumber The style number
 * @returns Generated style ID
 */
export const generateStyleId = (sectionType: string, styleNumber: number): string => {
  return `${sectionType}-style-${styleNumber}`;
};

/**
 * Get all available style IDs for a section type
 * @param sectionType The section type
 * @param count Number of styles available
 * @returns Array of style IDs
 */
export const getAvailableStyleIds = (sectionType: string, count: number = 26): string[] => {
  return Array.from({ length: count }, (_, i) => generateStyleId(sectionType, i + 1));
};
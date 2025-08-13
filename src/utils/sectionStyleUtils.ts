/**
 * Section Style Utilities
 * Provides utilities for applying consistent styling across all sections
 */

export interface SectionStyleConfig {
  styleId: string;
  className: string;
  gridType?: 'grid-2' | 'grid-3' | 'grid-4' | 'masonry' | 'timeline' | 'split';
  cardStyle?: 'default' | 'elevated' | 'bordered' | 'glass' | 'neumorphic';
  layout?: 'default' | 'centered' | 'split' | 'timeline' | 'masonry';
}

/**
 * Get the CSS class name for a section style
 */
export const getSectionStyleClass = (styleId: string | number): string => {
  const id = typeof styleId === 'string' ? styleId : styleId.toString();
  return `section-style-${id}`;
};

/**
 * Get the grid class for a section
 */
export const getSectionGridClass = (styleId: string | number, itemCount?: number): string => {
  const id = parseInt(typeof styleId === 'string' ? styleId : styleId.toString());
  
  // Determine optimal grid based on style and item count
  if (id >= 11 && id <= 12) return 'section-grid'; // Timeline and masonry use special layouts
  if (id === 10) return ''; // Split layout doesn't use grid
  
  // Default grid logic based on item count
  if (itemCount) {
    if (itemCount <= 2) return 'section-grid section-grid-2';
    if (itemCount <= 6) return 'section-grid section-grid-3';
    return 'section-grid section-grid-4';
  }
  
  return 'section-grid section-grid-3'; // Default
};

/**
 * Get configuration for a specific section style
 */
export const getSectionStyleConfig = (styleId: string | number): SectionStyleConfig => {
  const id = parseInt(typeof styleId === 'string' ? styleId : styleId.toString());
  
  const configs: { [key: number]: SectionStyleConfig } = {
    1: { styleId: '1', className: 'section-style-1', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    2: { styleId: '2', className: 'section-style-2', gridType: 'grid-3', cardStyle: 'glass', layout: 'centered' },
    3: { styleId: '3', className: 'section-style-3', gridType: 'grid-3', cardStyle: 'elevated', layout: 'default' },
    4: { styleId: '4', className: 'section-style-4', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    5: { styleId: '5', className: 'section-style-5', gridType: 'grid-3', cardStyle: 'elevated', layout: 'default' },
    6: { styleId: '6', className: 'section-style-6', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    7: { styleId: '7', className: 'section-style-7', gridType: 'grid-3', cardStyle: 'bordered', layout: 'default' },
    8: { styleId: '8', className: 'section-style-8', gridType: 'grid-3', cardStyle: 'neumorphic', layout: 'default' },
    9: { styleId: '9', className: 'section-style-9', gridType: 'grid-3', cardStyle: 'glass', layout: 'default' },
    10: { styleId: '10', className: 'section-style-10', gridType: 'split', cardStyle: 'default', layout: 'split' },
    11: { styleId: '11', className: 'section-style-11', gridType: 'timeline', cardStyle: 'default', layout: 'timeline' },
    12: { styleId: '12', className: 'section-style-12', gridType: 'masonry', cardStyle: 'default', layout: 'masonry' },
    13: { styleId: '13', className: 'section-style-13', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    14: { styleId: '14', className: 'section-style-14', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    15: { styleId: '15', className: 'section-style-15', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    16: { styleId: '16', className: 'section-style-16', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    17: { styleId: '17', className: 'section-style-17', gridType: 'grid-3', cardStyle: 'glass', layout: 'default' },
    18: { styleId: '18', className: 'section-style-18', gridType: 'grid-3', cardStyle: 'default', layout: 'default' },
    19: { styleId: '19', className: 'section-style-19', gridType: 'grid-3', cardStyle: 'glass', layout: 'default' },
    20: { styleId: '20', className: 'section-style-20', gridType: 'grid-3', cardStyle: 'glass', layout: 'default' },
    21: { styleId: '21', className: 'section-style-21', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    22: { styleId: '22', className: 'section-style-22', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    23: { styleId: '23', className: 'section-style-23', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    24: { styleId: '24', className: 'section-style-24', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    25: { styleId: '25', className: 'section-style-25', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' },
    26: { styleId: '26', className: 'section-style-26', gridType: 'grid-3', cardStyle: 'default', layout: 'centered' }
  };
  
  return configs[id] || configs[1];
};

/**
 * Apply section style to a component
 */
export const applySectionStyle = (
  baseClassName: string,
  styleId: string | number,
  additionalClasses?: string[]
): string => {
  const config = getSectionStyleConfig(styleId);
  const classes = [baseClassName, config.className];
  
  if (additionalClasses) {
    classes.push(...additionalClasses);
  }
  
  return classes.filter(Boolean).join(' ');
};

/**
 * Get section container classes
 */
export const getSectionContainerClasses = (styleId: string | number): string => {
  const config = getSectionStyleConfig(styleId);
  const classes = ['container'];
  
  if (config.layout === 'split') {
    classes.push('section-split-container');
  }
  
  return classes.join(' ');
};

/**
 * Get section content wrapper classes
 */
export const getSectionContentClasses = (styleId: string | number, itemCount?: number): string => {
  const config = getSectionStyleConfig(styleId);
  const classes = [];
  
  switch (config.layout) {
    case 'timeline':
      classes.push('section-timeline');
      break;
    case 'masonry':
      classes.push('section-masonry');
      break;
    case 'split':
      classes.push('section-content');
      break;
    default:
      classes.push(getSectionGridClass(styleId, itemCount));
  }
  
  return classes.join(' ');
};

/**
 * Check if a style supports specific features
 */
export const styleSupportsFeature = (styleId: string | number, feature: string): boolean => {
  const id = parseInt(typeof styleId === 'string' ? styleId : styleId.toString());
  
  switch (feature) {
    case 'animations':
      return [2, 9, 15, 16, 17, 18, 19, 20].includes(id);
    case 'glassmorphism':
      return [2, 9, 12, 17, 19, 20].includes(id);
    case 'darkTheme':
      return [6, 15, 17].includes(id);
    case 'gradients':
      return [2, 9, 16, 19, 20].includes(id);
    case 'specialLayout':
      return [10, 11, 12, 13, 14].includes(id);
    default:
      return false;
  }
};

/**
 * Get recommended styles for specific section types
 */
export const getRecommendedStyles = (sectionType: string): number[] => {
  const recommendations: { [key: string]: number[] } = {
    hero: [1, 2, 4, 9, 16, 19, 20],
    features: [3, 5, 7, 8, 11, 13],
    testimonials: [2, 6, 9, 12, 18],
    team: [3, 5, 8, 13, 21],
    gallery: [12, 14, 18, 19],
    blog: [1, 3, 5, 11, 12],
    events: [2, 4, 11, 16, 20],
    programs: [3, 7, 8, 13, 21],
    classes: [1, 5, 7, 11, 22],
    faculty: [3, 8, 13, 21, 23],
    cta: [2, 4, 9, 16, 19],
    contact: [1, 4, 6, 7, 24],
    about: [1, 4, 10, 11, 25],
    default: [1, 3, 5, 7, 21]
  };
  
  return recommendations[sectionType] || recommendations.default;
};

/**
 * Validate if a style ID is valid
 */
export const isValidStyleId = (styleId: string | number): boolean => {
  const id = parseInt(typeof styleId === 'string' ? styleId : styleId.toString());
  return id >= 1 && id <= 26;
};

/**
 * Get fallback style ID
 */
export const getFallbackStyleId = (): string => {
  return '1';
};

/**
 * Normalize style ID
 */
export const normalizeStyleId = (styleId: string | number | undefined): string => {
  if (!styleId) return getFallbackStyleId();
  
  const id = typeof styleId === 'string' ? styleId : styleId.toString();
  return isValidStyleId(id) ? id : getFallbackStyleId();
};

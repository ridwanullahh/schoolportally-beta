import { useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { Branding } from '@/types';
import themeIntegrationService from '@/services/themeIntegrationService';
// Load comprehensive theme and section styles once
import '@/themes/styles/comprehensive-themes.css';
import '@/themes/styles/sections/hero-styles-complete.css';
import '@/themes/styles/sections/hero-styles-extended.css';
import '@/themes/styles/sections/blog-section-styles.css';
import '@/themes/styles/sections/classes-section-styles.css';

interface ThemeSwitcherProps {
  themeName: string;
}

const ThemeSwitcher = ({ themeName }: ThemeSwitcherProps): null => {
  const { school } = useSchool();

  const generateColorVariations = (color: string) => {
    // Generate lighter and darker variations of a color
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return {
      light: `rgba(${r}, ${g}, ${b}, 0.1)`,
      medium: `rgba(${r}, ${g}, ${b}, 0.3)`,
      dark: `rgba(${r}, ${g}, ${b}, 0.8)`,
      rgb: `${r}, ${g}, ${b}`
    };
  };

  const createBrandingCSS = (branding: Branding) => {
    const primaryVariations = generateColorVariations(branding.primaryColor || '#2d7d32');
    const secondaryVariations = generateColorVariations(branding.secondaryColor || '#4caf50');
    const accentVariations = generateColorVariations(branding.accentColor || '#81c784');

    return `
      :root {
        /* Core Brand Colors */
        --school-brand-primary: ${branding.primaryColor || '#2d7d32'};
        --school-brand-secondary: ${branding.secondaryColor || '#4caf50'};
        --school-brand-accent: ${branding.accentColor || '#81c784'};

        /* Color Variations */
        --school-brand-primary-light: ${primaryVariations.light};
        --school-brand-primary-medium: ${primaryVariations.medium};
        --school-brand-primary-dark: ${primaryVariations.dark};
        --school-brand-primary-rgb: ${primaryVariations.rgb};

        --school-brand-secondary-light: ${secondaryVariations.light};
        --school-brand-secondary-medium: ${secondaryVariations.medium};
        --school-brand-secondary-dark: ${secondaryVariations.dark};
        --school-brand-secondary-rgb: ${secondaryVariations.rgb};

        --school-brand-accent-light: ${accentVariations.light};
        --school-brand-accent-medium: ${accentVariations.medium};
        --school-brand-accent-dark: ${accentVariations.dark};
        --school-brand-accent-rgb: ${accentVariations.rgb};

        /* Background Colors */
        --school-brand-bg-primary: ${branding.primaryBackgroundColor || '#f8fffe'};
        --school-brand-bg-secondary: ${branding.secondaryBackgroundColor || '#e8f5e8'};
        --school-brand-bg-light: ${branding.lightBackgroundColor || '#ffffff'};
        --school-brand-bg-dark: ${branding.darkBackgroundColor || '#1a1a1a'};

        /* Text Colors */
        --school-brand-text-primary: ${branding.primaryTextColor || '#1f2937'};
        --school-brand-text-secondary: ${branding.secondaryTextColor || '#6b7280'};
        --school-brand-text-light: ${branding.lightTextColor || '#ffffff'};
        --school-brand-text-dark: ${branding.darkTextColor || '#000000'};

        /* Button Colors */
        --school-brand-btn-primary: ${branding.primaryButtonColor || '#2d7d32'};
        --school-brand-btn-primary-text: ${branding.primaryButtonTextColor || '#ffffff'};
        --school-brand-btn-secondary: ${branding.secondaryButtonColor || '#4caf50'};
        --school-brand-btn-secondary-text: ${branding.secondaryButtonTextColor || '#ffffff'};

        /* Status Colors */
        --school-brand-success: ${branding.successColor || '#10b981'};
        --school-brand-warning: ${branding.warningColor || '#f59e0b'};
        --school-brand-error: ${branding.errorColor || '#ef4444'};
        --school-brand-info: ${branding.infoColor || '#3b82f6'};

        /* Typography */
        --school-brand-font-family: ${branding.fontFamily || 'Inter, system-ui, sans-serif'};
        --school-brand-heading-font-family: ${branding.headingFontFamily || 'Inter, system-ui, sans-serif'};

        /* Legacy Support */
        --brand-primary: var(--school-brand-primary);
        --brand-secondary: var(--school-brand-secondary);
        --brand-accent: var(--school-brand-accent);
        --brand-text: var(--school-brand-text-primary);
        --brand-font: var(--school-brand-font-family);
      }

      /* Apply font families globally */
      body {
        font-family: var(--school-brand-font-family);
      }

      h1, h2, h3, h4, h5, h6 {
        font-family: var(--school-brand-heading-font-family);
      }

      /* Button styling with brand colors */
      .btn-primary {
        background-color: var(--school-brand-btn-primary);
        color: var(--school-brand-btn-primary-text);
        border-color: var(--school-brand-btn-primary);
      }

      .btn-secondary {
        background-color: var(--school-brand-btn-secondary);
        color: var(--school-brand-btn-secondary-text);
        border-color: var(--school-brand-btn-secondary);
      }

      /* Link colors */
      a {
        color: var(--school-brand-primary);
      }

      a:hover {
        color: var(--school-brand-primary-dark);
      }
    `;
  };

  useEffect(() => {
    const applyTheme = async () => {
      try {
        // Apply theme via integration service (handles CSS and colors)
        if (school) {
          await themeIntegrationService.applyTheme(themeName, school);
        }
        document.body.setAttribute('data-theme', themeName);
      } catch (error) {
        console.error(`Failed to load theme: ${themeName}`, error);
        document.body.setAttribute('data-theme', 'theme-1');
      }
    };

    if (themeName) {
      applyTheme();
    }

    // Apply school branding colors as CSS custom properties
    const existingStyle = document.getElementById('school-brand-colors');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    const branding = school?.branding;
    if (branding) {
      const style = document.createElement('style');
      style.id = 'school-brand-colors';
      style.innerHTML = createBrandingCSS(branding);
      document.head.appendChild(style);
    }

    return () => {
      document.body.removeAttribute('data-theme');
      const styleTag = document.getElementById('school-brand-colors');
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, [themeName, school]);

  return null;
};

export default ThemeSwitcher;
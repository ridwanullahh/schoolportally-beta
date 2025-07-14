import { useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';

interface ThemeSwitcherProps {
  themeName: string;
}

const ThemeSwitcher = ({ themeName }: ThemeSwitcherProps): null => {
  const { school } = useSchool();

  useEffect(() => {
    const applyTheme = async () => {
      try {
        document.body.setAttribute('data-theme', themeName);
        await import(`../../themes/styles/${themeName}.css`);
      } catch (error) {
        console.error(`Failed to load theme: ${themeName}`, error);
        await import('../../themes/styles/default.css');
        document.body.setAttribute('data-theme', 'default');
      }
    };

    if (themeName) {
      applyTheme();
    }

    const branding = school?.branding;
    if (branding) {
      const style = document.createElement('style');
      style.id = 'brand-colors';
      style.innerHTML = `
        :root {
          --brand-primary: ${branding.primaryColor || '#000000'};
          --brand-secondary: ${branding.secondaryColor || '#6c757d'};
          --brand-accent: ${branding.accentColor || '#007bff'};
          --brand-font: ${branding.fontFamily || 'sans-serif'};
          --brand-primary-light: ${branding.primaryColor ? `${branding.primaryColor}20` : '#e2e8f0'};
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      document.body.removeAttribute('data-theme');
      const styleTag = document.getElementById('brand-colors');
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, [themeName, school]);

  return null;
};

export default ThemeSwitcher;
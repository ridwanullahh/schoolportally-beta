import { useEffect } from 'react';

interface ThemeSwitcherProps {
  themeName: string;
}

const ThemeSwitcher = ({ themeName }: ThemeSwitcherProps): null => {
  useEffect(() => {
    const applyTheme = async () => {
      try {
        // The dynamic import itself handles the injection of the CSS.
        // We just need to ensure the old one is no longer active if we were to switch themes.
        // A simple approach is to add a data-theme attribute to the body.
        document.body.setAttribute('data-theme', themeName);
        
        // Dynamically import the CSS for its side effects (style injection)
        await import(`../../themes/styles/${themeName}.css`);
      } catch (error) {
        console.error(`Failed to load theme: ${themeName}`, error);
        // Fallback to default theme
        await import('../../themes/styles/default.css');
        document.body.setAttribute('data-theme', 'default');
      }
    };

    if (themeName) {
      applyTheme();
    }

    // Cleanup function to remove the attribute when the component unmounts
    return () => {
      document.body.removeAttribute('data-theme');
    };
  }, [themeName]);

  return null;
};

export default ThemeSwitcher;
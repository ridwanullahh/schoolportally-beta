
export interface Theme {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  styles: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    spacing: {
      container: string;
      section: string;
    };
    borderRadius: string;
    shadows: {
      card: string;
      button: string;
    };
  };
  layouts: {
    hero: {
      layout: 'centered' | 'split' | 'overlay' | 'minimal';
      alignment: 'left' | 'center' | 'right';
      backgroundType: 'image' | 'gradient' | 'solid';
    };
    sections: {
      spacing: 'compact' | 'normal' | 'spacious';
      maxWidth: 'container' | 'full' | 'narrow';
    };
    cards: {
      style: 'flat' | 'elevated' | 'bordered' | 'minimal';
      spacing: 'tight' | 'normal' | 'loose';
    };
  };
}

export const themes: Theme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, minimal design with subtle shadows and ample whitespace',
    previewImage: '/themes/modern-minimal.jpg',
    styles: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b'
      },
      fonts: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif'
      },
      spacing: {
        container: '1200px',
        section: '120px'
      },
      borderRadius: '12px',
      shadows: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        button: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }
    },
    layouts: {
      hero: {
        layout: 'centered',
        alignment: 'center',
        backgroundType: 'gradient'
      },
      sections: {
        spacing: 'spacious',
        maxWidth: 'container'
      },
      cards: {
        style: 'elevated',
        spacing: 'normal'
      }
    }
  },
  {
    id: 'classic-academic',
    name: 'Classic Academic',
    description: 'Traditional academic styling with serif fonts and formal layout',
    previewImage: '/themes/classic-academic.jpg',
    styles: {
      colors: {
        primary: '#1f2937',
        secondary: '#6b7280',
        accent: '#dc2626',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Playfair Display, serif',
        body: 'Source Sans Pro, sans-serif'
      },
      spacing: {
        container: '1140px',
        section: '100px'
      },
      borderRadius: '4px',
      shadows: {
        card: '0 2px 4px 0 rgb(0 0 0 / 0.1)',
        button: '0 2px 4px 0 rgb(0 0 0 / 0.1)'
      }
    },
    layouts: {
      hero: {
        layout: 'split',
        alignment: 'left',
        backgroundType: 'image'
      },
      sections: {
        spacing: 'normal',
        maxWidth: 'container'
      },
      cards: {
        style: 'bordered',
        spacing: 'normal'
      }
    }
  },
  {
    id: 'vibrant-creative',
    name: 'Vibrant Creative',
    description: 'Bold colors and creative layouts for modern educational institutions',
    previewImage: '/themes/vibrant-creative.jpg',
    styles: {
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#faf5ff',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Poppins, sans-serif',
        body: 'Open Sans, sans-serif'
      },
      spacing: {
        container: '1280px',
        section: '140px'
      },
      borderRadius: '16px',
      shadows: {
        card: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        button: '0 4px 14px 0 rgb(0 0 0 / 0.39)'
      }
    },
    layouts: {
      hero: {
        layout: 'overlay',
        alignment: 'center',
        backgroundType: 'gradient'
      },
      sections: {
        spacing: 'spacious',
        maxWidth: 'container'
      },
      cards: {
        style: 'elevated',
        spacing: 'loose'
      }
    }
  },
  {
    id: 'nature-inspired',
    name: 'Nature Inspired',
    description: 'Earth tones and organic shapes inspired by nature',
    previewImage: '/themes/nature-inspired.jpg',
    styles: {
      colors: {
        primary: '#059669',
        secondary: '#065f46',
        accent: '#d97706',
        background: '#ffffff',
        surface: '#f0fdf4',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Merriweather, serif',
        body: 'Lato, sans-serif'
      },
      spacing: {
        container: '1200px',
        section: '110px'
      },
      borderRadius: '20px',
      shadows: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        button: '0 2px 4px 0 rgb(0 0 0 / 0.06)'
      }
    },
    layouts: {
      hero: {
        layout: 'split',
        alignment: 'left',
        backgroundType: 'image'
      },
      sections: {
        spacing: 'normal',
        maxWidth: 'container'
      },
      cards: {
        style: 'flat',
        spacing: 'normal'
      }
    }
  },
  {
    id: 'tech-forward',
    name: 'Tech Forward',
    description: 'Modern technology-focused design with sharp edges and bold typography',
    previewImage: '/themes/tech-forward.jpg',
    styles: {
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f1f5f9',
        text: '#0f172a',
        textSecondary: '#475569'
      },
      fonts: {
        heading: 'Roboto, sans-serif',
        body: 'Roboto, sans-serif'
      },
      spacing: {
        container: '1300px',
        section: '130px'
      },
      borderRadius: '8px',
      shadows: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        button: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }
    },
    layouts: {
      hero: {
        layout: 'minimal',
        alignment: 'center',
        backgroundType: 'solid'
      },
      sections: {
        spacing: 'compact',
        maxWidth: 'container'
      },
      cards: {
        style: 'minimal',
        spacing: 'tight'
      }
    }
  },
  {
    id: 'warm-community',
    name: 'Warm Community',
    description: 'Welcoming design with warm colors and friendly typography',
    previewImage: '/themes/warm-community.jpg',
    styles: {
      colors: {
        primary: '#dc2626',
        secondary: '#ef4444',
        accent: '#f97316',
        background: '#ffffff',
        surface: '#fef2f2',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Nunito, sans-serif',
        body: 'Nunito Sans, sans-serif'
      },
      spacing: {
        container: '1180px',
        section: '100px'
      },
      borderRadius: '14px',
      shadows: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        button: '0 2px 4px 0 rgb(0 0 0 / 0.06)'
      }
    },
    layouts: {
      hero: {
        layout: 'centered',
        alignment: 'center',
        backgroundType: 'gradient'
      },
      sections: {
        spacing: 'normal',
        maxWidth: 'container'
      },
      cards: {
        style: 'elevated',
        spacing: 'normal'
      }
    }
  },
  {
    id: 'professional-corporate',
    name: 'Professional Corporate',
    description: 'Business-like professional design for prestigious institutions',
    previewImage: '/themes/professional-corporate.jpg',
    styles: {
      colors: {
        primary: '#1f2937',
        secondary: '#374151',
        accent: '#3b82f6',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'IBM Plex Sans, sans-serif',
        body: 'IBM Plex Sans, sans-serif'
      },
      spacing: {
        container: '1200px',
        section: '80px'
      },
      borderRadius: '6px',
      shadows: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        button: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
      }
    },
    layouts: {
      hero: {
        layout: 'split',
        alignment: 'left',
        backgroundType: 'image'
      },
      sections: {
        spacing: 'compact',
        maxWidth: 'container'
      },
      cards: {
        style: 'bordered',
        spacing: 'tight'
      }
    }
  },
  {
    id: 'artistic-creative',
    name: 'Artistic Creative',
    description: 'Creative and artistic design for arts-focused institutions',
    previewImage: '/themes/artistic-creative.jpg',
    styles: {
      colors: {
        primary: '#9333ea',
        secondary: '#a855f7',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#faf5ff',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Abril Fatface, cursive',
        body: 'Karla, sans-serif'
      },
      spacing: {
        container: '1240px',
        section: '150px'
      },
      borderRadius: '24px',
      shadows: {
        card: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        button: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      }
    },
    layouts: {
      hero: {
        layout: 'overlay',
        alignment: 'center',
        backgroundType: 'gradient'
      },
      sections: {
        spacing: 'spacious',
        maxWidth: 'full'
      },
      cards: {
        style: 'elevated',
        spacing: 'loose'
      }
    }
  },
  {
    id: 'sports-athletic',
    name: 'Sports Athletic',
    description: 'Dynamic design for sports-focused educational institutions',
    previewImage: '/themes/sports-athletic.jpg',
    styles: {
      colors: {
        primary: '#dc2626',
        secondary: '#991b1b',
        accent: '#fbbf24',
        background: '#ffffff',
        surface: '#fef2f2',
        text: '#1f2937',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Oswald, sans-serif',
        body: 'Source Sans Pro, sans-serif'
      },
      spacing: {
        container: '1300px',
        section: '120px'
      },
      borderRadius: '10px',
      shadows: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        button: '0 4px 14px 0 rgb(0 0 0 / 0.39)'
      }
    },
    layouts: {
      hero: {
        layout: 'overlay',
        alignment: 'left',
        backgroundType: 'image'
      },
      sections: {
        spacing: 'normal',
        maxWidth: 'container'
      },
      cards: {
        style: 'elevated',
        spacing: 'normal'
      }
    }
  },
  {
    id: 'elegant-luxury',
    name: 'Elegant Luxury',
    description: 'Premium luxury design for high-end educational institutions',
    previewImage: '/themes/elegant-luxury.jpg',
    styles: {
      colors: {
        primary: '#000000',
        secondary: '#374151',
        accent: '#d4af37',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#111827',
        textSecondary: '#6b7280'
      },
      fonts: {
        heading: 'Cormorant Garamond, serif',
        body: 'Source Sans Pro, sans-serif'
      },
      spacing: {
        container: '1100px',
        section: '160px'
      },
      borderRadius: '2px',
      shadows: {
        card: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        button: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
      }
    },
    layouts: {
      hero: {
        layout: 'minimal',
        alignment: 'center',
        backgroundType: 'solid'
      },
      sections: {
        spacing: 'spacious',
        maxWidth: 'narrow'
      },
      cards: {
        style: 'minimal',
        spacing: 'loose'
      }
    }
  }
];

export const getThemeById = (id: string): Theme | undefined => {
  return themes.find(theme => theme.id === id);
};

export const getThemeStyles = (themeId: string) => {
  const theme = getThemeById(themeId);
  if (!theme) return null;

  return {
    '--color-primary': theme.styles.colors.primary,
    '--color-secondary': theme.styles.colors.secondary,
    '--color-accent': theme.styles.colors.accent,
    '--color-background': theme.styles.colors.background,
    '--color-surface': theme.styles.colors.surface,
    '--color-text': theme.styles.colors.text,
    '--color-text-secondary': theme.styles.colors.textSecondary,
    '--font-heading': theme.styles.fonts.heading,
    '--font-body': theme.styles.fonts.body,
    '--container-max-width': theme.styles.spacing.container,
    '--section-padding': theme.styles.spacing.section,
    '--border-radius': theme.styles.borderRadius,
    '--shadow-card': theme.styles.shadows.card,
    '--shadow-button': theme.styles.shadows.button,
  } as React.CSSProperties;
};

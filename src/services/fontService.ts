import { FontOption } from '@/types';

class FontService {
  private googleFonts: FontOption[] = [];
  private systemFonts: FontOption[] = [];
  private customFonts: FontOption[] = [];
  private loadedFonts = new Set<string>();

  constructor() {
    this.initializeSystemFonts();
    this.initializeGoogleFonts();
  }

  private initializeSystemFonts() {
    this.systemFonts = [
      {
        id: 'system-arial',
        name: 'Arial',
        family: 'Arial, sans-serif',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'system-helvetica',
        name: 'Helvetica',
        family: 'Helvetica, Arial, sans-serif',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'system-times',
        name: 'Times New Roman',
        family: 'Times, "Times New Roman", serif',
        category: 'serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'system-georgia',
        name: 'Georgia',
        family: 'Georgia, serif',
        category: 'serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'system-courier',
        name: 'Courier New',
        family: '"Courier New", Courier, monospace',
        category: 'monospace',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'system-verdana',
        name: 'Verdana',
        family: 'Verdana, sans-serif',
        category: 'sans-serif',
        variants: ['400', '700'],
        subsets: ['latin'],
        source: 'system',
        preview: 'The quick brown fox jumps over the lazy dog'
      }
    ];
  }

  private initializeGoogleFonts() {
    // Popular Google Fonts for educational websites
    this.googleFonts = [
      {
        id: 'google-inter',
        name: 'Inter',
        family: 'Inter, sans-serif',
        category: 'sans-serif',
        variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-roboto',
        name: 'Roboto',
        family: 'Roboto, sans-serif',
        category: 'sans-serif',
        variants: ['100', '300', '400', '500', '700', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-poppins',
        name: 'Poppins',
        family: 'Poppins, sans-serif',
        category: 'sans-serif',
        variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-opensans',
        name: 'Open Sans',
        family: '"Open Sans", sans-serif',
        category: 'sans-serif',
        variants: ['300', '400', '500', '600', '700', '800'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-lato',
        name: 'Lato',
        family: 'Lato, sans-serif',
        category: 'sans-serif',
        variants: ['100', '300', '400', '700', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-montserrat',
        name: 'Montserrat',
        family: 'Montserrat, sans-serif',
        category: 'sans-serif',
        variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-playfair',
        name: 'Playfair Display',
        family: '"Playfair Display", serif',
        category: 'serif',
        variants: ['400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-merriweather',
        name: 'Merriweather',
        family: 'Merriweather, serif',
        category: 'serif',
        variants: ['300', '400', '700', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-crimson',
        name: 'Crimson Text',
        family: '"Crimson Text", serif',
        category: 'serif',
        variants: ['400', '600', '700'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-lora',
        name: 'Lora',
        family: 'Lora, serif',
        category: 'serif',
        variants: ['400', '500', '600', '700'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-sourcesans',
        name: 'Source Sans Pro',
        family: '"Source Sans Pro", sans-serif',
        category: 'sans-serif',
        variants: ['200', '300', '400', '600', '700', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600;700;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-nunito',
        name: 'Nunito',
        family: 'Nunito, sans-serif',
        category: 'sans-serif',
        variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-raleway',
        name: 'Raleway',
        family: 'Raleway, sans-serif',
        category: 'sans-serif',
        variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-dancing',
        name: 'Dancing Script',
        family: '"Dancing Script", cursive',
        category: 'handwriting',
        variants: ['400', '500', '600', '700'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      },
      {
        id: 'google-pacifico',
        name: 'Pacifico',
        family: 'Pacifico, cursive',
        category: 'handwriting',
        variants: ['400'],
        subsets: ['latin', 'latin-ext'],
        source: 'google',
        url: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
        preview: 'The quick brown fox jumps over the lazy dog'
      }
    ];
  }

  getAllFonts(): FontOption[] {
    return [...this.systemFonts, ...this.googleFonts, ...this.customFonts];
  }

  getFontsByCategory(category: string): FontOption[] {
    return this.getAllFonts().filter(font => font.category === category);
  }

  getFontsBySource(source: string): FontOption[] {
    return this.getAllFonts().filter(font => font.source === source);
  }

  getFontById(id: string): FontOption | undefined {
    return this.getAllFonts().find(font => font.id === id);
  }

  async loadFont(fontId: string): Promise<void> {
    if (this.loadedFonts.has(fontId)) return;

    const font = this.getFontById(fontId);
    if (!font || font.source === 'system') return;

    if (font.source === 'google' && font.url) {
      await this.loadGoogleFont(font);
    } else if (font.source === 'custom' && font.url) {
      await this.loadCustomFont(font);
    }

    this.loadedFonts.add(fontId);
  }

  private async loadGoogleFont(font: FontOption): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href="${font.url}"]`);
      if (existingLink) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = font.url!;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load font: ${font.name}`));
      
      document.head.appendChild(link);
    });
  }

  private async loadCustomFont(font: FontOption): Promise<void> {
    return new Promise((resolve, reject) => {
      const fontFace = new FontFace(font.name, `url(${font.url})`);
      
      fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve();
      }).catch((error) => {
        reject(new Error(`Failed to load custom font: ${font.name}`));
      });
    });
  }

  applyFont(fontId: string, target: 'body' | 'heading' | 'all' = 'all'): void {
    const font = this.getFontById(fontId);
    if (!font) return;

    this.loadFont(fontId).then(() => {
      const root = document.documentElement;
      
      switch (target) {
        case 'body':
          root.style.setProperty('--school-brand-font-family', font.family);
          break;
        case 'heading':
          root.style.setProperty('--school-brand-heading-font-family', font.family);
          break;
        case 'all':
          root.style.setProperty('--school-brand-font-family', font.family);
          root.style.setProperty('--school-brand-heading-font-family', font.family);
          break;
      }
    }).catch((error) => {
      console.error('Failed to apply font:', error);
    });
  }

  previewFont(fontId: string, element?: HTMLElement): void {
    const font = this.getFontById(fontId);
    if (!font) return;

    this.loadFont(fontId).then(() => {
      const targetElement = element || document.body;
      targetElement.style.fontFamily = font.family;
    }).catch((error) => {
      console.error('Failed to preview font:', error);
    });
  }

  resetFont(target: 'body' | 'heading' | 'all' = 'all'): void {
    const root = document.documentElement;
    
    switch (target) {
      case 'body':
        root.style.removeProperty('--school-brand-font-family');
        break;
      case 'heading':
        root.style.removeProperty('--school-brand-heading-font-family');
        break;
      case 'all':
        root.style.removeProperty('--school-brand-font-family');
        root.style.removeProperty('--school-brand-heading-font-family');
        break;
    }
  }

  addCustomFont(font: Omit<FontOption, 'id' | 'source'>): string {
    const id = `custom-${Date.now()}`;
    const customFont: FontOption = {
      ...font,
      id,
      source: 'custom'
    };
    
    this.customFonts.push(customFont);
    return id;
  }

  removeCustomFont(fontId: string): boolean {
    const index = this.customFonts.findIndex(font => font.id === fontId);
    if (index === -1) return false;
    
    this.customFonts.splice(index, 1);
    this.loadedFonts.delete(fontId);
    return true;
  }

  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }
}

export const fontService = new FontService();
export default fontService;

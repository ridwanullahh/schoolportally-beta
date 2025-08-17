import { Font } from '@/types';

export const fontService = {
  // Get all available fonts
  getFonts: async (): Promise<Font[]> => {
    try {
      const response = await fetch('/api/fonts');
      if (!response.ok) {
        throw new Error('Failed to fetch fonts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fonts:', error);
      return [];
    }
  },

  // Get font by ID
  getFontById: async (id: string): Promise<Font | null> => {
    try {
      const response = await fetch(`/api/fonts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch font');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching font:', error);
      return null;
    }
  },

  // Create new font
  createFont: async (font: Omit<Font, 'id' | 'createdAt' | 'updatedAt'>): Promise<Font> => {
    try {
      const response = await fetch('/api/fonts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(font),
      });
      if (!response.ok) {
        throw new Error('Failed to create font');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating font:', error);
      throw error;
    }
  },

  // Update font
  updateFont: async (id: string, font: Partial<Font>): Promise<Font> => {
    try {
      const response = await fetch(`/api/fonts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(font),
      });
      if (!response.ok) {
        throw new Error('Failed to update font');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating font:', error);
      throw error;
    }
  },

  // Delete font
  deleteFont: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/fonts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete font');
      }
    } catch (error) {
      console.error('Error deleting font:', error);
      throw error;
    }
  },

  // Get default fonts
  getDefaultFonts: (): Font[] => {
    return [
      {
        id: 'inter',
        name: 'Inter',
        family: 'Inter, system-ui, sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'medium', 'semibold', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'roboto',
        name: 'Roboto',
        family: 'Roboto, sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'medium', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'open-sans',
        name: 'Open Sans',
        family: '"Open Sans", sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'semibold', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'lato',
        name: 'Lato',
        family: 'Lato, sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'montserrat',
        name: 'Montserrat',
        family: 'Montserrat, sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'medium', 'semibold', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'poppins',
        name: 'Poppins',
        family: 'Poppins, sans-serif',
        category: 'sans-serif',
        variants: ['regular', 'medium', 'semibold', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'playfair-display',
        name: 'Playfair Display',
        family: '"Playfair Display", serif',
        category: 'serif',
        variants: ['regular', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'merriweather',
        name: 'Merriweather',
        family: 'Merriweather, serif',
        category: 'serif',
        variants: ['regular', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'source-serif-pro',
        name: 'Source Serif Pro',
        family: '"Source Serif Pro", serif',
        category: 'serif',
        variants: ['regular', 'semibold', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'roboto-slab',
        name: 'Roboto Slab',
        family: '"Roboto Slab", serif',
        category: 'serif',
        variants: ['regular', 'bold'],
        url: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap',
        isActive: true,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }
};
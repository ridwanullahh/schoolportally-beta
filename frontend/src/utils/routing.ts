
// Utility functions for handling subdirectory routing
export const getBaseUrl = (): string => {
  return window.location.origin;
};

export const getSchoolSlug = (): string | null => {
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  // Check if we're on a school route (not marketing, platform-admin, etc.)
  if (segments.length > 0 && 
      !segments[0].startsWith('platform-admin') && 
      !segments[0].startsWith('marketing') &&
      segments[0] !== 'login' &&
      segments[0] !== 'signup' &&
      segments[0] !== 'features' &&
      segments[0] !== 'pricing' &&
      segments[0] !== 'about' &&
      segments[0] !== 'blog' &&
      segments[0] !== 'contact') {
    return segments[0];
  }
  
  return null;
};

export const isSchoolRoute = (): boolean => {
  return getSchoolSlug() !== null;
};

export const isPlatformAdminRoute = (): boolean => {
  return window.location.pathname.startsWith('/platform-admin');
};

export const isMarketingRoute = (): boolean => {
  const pathname = window.location.pathname;
  return pathname === '/' || 
         pathname.startsWith('/features') ||
         pathname.startsWith('/pricing') ||
         pathname.startsWith('/about') ||
         pathname.startsWith('/blog') ||
         pathname.startsWith('/contact') ||
         pathname.startsWith('/login') ||
         pathname.startsWith('/signup');
};

export const buildSchoolUrl = (schoolSlug: string, path: string = ''): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}/${schoolSlug}${cleanPath}`;
};

export const buildMarketingUrl = (path: string = ''): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export const buildPlatformAdminUrl = (path: string = ''): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/platform-admin${cleanPath ? `/${cleanPath}` : ''}`;
};

export const redirectToSchoolDashboard = (schoolSlug: string) => {
  window.location.href = buildSchoolUrl(schoolSlug, '/dashboard');
};

export const redirectToSchoolWebsite = (schoolSlug: string) => {
  window.location.href = buildSchoolUrl(schoolSlug);
};

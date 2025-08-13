import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { themeService } from '@/services/themeService';
import '@/themes/styles/breadcrumbs.css';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  homeLabel?: string;
  separator?: 'arrow' | 'slash' | 'chevron' | 'dot';
  styleId?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  homeLabel = 'Home',
  separator = 'arrow',
  styleId
}) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({
        label: homeLabel,
        href: '/',
        isActive: pathSegments.length === 0
      });
    }
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = generateBreadcrumbs();
  
  // Get style from theme service or use provided styleId
  const currentStyleId = styleId || themeService.getBreadcrumbStyle();
  const breadcrumbStyleClass = `breadcrumb-style-${currentStyleId}`;

  if (breadcrumbItems.length <= 1 && !showHome) {
    return null;
  }

  return (
    <div className={breadcrumbStyleClass}>
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="breadcrumb-item">
                {item.href && !item.isActive ? (
                  <Link to={item.href} className="breadcrumb-link">
                    {index === 0 && showHome && (
                      <Home size={14} className="inline mr-1" />
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb-current">
                    {index === 0 && showHome && (
                      <Home size={14} className="inline mr-1" />
                    )}
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

// Specific breadcrumb components for different page types
export const BlogBreadcrumb: React.FC<{ postTitle?: string }> = ({ postTitle }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' }
  ];
  
  if (postTitle) {
    items.push({ label: postTitle, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const EventBreadcrumb: React.FC<{ eventTitle?: string }> = ({ eventTitle }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' }
  ];
  
  if (eventTitle) {
    items.push({ label: eventTitle, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const NewsBreadcrumb: React.FC<{ newsTitle?: string }> = ({ newsTitle }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'News', href: '/news' }
  ];
  
  if (newsTitle) {
    items.push({ label: newsTitle, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const GalleryBreadcrumb: React.FC<{ albumTitle?: string }> = ({ albumTitle }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Gallery', href: '/gallery' }
  ];
  
  if (albumTitle) {
    items.push({ label: albumTitle, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const AcademicsBreadcrumb: React.FC<{ 
  programName?: string; 
  courseName?: string; 
}> = ({ programName, courseName }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Academics', href: '/academics' }
  ];
  
  if (programName) {
    items.push({ 
      label: programName, 
      href: courseName ? `/academics/programs/${programName.toLowerCase().replace(/\s+/g, '-')}` : undefined,
      isActive: !courseName
    });
  }
  
  if (courseName) {
    items.push({ label: courseName, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const AdmissionsBreadcrumb: React.FC<{ 
  section?: string; 
  subsection?: string; 
}> = ({ section, subsection }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Admissions', href: '/admissions' }
  ];
  
  if (section) {
    items.push({ 
      label: section, 
      href: subsection ? `/admissions/${section.toLowerCase().replace(/\s+/g, '-')}` : undefined,
      isActive: !subsection
    });
  }
  
  if (subsection) {
    items.push({ label: subsection, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const AboutBreadcrumb: React.FC<{ 
  section?: string; 
}> = ({ section }) => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ];
  
  if (section) {
    items.push({ label: section, isActive: true });
  }
  
  return <Breadcrumb items={items} showHome={false} />;
};

export const ContactBreadcrumb: React.FC = () => {
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Contact', isActive: true }
  ];
  
  return <Breadcrumb items={items} showHome={false} />;
};

// Higher-order component to automatically add breadcrumbs to pages
export const withBreadcrumb = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  breadcrumbItems?: BreadcrumbItem[]
) => {
  return (props: P) => (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <WrappedComponent {...props} />
    </>
  );
};

export default Breadcrumb;

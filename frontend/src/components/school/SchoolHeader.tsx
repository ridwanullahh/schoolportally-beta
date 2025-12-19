
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { usePages } from '@/hooks/usePages';


interface SchoolHeaderProps {
  school: School;
  pages: Page[];
}

const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school, pages: initialPages }) => {
  const { schoolSlug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pages: dynamicPages, loading } = usePages();

  const [allPages, setAllPages] = useState(initialPages);

  useEffect(() => {
    if (dynamicPages.length > 0) {
      setAllPages(dynamicPages);
    }
  }, [dynamicPages]);

  const navigationPages = allPages.filter(page => page.showOnHeader && page.status === 'published');
  
  // Get header style from school branding or theme, default to style 1
  const getHeaderStyle = () => {
    const styleFromBranding = school?.branding?.headerStyle;
    if (styleFromBranding) {
      // Ensure it's in the format header-style-X
      return styleFromBranding.startsWith('header-style-') 
        ? styleFromBranding 
        : `header-style-${styleFromBranding}`;
    }
    return 'header-style-1';
  };
  
  const headerStyle = getHeaderStyle();
  
  const getPageUrl = (page: Page) => {
    if (page.type === 'homepage') return `/${schoolSlug}`;
    return `/${schoolSlug}/${page.slug}`;
  };

  const renderHeaderContent = () => {
    switch (headerStyle) {
      case 'header-style-4':
        return (
          <>
            <div className="top-bar">
              <div className="contact-info">
                {school.phone && (
                  <span className="contact-item">
                    <Phone className="h-4 w-4" />
                    {school.phone}
                  </span>
                )}
                {school.email && (
                  <span className="contact-item">
                    <Mail className="h-4 w-4" />
                    {school.email}
                  </span>
                )}
              </div>
              <div className="quick-links">
                <Link to={`/${schoolSlug}/portal`} className="quick-link">Student Portal</Link>
                <Link to={`/${schoolSlug}/apply`} className="quick-link">Apply Now</Link>
              </div>
            </div>
            <div className="main-header">
              <Link to={`/${schoolSlug}`} className="logo">
                {school.branding?.logoUrl ? (
                  <>
                    <img src={school.branding.logoUrl} alt={school.name} />
                    <span>{school.name}</span>
                  </>
                ) : (
                  <span>{school.name}</span>
                )}
              </Link>
              <nav className="nav-links hidden md:flex">
                {navigationPages.map((page) => (
                  <Link key={page.id} to={getPageUrl(page)} className="nav-link">
                    {page.title}
                  </Link>
                ))}
              </nav>
              <div className="header-actions hidden md:flex">
                <Link to={`/${schoolSlug}/apply`} className="btn-outline">Apply Now</Link>
                <Link to={`/${schoolSlug}/portal`} className="btn-primary">Portal Login</Link>
              </div>
              <button className="nav-toggle md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </>
        );

      case 'header-style-5':
        return (
          <div className="container">
            <Link to={`/${schoolSlug}`} className="logo">
              {school.branding?.logoUrl ? (
                <>
                  <img src={school.branding.logoUrl} alt={school.name} />
                  <span>{school.name}</span>
                </>
              ) : (
                <span>{school.name}</span>
              )}
            </Link>
            <nav className="nav-links">
              {navigationPages.map((page) => (
                <Link key={page.id} to={getPageUrl(page)} className="nav-link">
                  {page.title}
                </Link>
              ))}
            </nav>
            <div className="header-actions">
              <Link to={`/${schoolSlug}/apply`} className="btn-outline">Apply Now</Link>
              <Link to={`/${schoolSlug}/portal`} className="btn-primary">Portal Login</Link>
            </div>
          </div>
        );

      case 'header-style-6':
        return (
          <>
            <div className="container">
              <Link to={`/${schoolSlug}`} className="logo">
                {school.branding?.logoUrl ? (
                  <>
                    <img src={school.branding.logoUrl} alt={school.name} />
                    <span>{school.name}</span>
                  </>
                ) : (
                  <span>{school.name}</span>
                )}
              </Link>
              <button className="nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className={`nav-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
              <nav className="nav-links">
                {navigationPages.map((page) => (
                  <Link key={page.id} to={getPageUrl(page)} className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                    {page.title}
                  </Link>
                ))}
              </nav>
              <div className="header-actions">
                <Link to={`/${schoolSlug}/apply`} className="btn-outline">Apply Now</Link>
                <Link to={`/${schoolSlug}/portal`} className="btn-primary">Portal Login</Link>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="container">
            <Link to={`/${schoolSlug}`} className="logo">
              {school.branding?.logoUrl ? (
                <>
                  <img src={school.branding.logoUrl} alt={school.name} />
                  <span>{school.name}</span>
                </>
              ) : (
                <span>{school.name}</span>
              )}
            </Link>
            <nav className="nav-links hidden md:flex">
              {navigationPages.map((page) => (
                <Link key={page.id} to={getPageUrl(page)} className="nav-link">
                  {page.title}
                </Link>
              ))}
            </nav>
            <div className="header-actions hidden md:flex">
              <Link to={`/${schoolSlug}/apply`} className="btn-outline">Apply Now</Link>
              <Link to={`/${schoolSlug}/portal`} className="btn-primary">Portal Login</Link>
            </div>
            <button className="nav-toggle md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        );
    }
  };

  return (
    <header className={`school-header sticky top-0 z-50 ${headerStyle}`}>
      {renderHeaderContent()}

      {/* Mobile Menu for non-sidebar styles */}
      {mobileMenuOpen && !['header-style-6'].includes(headerStyle) && (
        <div className="mobile-menu md:hidden">
          <nav className="mobile-nav">
            {navigationPages.map((page) => (
              <Link
                key={page.id}
                to={getPageUrl(page)}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {page.title}
              </Link>
            ))}
            <div className="mobile-actions">
              <Link to={`/${schoolSlug}/apply`} className="btn-outline">Apply Now</Link>
              <Link to={`/${schoolSlug}/portal`} className="btn-primary">Portal Login</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SchoolHeader;

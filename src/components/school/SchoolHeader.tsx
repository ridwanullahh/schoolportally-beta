
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/headers.css';

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
  const headerStyle = school?.branding?.headerStyle || 'header-style-1';
  
  const getPageUrl = (page: Page) => {
    if (page.type === 'homepage') return `/${schoolSlug}`;
    return `/${schoolSlug}/${page.slug}`;
  };

  return (
    <header className={`sticky top-0 z-50 ${headerStyle}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to={`/${schoolSlug}`} className="flex items-center space-x-3">
            {school.branding?.logoUrl ? (
              <img src={school.branding.logoUrl} alt={school.name} className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-xl font-bold">{school.name}</span>
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigationPages.map((page) => (
              <Link key={page.id} to={getPageUrl(page)} className="nav-link">
                {page.title}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline">Apply Now</Button>
            <Button>Portal Login</Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationPages.map((page) => (
                <Link key={page.id} to={getPageUrl(page)} className="nav-link-mobile" onClick={() => setMobileMenuOpen(false)}>
                  {page.title}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full">Apply Now</Button>
                <Button className="w-full">Portal Login</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default SchoolHeader;

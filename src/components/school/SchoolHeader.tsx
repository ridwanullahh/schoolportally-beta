
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface SchoolHeaderProps {
  school: School;
  pages: Page[];
}

const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school, pages }) => {
  const { schoolSlug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationPages = pages.filter(page => 
    ['homepage', 'about', 'programs', 'classes', 'admissions', 'contact', 'blog', 'events'].includes(page.type)
  );

  const getPageUrl = (page: Page) => {
    if (page.type === 'homepage') return `/${schoolSlug}`;
    return `/${schoolSlug}/${page.slug}`;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to={`/${schoolSlug}`} className="flex items-center space-x-3">
            {school.logo && (
              <img src={school.logo} alt={school.name} className="h-10 w-10 object-contain" />
            )}
            <span className="text-xl font-bold" style={{ color: 'var(--primary-color)' }}>
              {school.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationPages.map((page) => (
              <Link
                key={page.id}
                to={getPageUrl(page)}
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to={`/${schoolSlug}/admissions`}>
              <Button variant="outline">Apply Now</Button>
            </Link>
            <Link to={`/${schoolSlug}/dashboard`}>
              <Button>Portal Login</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationPages.map((page) => (
                <Link
                  key={page.id}
                  to={getPageUrl(page)}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {page.title}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link to={`/${schoolSlug}/admissions`}>
                  <Button variant="outline" className="w-full">Apply Now</Button>
                </Link>
                <Link to={`/${schoolSlug}/dashboard`}>
                  <Button className="w-full">Portal Login</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default SchoolHeader;

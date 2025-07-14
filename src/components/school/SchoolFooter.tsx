
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { MapPin, Phone, Mail } from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/footers.css';

interface SchoolFooterProps {
  school: School;
}

const SchoolFooter: React.FC<SchoolFooterProps> = ({ school }) => {
  const { schoolSlug } = useParams();
  const { pages } = usePages();

  const footerPages = pages.filter(page => page.showOnFooter && page.status === 'published');
  const footerStyle = school?.branding?.footerStyle || 'footer-style-1';
  
  const getPageUrl = (page: Page) => {
    if (page.type === 'homepage') return `/${schoolSlug}`;
    return `/${schoolSlug}/${page.slug}`;
  };

  return (
    <footer className={footerStyle}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {school.branding?.logoUrl && (
                <img src={school.branding.logoUrl} alt={school.name} className="h-10 w-10 object-contain" />
              )}
              <span className="text-xl font-bold">{school.name}</span>
            </div>
            <p className="mb-4">
              Providing quality education and nurturing future leaders.
            </p>
            <div className="space-y-2">
              {school.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{school.address}</span>
                </div>
              )}
              {school.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{school.phone}</span>
                </div>
              )}
              {school.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{school.email}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerPages.map(page => (
                <li key={page.id}>
                  <Link to={getPageUrl(page)} className="hover:text-white">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {/* Add resource links here if needed */}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p>
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SchoolFooter;

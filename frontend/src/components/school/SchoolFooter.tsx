
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { MapPin, Phone, Mail } from 'lucide-react';
import { usePages } from '@/hooks/usePages';



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

  const quickLinks = footerPages.slice(0, 6);
  const resourceLinks = [
    { title: 'Student Portal', url: `/${schoolSlug}/portal` },
    { title: 'Parent Portal', url: `/${schoolSlug}/parent-portal` },
    { title: 'Staff Portal', url: `/${schoolSlug}/staff-portal` },
    { title: 'Online Library', url: `/${schoolSlug}/library` },
    { title: 'Academic Calendar', url: `/${schoolSlug}/calendar` },
    { title: 'Contact Us', url: `/${schoolSlug}/contact` }
  ];

  const renderFooterContent = () => {
    switch (footerStyle) {
      case 'footer-style-4':
        return (
          <div className="footer-container">
            <Link to={`/${schoolSlug}`} className="brand-logo">
              {school.branding?.logoUrl && (
                <img src={school.branding.logoUrl} alt={school.name} />
              )}
              <span>{school.name}</span>
            </Link>
            <p className="brand-description">
              Providing quality education and nurturing future leaders in a supportive and innovative learning environment.
            </p>
            <div className="footer-links">
              {quickLinks.map(page => (
                <Link key={page.id} to={getPageUrl(page)} className="footer-link">
                  {page.title}
                </Link>
              ))}
            </div>
            <div className="contact-info">
              {school.address && (
                <div className="contact-item">
                  <MapPin className="h-4 w-4" />
                  <span>{school.address}</span>
                </div>
              )}
              {school.phone && (
                <div className="contact-item">
                  <Phone className="h-4 w-4" />
                  <span>{school.phone}</span>
                </div>
              )}
              {school.email && (
                <div className="contact-item">
                  <Mail className="h-4 w-4" />
                  <span>{school.email}</span>
                </div>
              )}
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            </div>
          </div>
        );

      case 'footer-style-5':
        return (
          <>
            <div className="footer-top">
              <div className="footer-container">
                <div className="footer-main">
                  <div className="footer-brand">
                    <Link to={`/${schoolSlug}`} className="brand-logo">
                      {school.branding?.logoUrl && (
                        <img src={school.branding.logoUrl} alt={school.name} />
                      )}
                      <span>{school.name}</span>
                    </Link>
                    <p className="brand-description">
                      Providing quality education and nurturing future leaders in a supportive and innovative learning environment.
                    </p>
                    <div className="contact-info">
                      {school.address && (
                        <div className="contact-item">
                          <MapPin className="h-4 w-4" />
                          <span>{school.address}</span>
                        </div>
                      )}
                      {school.phone && (
                        <div className="contact-item">
                          <Phone className="h-4 w-4" />
                          <span>{school.phone}</span>
                        </div>
                      )}
                      {school.email && (
                        <div className="contact-item">
                          <Mail className="h-4 w-4" />
                          <span>{school.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="footer-section">
                    <h3>Quick Links</h3>
                    <div className="footer-links">
                      {quickLinks.map(page => (
                        <Link key={page.id} to={getPageUrl(page)} className="footer-link">
                          {page.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="footer-section">
                    <h3>Resources</h3>
                    <div className="footer-links">
                      {resourceLinks.map(link => (
                        <Link key={link.title} to={link.url} className="footer-link">
                          {link.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="footer-section">
                    <h3>Connect</h3>
                    <p className="brand-description">
                      Stay connected with our school community and get the latest updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-bottom-section">
              <div className="footer-container">
                <div className="footer-bottom">
                  <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
                </div>
              </div>
            </div>
          </>
        );

      case 'footer-style-6':
        return (
          <div className="footer-container">
            <div className="footer-main">
              <div className="footer-card">
                <h3>About {school.name}</h3>
                <p className="brand-description">
                  Providing quality education and nurturing future leaders in a supportive and innovative learning environment.
                </p>
                <div className="contact-info">
                  {school.address && (
                    <div className="contact-item">
                      <MapPin className="h-4 w-4" />
                      <span>{school.address}</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="contact-item">
                      <Phone className="h-4 w-4" />
                      <span>{school.phone}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="contact-item">
                      <Mail className="h-4 w-4" />
                      <span>{school.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="footer-card">
                <h3>Quick Links</h3>
                <div className="footer-links">
                  {quickLinks.map(page => (
                    <Link key={page.id} to={getPageUrl(page)} className="footer-link">
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="footer-card">
                <h3>Resources</h3>
                <div className="footer-links">
                  {resourceLinks.slice(0, 4).map(link => (
                    <Link key={link.title} to={link.url} className="footer-link">
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="footer-container">
            <div className="footer-main">
              <div className="footer-brand">
                <Link to={`/${schoolSlug}`} className="brand-logo">
                  {school.branding?.logoUrl && (
                    <img src={school.branding.logoUrl} alt={school.name} />
                  )}
                  <span>{school.name}</span>
                </Link>
                <p className="brand-description">
                  Providing quality education and nurturing future leaders in a supportive and innovative learning environment.
                </p>
                <div className="contact-info">
                  {school.address && (
                    <div className="contact-item">
                      <MapPin className="h-4 w-4" />
                      <span>{school.address}</span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="contact-item">
                      <Phone className="h-4 w-4" />
                      <span>{school.phone}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="contact-item">
                      <Mail className="h-4 w-4" />
                      <span>{school.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="footer-section">
                <h3>Quick Links</h3>
                <div className="footer-links">
                  {quickLinks.map(page => (
                    <Link key={page.id} to={getPageUrl(page)} className="footer-link">
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="footer-section">
                <h3>Resources</h3>
                <div className="footer-links">
                  {resourceLinks.slice(0, 4).map(link => (
                    <Link key={link.title} to={link.url} className="footer-link">
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="footer-section">
                <h3>Connect</h3>
                <p className="brand-description">
                  Stay connected with our school community and get the latest updates.
                </p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <footer className={`school-footer ${footerStyle}`}>
      {renderFooterContent()}
    </footer>
  );
};

export default SchoolFooter;

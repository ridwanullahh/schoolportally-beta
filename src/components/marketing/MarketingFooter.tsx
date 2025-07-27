import React from 'react';
import { Link } from 'react-router-dom';

const MarketingFooter = () => {
  const sections = [
    {
      title: 'Product',
      links: [
        { href: '/features', label: 'Features' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/blog', label: 'Blog' },
        { href: '/support', label: 'Support' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' },
        { href: '/careers', label: 'Careers' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-of-service', label: 'Terms of Service' },
      ],
    },
  ];

  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold text-primary">
              SchoolPortally
            </Link>
            <p className="mt-2 text-sm">
              The all-in-one platform for modern educational institutions.
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SchoolPortally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
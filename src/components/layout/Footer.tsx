import React from 'react';
import { usePages } from '@/hooks/usePages';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';


export const Footer = () => {
    const { school } = useSchool();
    const { pages, loading } = usePages();

    const footerPages = pages.filter(p => p.showOnFooter && p.status === 'published');
    const footerStyle = school?.branding?.footerStyle || 'footer-style-1';

    const renderFooterContent = () => {
        const currentYear = new Date().getFullYear();
        const schoolName = school?.name || 'School Portal';

        // Common footer sections
        const aboutSection = (
            <div className="footer-section">
                <h3>About {schoolName}</h3>
                <p>Empowering students to excel through quality education and innovative learning experiences.</p>
                <div className="contact-info">
                    <div className="contact-item">
                        <Mail size={16} />
                        <span>{school?.email || 'info@school.edu'}</span>
                    </div>
                    <div className="contact-item">
                        <Phone size={16} />
                        <span>{school?.phone || '+1 (555) 123-4567'}</span>
                    </div>
                    <div className="contact-item">
                        <MapPin size={16} />
                        <span>{school?.address || '123 Education St, Learning City'}</span>
                    </div>
                </div>
            </div>
        );

        const quickLinksSection = (
            <div className="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    {loading ? (
                        <li>Loading...</li>
                    ) : (
                        footerPages.map(page => (
                            <li key={page.id}>
                                <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        );

        const academicsSection = (
            <div className="footer-section">
                <h3>Academics</h3>
                <ul>
                    <li><Link to={`/${school?.slug}/programs`}>Programs</Link></li>
                    <li><Link to={`/${school?.slug}/classes`}>Classes</Link></li>
                    <li><Link to={`/${school?.slug}/courses`}>Courses</Link></li>
                    <li><Link to={`/${school?.slug}/faculty`}>Faculty</Link></li>
                </ul>
            </div>
        );

        const resourcesSection = (
            <div className="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li><Link to={`/${school?.slug}/library`}>Library</Link></li>
                    <li><Link to={`/${school?.slug}/events`}>Events</Link></li>
                    <li><Link to={`/${school?.slug}/blog`}>News & Blog</Link></li>
                    <li><Link to={`/${school?.slug}/gallery`}>Gallery</Link></li>
                </ul>
            </div>
        );

        const socialLinks = (
            <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                    <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                    <Twitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                    <Instagram size={20} />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                    <Linkedin size={20} />
                </a>
            </div>
        );

        const copyrightText = `© ${currentYear} ${schoolName}. All rights reserved.`;

        // Special layouts for specific styles
        if (footerStyle === 'footer-style-3') {
            return (
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-logo">{schoolName}</div>
                        <ul className="footer-links">
                            {footerPages.map(page => (
                                <li key={page.id}>
                                    <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                                </li>
                            ))}
                        </ul>
                        <div className="copyright">{copyrightText}</div>
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-4') {
            return (
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-logo">{schoolName}</div>
                        <ul className="footer-links">
                            {footerPages.map(page => (
                                <li key={page.id}>
                                    <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                                </li>
                            ))}
                        </ul>
                        {socialLinks}
                        <div className="copyright">{copyrightText}</div>
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-6') {
            return (
                <div className="footer-container">
                    <div className="footer-card">
                        <div className="footer-content">
                            {aboutSection}
                            {quickLinksSection}
                            {academicsSection}
                            {resourcesSection}
                        </div>
                        <div className="footer-bottom">
                            {copyrightText}
                        </div>
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-7') {
            return (
                <div className="footer-container">
                    <div className="footer-top">
                        <h3>Stay Connected with {schoolName}</h3>
                        {socialLinks}
                    </div>
                    <div className="footer-main">
                        <div className="footer-content">
                            {aboutSection}
                            {quickLinksSection}
                            {academicsSection}
                            {resourcesSection}
                        </div>
                        <div className="footer-bottom">
                            {copyrightText}
                        </div>
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-9') {
            return (
                <div className="footer-container">
                    <div className="newsletter-section">
                        <h3>Stay Updated</h3>
                        <p>Subscribe to our newsletter for the latest news and updates.</p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email" />
                            <button type="submit">Subscribe</button>
                        </div>
                    </div>
                    <div className="footer-content">
                        {aboutSection}
                        {quickLinksSection}
                        {academicsSection}
                        {resourcesSection}
                    </div>
                    <div className="footer-bottom">
                        {copyrightText}
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-10') {
            return (
                <div className="footer-container">
                    <div className="social-section">
                        <h3>Connect With Us</h3>
                        {socialLinks}
                    </div>
                    <div className="footer-content">
                        {aboutSection}
                        {quickLinksSection}
                        {academicsSection}
                        {resourcesSection}
                    </div>
                    <div className="footer-bottom">
                        {copyrightText}
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-11') {
            return (
                <div className="footer-container">
                    <div className="footer-float">
                        <div className="footer-content">
                            {aboutSection}
                            {quickLinksSection}
                            {academicsSection}
                            {resourcesSection}
                        </div>
                        <div className="footer-bottom">
                            {copyrightText}
                        </div>
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-15') {
            return (
                <div className="footer-container">
                    <div className="footer-content">
                        {aboutSection}
                        {quickLinksSection}
                        {academicsSection}
                        {resourcesSection}
                    </div>
                    <div className="footer-bottom">
                        {copyrightText}
                    </div>
                </div>
            );
        }

        if (footerStyle === 'footer-style-16') {
            return (
                <div className="footer-container">
                    <div className="footer-glass">
                        <div className="footer-content">
                            {aboutSection}
                            {quickLinksSection}
                            {academicsSection}
                            {resourcesSection}
                        </div>
                        <div className="footer-bottom">
                            {copyrightText}
                        </div>
                    </div>
                </div>
            );
        }

        // Default layout for most styles
        return (
            <div className="footer-container">
                <div className="footer-content">
                    {aboutSection}
                    {quickLinksSection}
                    {academicsSection}
                    {resourcesSection}
                </div>
                <div className="footer-bottom">
                    {copyrightText}
                </div>
            </div>
        );
    };

    return (
        <footer className={footerStyle}>
            {renderFooterContent()}
        </footer>
    );
};

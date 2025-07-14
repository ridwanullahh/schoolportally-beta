import React from 'react';
import { usePages } from '@/hooks/usePages';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import '@/themes/styles/footers.css';

export const Footer = () => {
    const { school } = useSchool();
    const { pages, loading } = usePages();

    const footerPages = pages.filter(p => p.showOnFooter && p.status === 'published');
    const footerStyle = school?.branding?.footerStyle || 'footer-style-1';

    return (
        <footer className={footerStyle}>
            <div className="container mx-auto footer-container">
                <p className="copyright text-sm text-gray-500">
                    © {new Date().getFullYear()} {school?.name || 'School Portal'}. All rights reserved.
                </p>
                <nav>
                    <ul className="flex gap-4">
                         {loading ? (
                            <p>Loading...</p>
                        ) : (
                            footerPages.map(page => (
                                <li key={page.id}>
                                    <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                                </li>
                            ))
                        )}
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

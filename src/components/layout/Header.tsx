import React from 'react';
import { usePages } from '@/hooks/usePages';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import '@/themes/styles/headers.css';

export const Header = () => {
    const { school } = useSchool();
    const { pages, loading } = usePages();
    
    const headerPages = pages.filter(p => p.showOnHeader && p.status === 'published');
    const headerStyle = school?.branding?.headerStyle || 'header-style-1';

    return (
        <header className={headerStyle}>
            <Link to={`/${school?.slug}`} className="text-xl font-bold">{school?.name || 'School Portal'}</Link>
            <nav className="desktop-nav">
                <ul className="flex gap-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        headerPages.map(page => (
                            <li key={page.id}>
                                <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                            </li>
                        ))
                    )}
                </ul>
            </nav>
            {/* Placeholder for mobile nav toggle */}
            <div className="mobile-nav">
                <button>Menu</button>
            </div>
        </header>
    );
};

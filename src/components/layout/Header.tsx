import React, { useState } from 'react';
import { usePages } from '@/hooks/usePages';
import { useSchool } from '@/contexts/SchoolContext';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';


export const Header = () => {
    const { school } = useSchool();
    const { pages, loading } = usePages();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const headerPages = pages.filter(p => p.showOnHeader && p.status === 'published');
    const headerStyle = school?.branding?.headerStyle || 'header-style-1';

    const renderHeaderContent = () => {
        const logo = (
            <Link
                to={`/${school?.slug}`}
                className="logo text-xl font-bold"
            >
                {school?.name || 'School Portal'}
            </Link>
        );

        const navigation = (
            <nav className="desktop-nav">
                <ul>
                    {loading ? (
                        <li>Loading...</li>
                    ) : (
                        headerPages.map(page => (
                            <li key={page.id}>
                                <Link to={`/${school?.slug}/${page.slug}`}>{page.title}</Link>
                            </li>
                        ))
                    )}
                </ul>
            </nav>
        );

        const mobileNav = (
            <div className="mobile-nav">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        );

        // Special layouts for specific styles
        if (headerStyle === 'header-style-4' || headerStyle === 'header-style-18') {
            return (
                <>
                    {logo}
                    {navigation}
                    {mobileNav}
                </>
            );
        }

        if (headerStyle === 'header-style-6') {
            return (
                <div className="header-container">
                    {logo}
                    {navigation}
                    {mobileNav}
                </div>
            );
        }

        if (headerStyle === 'header-style-8') {
            return (
                <>
                    <div className="top-bar">
                        <span>Welcome to {school?.name}</span>
                    </div>
                    <div className="main-header">
                        {logo}
                        {navigation}
                        {mobileNav}
                    </div>
                </>
            );
        }

        if (headerStyle === 'header-style-11') {
            return (
                <div className="header-card">
                    {logo}
                    {navigation}
                    {mobileNav}
                </div>
            );
        }

        if (headerStyle === 'header-style-14') {
            return (
                <div className="header-box">
                    {logo}
                    {navigation}
                    {mobileNav}
                </div>
            );
        }

        // Default layout for most styles
        return (
            <>
                {logo}
                {navigation}
                {mobileNav}
            </>
        );
    };

    return (
        <header className={headerStyle}>
            {renderHeaderContent()}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="mobile-menu-overlay">
                    <nav className="mobile-menu">
                        <ul>
                            {headerPages.map(page => (
                                <li key={page.id}>
                                    <Link
                                        to={`/${school?.slug}/${page.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};

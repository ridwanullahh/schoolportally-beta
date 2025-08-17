import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';

const MarketingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  const products = [
    { name: 'Student Management', href: '/features#students', description: 'Complete student information system' },
    { name: 'Learning Management', href: '/features#lms', description: 'Islamic-compliant LMS platform' },
    { name: 'Financial Management', href: '/features#finance', description: 'Billing and payment processing' },
    { name: 'Communication Tools', href: '/features#communication', description: 'Parent-school engagement' }
  ];

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground">SchoolPortally</span>
              <div className="text-xs text-muted-foreground -mt-1">Islamic School Management</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button
                className="flex items-center text-muted-foreground hover:text-foreground transition-colors py-2"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isProductsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border p-6"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <Link
                        key={product.name}
                        to={product.href}
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="font-semibold text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.description}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Features
            </Link>
            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Pricing
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Contact
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
              Blog
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <div className="font-semibold text-foreground px-4">Products</div>
                {products.map((product) => (
                  <Link
                    key={product.name}
                    to={product.href}
                    className="block px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
              <Link
                to="/features"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/blog"
                className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <div className="px-4 pt-4 border-t space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default MarketingHeader;
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, Users, ShoppingCart, Search, Filter, ArrowRight, DollarSign, Star, Package, Tag } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/archive-modern.css';
import '@/themes/styles/pages/archive-templates-ultra-modern.css';
import '@/themes/styles/pages/modern-ui-templates.css';

interface Product {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  brand: string;
  specifications: { [key: string]: string };
  features: string[];
  tags: string[];
  rating: number;
  reviews: number;
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
    validUntil?: string;
  } | null;
  shipping: {
    weight: number;
    dimensions: { length: number; width: number; height: number };
    freeShipping: boolean;
    shippingCost: number;
  };
  status: 'active' | 'inactive' | 'discontinued';
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

const ProductsPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const { pages } = usePages();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [categories, setCategories] = useState<string[]>([]);

  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'product-archive-style-1': 'template-style-1',
      'product-archive-style-2': 'template-style-2',
      'product-archive-style-3': 'template-style-3',
      'product-archive-style-4': 'template-style-4',
      'product-archive-style-5': 'template-style-5',
      'product-archive-style-6': 'template-style-6',
      'product-archive-style-7': 'template-style-7',
      'product-archive-style-8': 'template-style-8',
      'product-archive-style-9': 'template-style-9',
      'product-archive-style-10': 'template-style-10',
      'product-archive-style-11': 'template-style-11',
      'product-archive-style-12': 'template-style-12',
      'product-archive-style-13': 'template-style-13',
      'product-archive-style-14': 'template-style-14',
      'product-archive-style-15': 'template-style-15',
    };
    return styleMap[styleId] || 'template-style-1';
  };

  const productArchiveStyle = school?.productArchiveStyle || 'product-archive-style-1';
  const templateStyle = getTemplateStyle(productArchiveStyle);
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      if (school) {
        setLoading(true);
        try {
          const allProducts = await sdk.get<Product>('products');
          const schoolProducts = allProducts.filter((p: Product) =>
            p.schoolId === school.id && p.status === 'active'
          );
          setProducts(schoolProducts);

          const uniqueCategories = Array.from(
            new Set(schoolProducts.map(product => product.category).filter(Boolean))
          );
          setCategories(uniqueCategories);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          setProducts([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProducts();
  }, [school]);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        const price = product.discount 
          ? product.price - (product.discount.type === 'percentage' 
              ? product.price * (product.discount.value / 100)
              : product.discount.value)
          : product.price;
        return price >= min && (max ? price <= max : true);
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const calculateDiscountedPrice = (product: Product) => {
    if (!product.discount) return product.price;
    
    if (product.discount.type === 'percentage') {
      return product.price - (product.price * (product.discount.value / 100));
    } else {
      return product.price - product.discount.value;
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const renderSearchAndFilters = () => (
    <div className="archive-search-bar">
      <div className="search-input-wrapper relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input pl-10"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Categories</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="sort-select"
      >
        <option value="all">All Prices</option>
        <option value="0-25">$0 - $25</option>
        <option value="25-50">$25 - $50</option>
        <option value="50-100">$50 - $100</option>
        <option value="100-">$100+</option>
      </select>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        <option value="name">By Name</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">By Rating</option>
        <option value="newest">Newest First</option>
      </select>
    </div>
  );

  const renderProductCard = (product: Product, index?: number) => {
    const defaultImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
    const productImage = product.images[0] || defaultImage;
    const discountedPrice = calculateDiscountedPrice(product);

    return (
      <article key={product.id} className="post-card">
        <div className="relative">
          <img
            src={productImage}
            alt={product.name}
            className="post-image"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
          {product.discount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              {product.discount.type === 'percentage' ? `${product.discount.value}% OFF` : `$${product.discount.value} OFF`}
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="post-content">
          <div className="post-meta">
            <div className="post-meta-item">
              <Package className="h-4 w-4" />
              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
            <div className="post-meta-item">
              <Star className="h-4 w-4" />
              <span>{product.rating}/5 ({product.reviews})</span>
            </div>
            <div className="post-meta-item">
              <Tag className="h-4 w-4" />
              <span>SKU: {product.sku}</span>
            </div>
          </div>
          <span className="post-category">{product.category}</span>
          <h2 className="post-title">
            <Link to={`/${schoolSlug}/products/${product.id}`}>
              {product.name}
            </Link>
          </h2>
          <p className="post-excerpt">{product.description}</p>
          <div className="product-pricing">
            {product.discount ? (
              <div className="price-container">
                <span className="original-price">{product.currency}{product.price.toFixed(2)}</span>
                <span className="discounted-price">{product.currency}{discountedPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="price">{product.currency}{product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="product-details">
            <p><strong>Brand:</strong> {product.brand}</p>
            {product.shipping.freeShipping && <p><strong>Free Shipping</strong></p>}
          </div>
          <Link to={`/${schoolSlug}/products/${product.id}`} className="read-more">
            View Product <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    );
  };

  if (!school) return <div className="loading-state">Loading...</div>;

  return (
    <div className={`page-template ${templateStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        <div className="archive-header">
          <h1 className="archive-title">School Store</h1>
          <p className="archive-description">
            Browse our collection of school merchandise and educational materials
          </p>
        </div>

        {renderSearchAndFilters()}
        
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {paginatedProducts.map((product, index) => renderProductCard(product, index))}
          </div>
        )}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};

export default ProductsPage;

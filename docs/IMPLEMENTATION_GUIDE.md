# Modern Theme Implementation Guide

## Quick Start

This guide will help you implement the modern theme system in your SchoolPortally project.

## Prerequisites

- React 18+
- TypeScript
- Tailwind CSS (for utility classes)
- SchoolPortally SDK

## Step 1: Install Dependencies

Ensure you have the required dependencies:

```bash
npm install lucide-react
npm install @types/react
```

## Step 2: Import Modern Styles

Add the modern CSS files to your components:

```tsx
// In your component files
import '@/themes/styles/headers-modern.css';
import '@/themes/styles/footers-modern.css';
import '@/themes/styles/pages/single-post-modern.css';
import '@/themes/styles/pages/archive-modern.css';
```

## Step 3: Update Component Structure

### Header Component

```tsx
// src/components/school/SchoolHeader.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/headers.css';
import '@/themes/styles/headers-modern.css';

const SchoolHeader: React.FC<SchoolHeaderProps> = ({ school, pages }) => {
  const { schoolSlug } = useParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerStyle = school?.branding?.headerStyle || 'header-style-1';

  // Component implementation...
  
  return (
    <header className={`school-header sticky top-0 z-50 ${headerStyle}`}>
      {/* Header content */}
    </header>
  );
};
```

### Footer Component

```tsx
// src/components/school/SchoolFooter.tsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, Page } from '@/types';
import { MapPin, Phone, Mail } from 'lucide-react';
import { usePages } from '@/hooks/usePages';
import '@/themes/styles/footers.css';
import '@/themes/styles/footers-modern.css';

const SchoolFooter: React.FC<SchoolFooterProps> = ({ school }) => {
  const footerStyle = school?.branding?.footerStyle || 'footer-style-1';

  return (
    <footer className={`school-footer ${footerStyle}`}>
      {/* Footer content */}
    </footer>
  );
};
```

## Step 4: Update Section Components

### Classes Section with Dynamic Data

```tsx
// src/components/sections/ClassesSection.tsx
import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface ClassItem {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: string;
  time?: string;
  capacity?: number;
  enrolled?: number;
  status: 'active' | 'inactive' | 'completed';
  schoolId: string;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({ section }) => {
  const { title, classesLimit = 6 } = section.content;
  const { school } = useSchool();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allClasses = await sdk.get<ClassItem>('classes');
        const schoolClasses = allClasses
          .filter((classItem: ClassItem) => 
            classItem.schoolId === school.id && 
            classItem.status === 'active'
          )
          .slice(0, classesLimit);
        
        setClasses(schoolClasses);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [school, classesLimit]);

  if (loading) {
    return <div className="loading-state">Loading classes...</div>;
  }

  return (
    <section className="classes-section">
      {/* Section content */}
    </section>
  );
};
```

### Gallery Section with Dynamic Data

```tsx
// src/components/sections/GallerySection.tsx
import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
  uploadedAt: string;
  schoolId: string;
  status: 'active' | 'inactive';
}

const GallerySection: React.FC<GallerySectionProps> = ({ section }) => {
  const { title, imagesLimit = 12 } = section.content;
  const { school } = useSchool();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allImages = await sdk.get<GalleryImage>('gallery');
        const schoolImages = allImages
          .filter((image: GalleryImage) => 
            image.schoolId === school.id && 
            image.status === 'active'
          )
          .slice(0, imagesLimit);
        
        setImages(schoolImages);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [school, imagesLimit]);

  return (
    <section className="gallery-section">
      {/* Section content */}
    </section>
  );
};
```

## Step 5: Update Page Templates

### Blog Post Page

```tsx
// src/pages/school/BlogPost.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import '@/themes/styles/pages/blog-post.css';
import '@/themes/styles/pages/single-post-modern.css';
import { Calendar, Clock, User, Eye } from 'lucide-react';
import { BlogPost } from '@/types';

const BlogPostPage = () => {
  const { postSlug, schoolSlug } = useParams();
  const { school } = useSchool();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const blogPostStyle = school?.blogPostStyle || 'blog-post-style-1';

  // Fetch post and related posts
  useEffect(() => {
    const fetchPost = async () => {
      if (school && postSlug) {
        setLoading(true);
        try {
          const allPosts = await sdk.get<BlogPost>('blog_posts');
          const schoolPosts = allPosts.filter((p: BlogPost) => 
            p.schoolId === school.id && p.status === 'published'
          );
          
          const currentPost = schoolPosts.find((p: BlogPost) => p.slug === postSlug);
          setPost(currentPost || null);
          
          // Get related posts
          if (currentPost) {
            const related = schoolPosts
              .filter((p: BlogPost) => 
                p.id !== currentPost.id && (
                  (currentPost.categories && p.categories && 
                   currentPost.categories.some(cat => p.categories?.includes(cat)))
                )
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }
        } catch (error) {
          console.error('Failed to fetch blog post:', error);
          setPost(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [school, postSlug]);

  return (
    <div className={`single-post-page ${blogPostStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-8">
        {/* Post content */}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};
```

### Blog Archive Page

```tsx
// src/pages/school/BlogPage.tsx
import React, { useState, useEffect } from 'react';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import '@/themes/styles/pages/archive-modern.css';
import { Calendar, Clock, Search } from 'lucide-react';
import { BlogPost } from '@/types';

const BlogPage = () => {
  const { school } = useSchool();
  const { schoolSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const blogArchiveStyle = school?.blogArchiveStyle || 'blog-archive-style-1';

  // Fetch and filter posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (school) {
        setLoading(true);
        try {
          const allPosts = await sdk.get<BlogPost>('blog_posts');
          const schoolPosts = allPosts.filter((p: BlogPost) => 
            p.schoolId === school.id && p.status === 'published'
          );
          setPosts(schoolPosts);
        } catch (error) {
          console.error('Failed to fetch blog posts:', error);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPosts();
  }, [school]);

  return (
    <div className={`archive-page ${blogArchiveStyle}`}>
      <SchoolHeader school={school} pages={pages} />
      <main className="archive-container">
        {/* Archive content */}
      </main>
      <SchoolFooter school={school} />
    </div>
  );
};
```

## Step 6: Configure School Branding

Update your school object to include modern theme preferences:

```tsx
const school = {
  id: 'school-123',
  name: 'Example School',
  branding: {
    primaryColor: '#2d7d32',
    secondaryColor: '#4caf50',
    accentColor: '#81c784',
    logoUrl: '/logo.png',
    headerStyle: 'header-style-2',
    footerStyle: 'footer-style-3',
    blogPostStyle: 'blog-post-style-1',
    blogArchiveStyle: 'blog-archive-style-1'
  }
};
```

## Step 7: Testing

1. **Visual Testing:**
   - Test all header styles
   - Test all footer styles
   - Test responsive breakpoints
   - Test with different school branding

2. **Functional Testing:**
   - Test dynamic data loading
   - Test search and filtering
   - Test pagination
   - Test mobile navigation

3. **Performance Testing:**
   - Check loading times
   - Monitor bundle size
   - Test image lazy loading

## Common Issues and Solutions

### Issue: Styles Not Loading
**Solution:** Check CSS import order and ensure modern CSS files are imported after base styles.

### Issue: Dynamic Data Not Showing
**Solution:** Verify SDK configuration and check network requests in browser DevTools.

### Issue: Mobile Menu Not Working
**Solution:** Ensure state management is properly implemented and event handlers are attached.

### Issue: Images Not Loading
**Solution:** Check image URLs and implement proper error handling with fallback images.

## Next Steps

1. Customize styles for your specific needs
2. Add additional theme variants
3. Implement advanced features like dark mode
4. Add animation and transition effects
5. Optimize for performance and accessibility

## Support

For additional help:
- Review the component documentation
- Check the troubleshooting guide
- Contact the development team

---

*Implementation Guide for SchoolPortally Modern Theme System*

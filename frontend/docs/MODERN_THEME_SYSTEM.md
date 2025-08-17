# Modern Theme System Documentation

## Overview

The SchoolPortally platform now features a comprehensive modern theme system that provides schools with professional, responsive, and brand-aware website designs. This system includes modern headers, footers, section components, and page templates that automatically adapt to each school's branding.

## Key Features

### 🎨 Brand-Aware Styling
- Automatic integration with school branding colors
- CSS custom properties for consistent theming
- Dynamic color adaptation across all components

### 📱 Fully Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions

### ⚡ Performance Optimized
- Lazy loading for images
- Efficient CSS architecture
- Minimal bundle impact

### 🔧 Highly Customizable
- Multiple style variants for each component
- Easy theme switching
- Extensible architecture

## Architecture

### CSS Custom Properties System

All modern components use CSS custom properties that automatically inherit from school branding:

```css
.component {
  --primary: var(--school-brand-primary, #2d7d32);
  --secondary: var(--school-brand-secondary, #4caf50);
  --accent: var(--school-brand-accent, #81c784);
  --bg-primary: var(--school-brand-bg-primary, #f8fffe);
  --bg-light: var(--school-brand-bg-light, #ffffff);
  --text-primary: var(--school-brand-text-primary, #1f2937);
  --text-secondary: var(--school-brand-text-secondary, #6b7280);
}
```

### Component Structure

Each modern component follows this structure:
- Base styles with CSS custom properties
- Multiple style variants (style-1, style-2, etc.)
- Responsive breakpoints
- Accessibility considerations

## Components

### 1. Modern Headers (`headers-modern.css`)

**Available Styles:**
- `header-style-1`: Classic Professional
- `header-style-2`: Modern Gradient
- `header-style-3`: Minimalist Transparent
- `header-style-4`: Split Layout with Top Bar
- `header-style-5`: Centered Navigation
- `header-style-6`: Sidebar Toggle
- `header-style-7`: Floating Header

**Features:**
- Responsive navigation
- Mobile menu support
- Brand logo integration
- Contact information display
- Smooth animations

**Usage:**
```tsx
<SchoolHeader school={school} pages={pages} />
```

### 2. Modern Footers (`footers-modern.css`)

**Available Styles:**
- `footer-style-1`: Classic Dark
- `footer-style-2`: Light & Clean
- `footer-style-3`: Gradient Modern
- `footer-style-4`: Minimalist
- `footer-style-5`: Two-Tone
- `footer-style-6`: Card Layout
- `footer-style-7`: Wave Design

**Features:**
- Multi-column layouts
- Contact information
- Quick links
- Social media integration
- Newsletter signup
- Responsive design

**Usage:**
```tsx
<SchoolFooter school={school} />
```

### 3. Modern Sections

#### Hero Section (`hero-modern.css`)
- Multiple layout options
- Background image support
- Call-to-action buttons
- Responsive typography

#### About Section (`about-modern.css`)
- Team member displays
- Mission/vision layouts
- Statistics counters
- Image galleries

#### Classes Section (`classes-modern.css`)
- Dynamic data integration
- Multiple display formats
- Enrollment information
- Teacher details

#### Gallery Section (`gallery-modern.css`)
- Category filtering
- Lightbox support
- Masonry layouts
- Lazy loading

### 4. Modern Page Templates

#### Single Post (`single-post-modern.css`)
**Available Styles:**
- `blog-post-style-1`: Classic Article Layout
- `blog-post-style-2`: Hero Image Layout
- `blog-post-style-3`: Sidebar Layout
- `blog-post-style-4`: Magazine Layout
- `blog-post-style-5`: Minimal Clean
- `blog-post-style-6`: Reading Progress
- `blog-post-style-7`: Card Stack

**Features:**
- Reading progress indicator
- Social sharing
- Related posts
- Comments section
- Post navigation

#### Archive Pages (`archive-modern.css`)
**Available Styles:**
- `blog-archive-style-1`: Grid Layout
- `blog-archive-style-2`: List Layout
- `blog-archive-style-3`: Masonry Layout
- `blog-archive-style-4`: Featured Layout
- `blog-archive-style-5`: Timeline Layout
- `blog-archive-style-6`: Card Slider
- `blog-archive-style-7`: Magazine Layout

**Features:**
- Search and filtering
- Pagination
- Category filtering
- Sort options
- Loading states

## Implementation Guide

### 1. Setting Up a New Component

1. Create the CSS file with modern styling:
```css
/* Modern Component Styles */
.component-name {
  --component-primary: var(--school-brand-primary, #default);
  /* ... other custom properties */
}
```

2. Create multiple style variants:
```css
.component-style-1 { /* Classic style */ }
.component-style-2 { /* Modern style */ }
.component-style-3 { /* Minimal style */ }
```

3. Add responsive breakpoints:
```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 480px) {
  /* Small mobile styles */
}
```

### 2. Integrating with School Branding

The system automatically reads school branding from the school object:

```tsx
const school = {
  branding: {
    primaryColor: '#2d7d32',
    secondaryColor: '#4caf50',
    accentColor: '#81c784',
    headerStyle: 'header-style-2',
    footerStyle: 'footer-style-3',
    blogPostStyle: 'blog-post-style-1'
  }
}
```

### 3. Adding Dynamic Data

Components now integrate with real data instead of using placeholders:

```tsx
// Before (static)
const defaultClasses = [
  { name: 'Math 101', teacher: 'Mr. Smith' }
];

// After (dynamic)
useEffect(() => {
  const fetchClasses = async () => {
    const classes = await sdk.get<ClassItem>('classes');
    const schoolClasses = classes.filter(c => 
      c.schoolId === school.id && c.status === 'active'
    );
    setClasses(schoolClasses);
  };
  fetchClasses();
}, [school]);
```

## Best Practices

### 1. Performance
- Use lazy loading for images
- Implement loading states
- Optimize CSS delivery
- Minimize JavaScript bundle size

### 2. Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

### 3. Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Flexible layouts
- Optimized typography

### 4. Maintainability
- Consistent naming conventions
- Modular CSS architecture
- Clear component boundaries
- Comprehensive documentation

## Migration Guide

### From Legacy to Modern Components

1. **Update Imports:**
```tsx
// Before
import '@/themes/styles/headers.css';

// After
import '@/themes/styles/headers.css';
import '@/themes/styles/headers-modern.css';
```

2. **Update Class Names:**
```tsx
// Before
<header className={headerStyle}>

// After
<header className={`school-header ${headerStyle}`}>
```

3. **Add Dynamic Data:**
```tsx
// Replace static data with dynamic fetching
// Add loading states
// Implement error handling
```

## Troubleshooting

### Common Issues

1. **Styles Not Applying:**
   - Check CSS import order
   - Verify class name spelling
   - Ensure school branding is loaded

2. **Responsive Issues:**
   - Test on multiple devices
   - Check viewport meta tag
   - Verify breakpoint values

3. **Performance Issues:**
   - Optimize images
   - Check for CSS conflicts
   - Monitor bundle size

### Debug Tools

1. **Browser DevTools:**
   - Inspect CSS custom properties
   - Check responsive breakpoints
   - Monitor network requests

2. **React DevTools:**
   - Check component state
   - Verify prop passing
   - Monitor re-renders

## Future Enhancements

### Planned Features
- Theme builder interface
- Advanced animation system
- Dark mode support
- Custom CSS injection
- A/B testing framework

### Contributing
- Follow existing patterns
- Add comprehensive tests
- Update documentation
- Consider accessibility

## Support

For questions or issues with the modern theme system:
1. Check this documentation
2. Review component examples
3. Test in isolation
4. Contact the development team

---

*This documentation is part of the SchoolPortally platform. Last updated: 2025-08-02*

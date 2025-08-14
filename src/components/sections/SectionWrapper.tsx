import React from 'react';
import { Section } from '@/types';
import { 
  applySectionStyle, 
  getSectionContainerClasses, 
  getSectionContentClasses,
  normalizeStyleId 
} from '@/utils/sectionStyleUtils';


interface SectionWrapperProps {
  section: Section;
  children: React.ReactNode;
  className?: string;
  itemCount?: number;
  customLayout?: boolean;
}

/**
 * SectionWrapper - A higher-order component that applies consistent styling to all sections
 */
export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  section,
  children,
  className = '',
  itemCount,
  customLayout = false
}) => {
  const styleId = normalizeStyleId(section.styleId);
  const sectionClasses = applySectionStyle('section', styleId, [className]);
  const containerClasses = getSectionContainerClasses(styleId);
  const contentClasses = customLayout ? '' : getSectionContentClasses(styleId, itemCount);

  return (
    <section className={sectionClasses} id={section.id}>
      <div className={containerClasses}>
        {/* Section Header */}
        {(section.content?.title || section.content?.subtitle) && (
          <div className="section-header">
            {section.content?.title && (
              <h2 className="section-title">{section.content.title}</h2>
            )}
            {section.content?.subtitle && (
              <p className="section-subtitle">{section.content.subtitle}</p>
            )}
          </div>
        )}

        {/* Section Content */}
        {customLayout ? (
          children
        ) : (
          <div className={contentClasses}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
};

/**
 * SectionCard - A standardized card component for sections
 */
interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className = '',
  href,
  onClick
}) => {
  const cardClasses = `section-card ${className}`;

  if (href) {
    return (
      <a href={href} className={cardClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button className={cardClasses} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};

/**
 * SectionButton - A standardized button component for sections
 */
interface SectionButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const SectionButton: React.FC<SectionButtonProps> = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = ''
}) => {
  const buttonClasses = `section-btn ${variant === 'outline' ? 'section-btn-outline' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={buttonClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

/**
 * SectionGrid - A flexible grid component for sections
 */
interface SectionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const SectionGrid: React.FC<SectionGridProps> = ({
  children,
  columns = 3,
  className = ''
}) => {
  const gridClasses = `section-grid section-grid-${columns} ${className}`;

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

/**
 * SectionImage - A standardized image component for sections
 */
interface SectionImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'tall';
}

export const SectionImage: React.FC<SectionImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'video'
}) => {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
    tall: 'aspect-[3/4]'
  };

  const imageClasses = `section-image ${aspectRatioClasses[aspectRatio]} ${className}`;

  return (
    <div className={imageClasses}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
      />
    </div>
  );
};

/**
 * SectionMeta - A component for displaying metadata (dates, authors, categories, etc.)
 */
interface SectionMetaProps {
  items: Array<{
    icon?: React.ReactNode;
    label: string;
    value: string;
  }>;
  className?: string;
}

export const SectionMeta: React.FC<SectionMetaProps> = ({
  items,
  className = ''
}) => {
  return (
    <div className={`section-meta ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="section-meta-item">
          {item.icon && <span className="section-meta-icon">{item.icon}</span>}
          <span className="section-meta-label">{item.label}:</span>
          <span className="section-meta-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * SectionControls - A component for section controls (search, filter, sort, etc.)
 */
interface SectionControlsProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionControls: React.FC<SectionControlsProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`section-controls ${className}`}>
      {children}
    </div>
  );
};

/**
 * SectionLoadMore - A component for load more functionality
 */
interface SectionLoadMoreProps {
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  viewAllHref?: string;
  viewAllText?: string;
}

export const SectionLoadMore: React.FC<SectionLoadMoreProps> = ({
  onLoadMore,
  hasMore = false,
  loading = false,
  viewAllHref,
  viewAllText = 'View All'
}) => {
  return (
    <div className="section-load-more">
      {onLoadMore && hasMore && (
        <SectionButton 
          onClick={onLoadMore} 
          variant="outline"
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Loading...' : 'Load More'}
        </SectionButton>
      )}
      
      {viewAllHref && (
        <SectionButton href={viewAllHref}>
          {viewAllText}
        </SectionButton>
      )}
    </div>
  );
};

export default SectionWrapper;

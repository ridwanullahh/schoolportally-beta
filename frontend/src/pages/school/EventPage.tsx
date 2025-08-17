import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSchool } from '@/contexts/SchoolContext';
import { usePages } from '@/hooks/usePages';
import sdk from '@/lib/sdk-config';
import { Calendar, Clock, MapPin, Users, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import SchoolHeader from '@/components/school/SchoolHeader';
import SchoolFooter from '@/components/school/SchoolFooter';



interface Event {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image?: string;
  organizer: string;
  capacity: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
  recurring: boolean;
  registrations?: string[];
  createdAt: string;
  updatedAt?: string;
}

const EventPage = () => {
  const { eventId, schoolSlug } = useParams();
  const { school } = useSchool();
  const { pages } = usePages();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const eventContentRef = useRef<HTMLDivElement>(null);

  // Map old style names to new template system
  const getTemplateStyle = (styleId: string) => {
    const styleMap: { [key: string]: string } = {
      'event-post-style-1': 'single-post-style-1',
      'event-post-style-2': 'single-post-style-2',
      'event-post-style-3': 'single-post-style-3',
      'event-post-style-4': 'single-post-style-4',
      'event-post-style-5': 'single-post-style-5',
      'event-post-style-6': 'single-post-style-6',
      'event-post-style-7': 'single-post-style-7',
      'event-post-style-8': 'single-post-style-8',
      'event-post-style-9': 'single-post-style-9',
      'event-post-style-10': 'single-post-style-10',
      'event-post-style-11': 'single-post-style-11',
      'event-post-style-12': 'single-post-style-12',
      'event-post-style-13': 'single-post-style-13',
      'event-post-style-14': 'single-post-style-14',
      'event-post-style-15': 'single-post-style-15',
    };
    return styleMap[styleId] || 'single-post-style-1';
  };

  const eventPostStyle = school?.eventPostStyle || 'event-post-style-1';
  const templateStyle = getTemplateStyle(eventPostStyle);

  useEffect(() => {
    const fetchEvent = async () => {
      if (school && eventId) {
        setLoading(true);
        try {
          const allEvents = await sdk.get<Event>('events');
          const schoolEvents = allEvents.filter((e: Event) =>
            e.schoolId === school.id && e.status !== 'cancelled'
          );

          const currentEvent = schoolEvents.find((e: Event) => e.id === eventId);
          setEvent(currentEvent || null);

          // Get related events (same category)
          if (currentEvent) {
            const related = schoolEvents
              .filter((e: Event) =>
                e.id !== currentEvent.id &&
                e.category === currentEvent.category
              )
              .slice(0, 3);
            setRelatedEvents(related);
          }
        } catch (error) {
          console.error('Failed to fetch event:', error);
          setEvent(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEvent();
  }, [school, eventId]);

  useEffect(() => {
    const handleScroll = () => {
      if (eventContentRef.current) {
        const element = eventContentRef.current;
        const scrollTop = window.pageYOffset;
        const docHeight = element.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        setScrollProgress(Math.min(scrollPercent * 100, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderEventMeta = () => (
    <div className="post-meta">
      <div className="post-meta-item">
        <Calendar className="h-4 w-4" />
        <span>{formatDate(event!.date)}</span>
      </div>
      <div className="post-meta-item">
        <Clock className="h-4 w-4" />
        <span>{formatTime(event!.time)}</span>
      </div>
      <div className="post-meta-item">
        <MapPin className="h-4 w-4" />
        <span>{event!.location}</span>
      </div>
      {event!.capacity && (
        <div className="post-meta-item">
          <Users className="h-4 w-4" />
          <span>{event!.registrations?.length || 0}/{event!.capacity} registered</span>
        </div>
      )}
    </div>
  );

  const renderEventContent = () => (
    <div className="post-content" ref={eventContentRef}>
      <div dangerouslySetInnerHTML={{ __html: event!.description }} />
    </div>
  );

  const renderSocialShare = () => {
    const eventUrl = `${window.location.origin}/${schoolSlug}/events/${event!.id}`;
    const shareText = `Check out this event: ${event!.title}`;

    return (
      <div className="social-share">
        <h3>Share this event</h3>
        <div className="social-share-buttons">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="social-share-btn linkedin"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  };

  const renderRelatedEvents = () => {
    if (relatedEvents.length === 0) return null;

    return (
      <div className="related-posts">
        <h3>Related Events</h3>
        <div className="related-posts-grid">
          {relatedEvents.map(relatedEvent => (
            <div key={relatedEvent.id} className="related-post-card">
              {relatedEvent.image && (
                <img
                  src={relatedEvent.image}
                  alt={relatedEvent.title}
                  className="related-post-image"
                />
              )}
              <div className="related-post-content">
                <h4 className="related-post-title">
                  <a href={`/${schoolSlug}/events/${relatedEvent.id}`}>
                    {relatedEvent.title}
                  </a>
                </h4>
                <p className="related-post-meta">
                  {formatDate(relatedEvent.date)} • {relatedEvent.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEventLayout = () => {
    switch (templateStyle) {
      case 'single-post-style-2':
        return (
          <>
            <div
              className="post-hero"
              style={event!.image ? { backgroundImage: `url(${event!.image})` } : {}}
            >
              <div className="post-hero-content">
                <h1 className="post-title">{event!.title}</h1>
                {renderEventMeta()}
              </div>
            </div>
            <div className="post-container">
              {renderEventContent()}
              {renderSocialShare()}
              {renderRelatedEvents()}
            </div>
          </>
        );

      case 'single-post-style-3':
        return (
          <div className="main-content">
            <div className="post-article">
              <h1 className="post-title">{event!.title}</h1>
              {renderEventMeta()}
              {event!.image && (
                <img
                  src={event!.image}
                  alt={event!.title}
                  className="post-featured-image"
                />
              )}
              {renderEventContent()}
              {renderSocialShare()}
            </div>
            <div className="sidebar">
              <div className="sidebar-widget">
                <h3 className="widget-title">Event Details</h3>
                <div className="event-details">
                  <p><strong>Date:</strong> {formatDate(event!.date)}</p>
                  <p><strong>Time:</strong> {formatTime(event!.time)}</p>
                  <p><strong>Location:</strong> {event!.location}</p>
                  <p><strong>Organizer:</strong> {event!.organizer}</p>
                  {event!.capacity && (
                    <p><strong>Capacity:</strong> {event!.capacity} people</p>
                  )}
                  {event!.category && (
                    <p><strong>Category:</strong> {event!.category}</p>
                  )}
                </div>
              </div>
              {relatedEvents.length > 0 && (
                <div className="sidebar-widget">
                  <h3 className="widget-title">Related Events</h3>
                  <div className="related-events-sidebar">
                    {relatedEvents.map(relatedEvent => (
                      <div key={relatedEvent.id} className="related-event-item">
                        <h4>
                          <a href={`/${schoolSlug}/events/${relatedEvent.id}`}>
                            {relatedEvent.title}
                          </a>
                        </h4>
                        <p>{formatDate(relatedEvent.date)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'single-post-style-7':
        return (
          <div className="post-layout">
            <div
              className="post-image-section"
              style={event!.image ? { backgroundImage: `url(${event!.image})` } : {}}
            />
            <div className="post-content-section">
              <h1 className="post-title">{event!.title}</h1>
              {renderEventMeta()}
              {renderEventContent()}
              {renderSocialShare()}
              {renderRelatedEvents()}
            </div>
          </div>
        );

      case 'single-post-style-13':
        return (
          <div className="post-container">
            <div className="newspaper-header">
              <h2 className="newspaper-title">School Events</h2>
              <p className="newspaper-date">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <h1 className="post-title">{event!.title}</h1>
            {renderEventMeta()}
            {renderEventContent()}
            {renderSocialShare()}
            {renderRelatedEvents()}
          </div>
        );

      default:
        return (
          <div className="post-container">
            <div className="post-header">
              <h1 className="post-title">{event!.title}</h1>
              {renderEventMeta()}
              {event!.image && (
                <img
                  src={event!.image}
                  alt={event!.title}
                  className="post-featured-image"
                />
              )}
            </div>
            {renderEventContent()}
            {renderSocialShare()}
            {renderRelatedEvents()}
          </div>
        );
    }
  };

  if (loading) {
    return <div className="loading-state">Loading event...</div>;
  }

  if (!event) {
    return (
      <div className="error-state">
        <h2>Event not found</h2>
        <p>The event you're looking for doesn't exist or has been removed.</p>
        <a href={`/${schoolSlug}/events`} className="btn btn-primary">
          View All Events
        </a>
      </div>
    );
  }

  // Special wrapper for glassmorphism template
  if (templateStyle === 'single-post-style-15') {
    return (
      <div className={`single-post-page ${templateStyle}`}>
        {templateStyle === 'single-post-style-6' && (
          <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
        )}
        <SchoolHeader school={school} pages={pages} />
        <div className="post-wrapper">
          {renderEventLayout()}
        </div>
        <SchoolFooter school={school} />

        {/* Floating elements for template-style-9 */}
        {templateStyle === 'single-post-style-9' && (
          <>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`single-post-page ${templateStyle}`}>
      {templateStyle === 'single-post-style-6' && (
        <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      )}
      <SchoolHeader school={school} pages={pages} />
      <main className="container mx-auto px-4 py-8">
        {renderEventLayout()}
      </main>
      <SchoolFooter school={school} />

      {/* Floating elements for template-style-9 */}
      {templateStyle === 'single-post-style-9' && (
        <>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </>
      )}
    </div>
  );
};

export default EventPage;
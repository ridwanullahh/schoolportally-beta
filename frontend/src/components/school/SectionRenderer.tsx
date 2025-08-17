
import React from 'react';
import { Section, School } from '@/types';
import HeroSection from '@/components/sections/HeroSection';
import QuickFactsSection from '@/components/sections/QuickFactsSection';
import ValuePropositionSection from '@/components/sections/ValuePropositionSection';
import TeaserSection from '@/components/sections/TeaserSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import EventsSnapshotSection from '@/components/sections/EventsSnapshotSection';
import GalleryPreviewSection from '@/components/sections/GalleryPreviewSection';
import BlogPostsSection from '@/components/sections/BlogPostsSection';
import CtaSection from '@/components/sections/CtaSection';
import PartnersSection from '@/components/sections/PartnersSection';
import MissionVisionSection from '@/components/sections/MissionVisionSection';
import HistorySection from '@/components/sections/HistorySection';
import LeadershipSection from '@/components/sections/LeadershipSection';
import FacultySection from '@/components/sections/FacultySection';
import ClassesSection from '@/components/sections/ClassesSection';
import ProgramsSection from '@/components/sections/ProgramsSection';
import CoursesSection from '@/components/sections/CoursesSection';
import AnnouncementsSection from '@/components/sections/AnnouncementsSection';
import LibrarySection from '@/components/sections/LibrarySection';
import GallerySection from '@/components/sections/GallerySection';
import KnowledgebaseSection from '@/components/sections/KnowledgebaseSection';
import JobsSection from '@/components/sections/JobsSection';
import FaqSection from '@/components/sections/FaqSection';
import AcademicCalendarSection from '@/components/sections/AcademicCalendarSection';
import ResultCheckerSection from '@/components/sections/ResultCheckerSection';
import FormSection from '@/components/sections/FormSection';
import ProductsSection from '@/components/sections/ProductsSection';

interface SectionRendererProps {
  section: Section;
  school: School;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, school }) => {
  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} />;
      case 'quick_facts':
        return <QuickFactsSection section={section} />;
      case 'value_prop':
        return <ValuePropositionSection section={section} />;
      case 'teaser':
        return <TeaserSection section={section} />;
      case 'features':
        return <FeaturesSection section={section} />;
      case 'testimonials':
        return <TestimonialsSection section={section} />;
      case 'events_snapshot':
        return <EventsSnapshotSection section={section} />;
      case 'gallery_preview':
        return <GalleryPreviewSection section={section} />;
      case 'blog_posts':
        return <BlogPostsSection section={section} />;
      case 'cta':
        return <CtaSection section={section} />;
      case 'partners':
        return <PartnersSection section={section} />;
      case 'mission_vision':
        return <MissionVisionSection section={section} />;
      case 'history':
        return <HistorySection section={section} />;
      case 'leadership':
        return <LeadershipSection section={section} />;
      case 'faculty':
        return <FacultySection section={section} />;
      case 'classes':
        return <ClassesSection section={section} />;
      case 'programs':
        return <ProgramsSection section={section} />;
      case 'courses':
        return <CoursesSection section={section} />;
      case 'announcements':
        return <AnnouncementsSection section={section} />;
      case 'library':
        return <LibrarySection section={section} />;
      case 'gallery':
        return <GallerySection section={section} />;
      case 'knowledgebase':
        return <KnowledgebaseSection section={section} />;
      case 'jobs':
        return <JobsSection section={section} />;
      case 'faq':
        return <FaqSection section={section} />;
      case 'academic_calendar':
        return <AcademicCalendarSection section={section} />;
      case 'result_checker':
        return <ResultCheckerSection section={section} />;
      case 'form_embed':
        return <FormSection content={section.content} settings={section.settings} />;
      case 'products':
        return <ProductsSection section={section} />;
      default:
        return (
          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Unsupported Section: {section.type}
              </h2>
              <p className="text-gray-600">
                This section type is not yet supported.
              </p>
            </div>
          </section>
        );
    }
  };

  return <div className={`section-${section.type}`}>{renderSection()}</div>;
};

export default SectionRenderer;

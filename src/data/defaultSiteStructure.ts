import { Page } from '@/types';

export const defaultPages: Omit<Page, 'id' | 'uid' | 'createdAt' | 'updatedAt'>[] = [
  {
    schoolId: '',
    title: 'Home',
    slug: '',
    type: 'home',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        styleId: 'hero-style-1',
        content: {
          title: 'Welcome to Our School',
          subtitle: 'Excellence in Education',
          description: 'Providing quality education and fostering a community of lifelong learners.',
          primaryButton: 'Learn More',
          primaryLink: '/about',
          secondaryButton: 'Apply Now',
          secondaryLink: '/admissions'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'quick-facts-1',
        type: 'quick_facts',
        styleId: 'quick-facts-style-1',
        content: {
          title: 'School Facts',
          facts: [
            { label: 'Students', value: '1,200+' },
            { label: 'Teachers', value: '80+' },
            { label: 'Programs', value: '25+' },
            { label: 'Years', value: '30+' }
          ]
        },
        settings: {},
        order: 2,
        visible: true
      },
      {
        id: 'programs-1',
        type: 'programs',
        styleId: 'programs-style-1',
        content: {
          title: 'Our Programs',
          description: 'Discover our comprehensive range of educational programs designed for every student.',
          programs: []
        },
        settings: {
          showAll: false,
          limit: 6,
          featuredOnly: true
        },
        order: 3,
        visible: true
      },
      {
        id: 'testimonials-1',
        type: 'testimonials',
        styleId: 'testimonials-style-1',
        content: {
          title: 'What Our Community Says',
          description: 'Hear from students, parents, and alumni about their experiences.',
          testimonials: []
        },
        settings: {
          showAll: false,
          limit: 3,
          featuredOnly: true
        },
        order: 4,
        visible: true
      },
      {
        id: 'cta-1',
        type: 'cta',
        styleId: 'cta-style-1',
        content: {
          title: 'Ready to Join Us?',
          description: 'Take the first step towards a brighter future.',
          primaryButton: 'Apply Now',
          primaryLink: '/admissions',
          secondaryButton: 'Contact Us',
          secondaryLink: '/contact'
        },
        settings: {},
        order: 5,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'About Us',
    slug: 'about',
    type: 'page',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-2',
        type: 'hero',
        styleId: 'hero-style-2',
        content: {
          title: 'About Our School',
          subtitle: 'Our Story and Mission',
          description: 'Learn about our history, values, and commitment to educational excellence.',
          primaryButton: 'Our History',
          primaryLink: '#history',
          secondaryButton: 'Contact Us',
          secondaryLink: '/contact'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'mission-vision-1',
        type: 'mission_vision',
        styleId: 'mission-vision-style-1',
        content: {
          title: 'Mission & Vision',
          mission: 'To provide a nurturing environment that fosters academic excellence, character development, and lifelong learning.',
          vision: 'To be a leading educational institution that prepares students to become responsible global citizens.'
        },
        settings: {},
        order: 2,
        visible: true
      },
      {
        id: 'history-1',
        type: 'history',
        styleId: 'history-style-1',
        content: {
          title: 'Our History',
          description: 'Founded in 1990, our school has been at the forefront of educational innovation for over three decades.',
          milestones: [
            { year: '1990', title: 'Foundation', description: 'School established with 50 students' },
            { year: '2000', title: 'Expansion', description: 'New campus building opened' },
            { year: '2010', title: 'Technology Integration', description: 'Smart classrooms introduced' },
            { year: '2020', title: 'Digital Transformation', description: 'Online learning platform launched' }
          ]
        },
        settings: {},
        order: 3,
        visible: true
      },
      {
        id: 'leadership-1',
        type: 'leadership',
        styleId: 'leadership-style-1',
        content: {
          title: 'Our Leadership',
          description: 'Meet our dedicated team of educational leaders.',
          leaders: []
        },
        settings: {
          showAll: false,
          limit: 4
        },
        order: 4,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'Academics',
    slug: 'academics',
    type: 'page',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-3',
        type: 'hero',
        styleId: 'hero-style-3',
        content: {
          title: 'Academic Excellence',
          subtitle: 'Our Educational Programs',
          description: 'Explore our comprehensive academic offerings designed to prepare students for success.',
          primaryButton: 'View Programs',
          primaryLink: '#programs',
          secondaryButton: 'Admissions',
          secondaryLink: '/admissions'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'programs-2',
        type: 'programs',
        styleId: 'programs-style-2',
        content: {
          title: 'Academic Programs',
          description: 'We offer a wide range of programs to meet diverse educational needs.',
          programs: []
        },
        settings: {
          showAll: true,
          limit: 12,
          featuredOnly: false
        },
        order: 2,
        visible: true
      },
      {
        id: 'classes-1',
        type: 'classes',
        styleId: 'classes-style-1',
        content: {
          title: 'Classes & Courses',
          description: 'Discover our comprehensive class offerings.',
          classes: []
        },
        settings: {
          showAll: false,
          limit: 8
        },
        order: 3,
        visible: true
      },
      {
        id: 'faculty-1',
        type: 'faculty',
        styleId: 'faculty-style-1',
        content: {
          title: 'Our Faculty',
          description: 'Meet our experienced and dedicated teaching staff.',
          faculty: []
        },
        settings: {
          showAll: false,
          limit: 6
        },
        order: 4,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'Admissions',
    slug: 'admissions',
    type: 'page',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-4',
        type: 'hero',
        styleId: 'hero-style-4',
        content: {
          title: 'Join Our Community',
          subtitle: 'Admissions Information',
          description: 'Learn about our admission process and how to become part of our school community.',
          primaryButton: 'Apply Now',
          primaryLink: '#apply',
          secondaryButton: 'Requirements',
          secondaryLink: '#requirements'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'value-prop-1',
        type: 'value_prop',
        styleId: 'value-prop-style-1',
        content: {
          title: 'Why Choose Our School?',
          description: 'Discover what makes our educational institution unique.',
          benefits: [
            { title: 'Academic Excellence', description: 'Rigorous curriculum with proven results' },
            { title: 'Dedicated Faculty', description: 'Experienced teachers committed to student success' },
            { title: 'Modern Facilities', description: 'State-of-the-art learning environments' },
            { title: 'Community Focus', description: 'Strong parent-school partnership' }
          ]
        },
        settings: {},
        order: 2,
        visible: true
      },
      {
        id: 'form-1',
        type: 'form_embed',
        styleId: 'form-style-1',
        content: {
          title: 'Admission Inquiry',
          description: 'Fill out this form to start your admission journey.',
          formId: 'admission-inquiry'
        },
        settings: {},
        order: 3,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'Blog',
    slug: 'blog',
    type: 'blog',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-5',
        type: 'hero',
        styleId: 'hero-style-5',
        content: {
          title: 'School Blog',
          subtitle: 'Latest News & Updates',
          description: 'Stay informed about school events, achievements, and educational insights.',
          primaryButton: 'Latest Posts',
          primaryLink: '#latest',
          secondaryButton: 'Categories',
          secondaryLink: '#categories'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'blog-posts-1',
        type: 'blog_posts',
        styleId: 'blog-posts-style-1',
        content: {
          title: 'Latest Blog Posts',
          description: 'Read our latest articles and updates.',
          posts: []
        },
        settings: {
          showAll: false,
          limit: 6,
          featuredOnly: false
        },
        order: 2,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'Events',
    slug: 'events',
    type: 'events',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-6',
        type: 'hero',
        styleId: 'hero-style-6',
        content: {
          title: 'School Events',
          subtitle: 'Upcoming Activities',
          description: 'Join us for exciting events and activities throughout the year.',
          primaryButton: 'Calendar',
          primaryLink: '#calendar',
          secondaryButton: 'Past Events',
          secondaryLink: '#past'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'events-snapshot-1',
        type: 'events_snapshot',
        styleId: 'events-snapshot-style-1',
        content: {
          title: 'Upcoming Events',
          description: 'Mark your calendar for these upcoming events.',
          events: []
        },
        settings: {
          showAll: false,
          limit: 4,
          upcomingOnly: true
        },
        order: 2,
        visible: true
      }
    ]
  },
  {
    schoolId: '',
    title: 'Contact',
    slug: 'contact',
    type: 'page',
    status: 'published',
    showOnHeader: true,
    showOnFooter: true,
    sections: [
      {
        id: 'hero-7',
        type: 'hero',
        styleId: 'hero-style-7',
        content: {
          title: 'Contact Us',
          subtitle: 'Get in Touch',
          description: 'We\'d love to hear from you. Reach out with any questions or feedback.',
          primaryButton: 'Send Message',
          primaryLink: '#message',
          secondaryButton: 'Visit Us',
          secondaryLink: '#visit'
        },
        settings: {},
        order: 1,
        visible: true
      },
      {
        id: 'form-2',
        type: 'form_embed',
        styleId: 'form-style-2',
        content: {
          title: 'Send us a Message',
          description: 'Fill out the form below and we\'ll get back to you soon.',
          formId: 'contact-form'
        },
        settings: {},
        order: 2,
        visible: true
      }
    ]
  }
];
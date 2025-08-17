import UniversalSDK from './sdk';

const githubUsername = import.meta.env.VITE_GITHUB_OWNER || 'ridwanullahh';
const githubRepo = import.meta.env.VITE_GITHUB_REPO || 'schoolportalbetadb';
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || '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';

// Database schema configuration with updated user and authentication fields
const dbSchema = {
  users: {
    required: ['email'],
    types: {
      id: 'string',
      uid: 'string',
      email: 'string',
      password: 'string',
      firstName: 'string',
      lastName: 'string',
      roles: 'array',
      permissions: 'array',
      schoolId: 'string',
      userType: 'string',
      verified: 'boolean',
      status: 'string',
      approvalStatus: 'string',
      createdAt: 'string',
      updatedAt: 'string',
      guardianId: 'string'
    }
  },
  sessions: {
    required: ['schoolId', 'name', 'startDate', 'endDate'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      startDate: 'string',
      endDate: 'string',
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  terms: {
    required: ['schoolId', 'sessionId', 'name', 'startDate', 'endDate'],
    types: {
      id: 'string',
      schoolId: 'string',
      sessionId: 'string',
      name: 'string',
      startDate: 'string',
      endDate: 'string',
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  schools: {
    required: ['name', 'slug'],
    types: {
      id: 'string',
      uid: 'string',
      name: 'string',
      slug: 'string',
      ownerId: 'string',
      address: 'string',
      phone: 'string',
      email: 'string',
      website: 'string',
      timezone: 'string',
      currency: 'string',
      status: 'string',
      subscriptionPlan: 'string',
      subscriptionStatus: 'string',
      onboardingCompleted: 'boolean',
      branding: 'object',
      createdAt: 'string',
      updatedAt: 'string',
      // Enhanced theming system
      currentTheme: 'string',
      themeOverrides: 'object',
      // Component styles
      headerStyle: 'string',
      footerStyle: 'string',
      breadcrumbStyle: 'string',
      // Module archive styles
      blogArchiveStyle: 'string',
      announcementArchiveStyle: 'string',
      eventArchiveStyle: 'string',
      programArchiveStyle: 'string',
      classArchiveStyle: 'string',
      courseArchiveStyle: 'string',
      facultyArchiveStyle: 'string',
      galleryArchiveStyle: 'string',
      jobArchiveStyle: 'string',
      productArchiveStyle: 'string',
      knowledgebaseArchiveStyle: 'string',
      libraryArchiveStyle: 'string',
      // Module single post styles
      blogPostStyle: 'string',
      announcementPostStyle: 'string',
      eventPostStyle: 'string',
      programPostStyle: 'string',
      classPostStyle: 'string',
      coursePostStyle: 'string',
      facultyPostStyle: 'string',
      galleryPostStyle: 'string',
      jobPostStyle: 'string',
      productPostStyle: 'string',
      libraryPostStyle: 'string',
      elibraryBookPostStyle: 'string',
      elibraryBookArchiveStyle: 'string',
      faqPostStyle: 'string',
      faqArchiveStyle: 'string'
    },
    defaults: {
      branding: {
        primaryColor: '#2d7d32',
        secondaryColor: '#4caf50',
        accentColor: '#81c784',
        primaryBackgroundColor: '#f8fffe',
        secondaryBackgroundColor: '#e8f5e8',
        lightBackgroundColor: '#ffffff',
        darkBackgroundColor: '#1a1a1a',
        primaryTextColor: '#1f2937',
        secondaryTextColor: '#6b7280',
        lightTextColor: '#ffffff',
        darkTextColor: '#000000',
        primaryButtonColor: '#2d7d32',
        secondaryButtonColor: '#4caf50',
        primaryButtonTextColor: '#ffffff',
        secondaryButtonTextColor: '#ffffff',
        successColor: '#10b981',
        warningColor: '#f59e0b',
        errorColor: '#ef4444',
        infoColor: '#3b82f6',
        fontFamily: 'Inter, system-ui, sans-serif',
        headingFontFamily: 'Inter, system-ui, sans-serif',
        headerStyle: 'header-style-1',
        footerStyle: 'footer-style-1',
        theme: 'default'
      },
      headerStyle: 'header-style-1',
      footerStyle: 'footer-style-1',
      blogPostStyle: 'blog-post-style-1',
      blogArchiveStyle: 'blog-archive-style-1',
      announcementPostStyle: 'announcement-post-style-1',
      announcementArchiveStyle: 'announcement-archive-style-1',
      eventPostStyle: 'event-post-style-1',
      eventArchiveStyle: 'event-archive-style-1',
      programPostStyle: 'program-post-style-1',
      programArchiveStyle: 'program-archive-style-1',
      classPostStyle: 'class-post-style-1',
      classArchiveStyle: 'class-archive-style-1',
      coursePostStyle: 'course-post-style-1',
      courseArchiveStyle: 'course-archive-style-1',
      galleryPostStyle: 'gallery-post-style-1',
      galleryArchiveStyle: 'gallery-archive-style-1',
      elibraryBookPostStyle: 'elibrary-book-post-style-1',
      elibraryBookArchiveStyle: 'elibrary-book-archive-style-1',
      knowledgebasePostStyle: 'knowledgebase-post-style-1',
      knowledgebaseArchiveStyle: 'knowledgebase-archive-style-1',
      faqPostStyle: 'faq-post-style-1',
      faqArchiveStyle: 'faq-archive-style-1',
      jobPostStyle: 'job-post-style-1',
      jobArchiveStyle: 'job-archive-style-1'
    }
  },
  pages: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      uid: 'string',
      schoolId: 'string',
      title: 'string',
      slug: 'string',
      type: 'string',
      status: 'string',
      sections: 'array',
      seoTitle: 'string',
      seoDescription: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  lms_courses: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      uid: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      instructorIds: 'array',
      status: 'string',
      publishStatus: 'string',
      scheduledDate: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  admissions: {
    required: ['schoolId', 'studentName'],
    types: {
      id: 'string',
      schoolId: 'string',
      studentName: 'string',
      email: 'string',
      phone: 'string',
      program: 'string',
      status: 'string',
      documents: 'array',
      createdAt: 'string'
    }
  },
  programs: {
    required: ['schoolId', 'name'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      description: 'string',
      excerpt: 'string',
      slug: 'string',
      type: 'string',
      level: 'string',
      duration: 'string',
      price: 'number',
      capacity: 'number',
      currentEnrollment: 'number',
      instructor: 'string',
      instructorId: 'string',
      schedule: 'object',
      location: 'string',
      requirements: 'array',
      benefits: 'array',
      curriculum: 'array',
      image: 'string',
      gallery: 'array',
      startDate: 'string',
      endDate: 'string',
      applicationDeadline: 'string',
      category: 'string',
      tags: 'array',
      featured: 'boolean',
      status: 'string',
      seoTitle: 'string',
      seoDescription: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  classes: {
    required: ['schoolId', 'name'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      slug: 'string',
      description: 'string',
      excerpt: 'string',
      programId: 'string',
      teacherIds: 'array',
      sessionId: 'string',
      termId: 'string',
      schedule: 'object',
      capacity: 'number',
      enrolled: 'number',
      status: 'string',
      fee: 'number',
      room: 'string',
      gradeLevel: 'string',
      subject: 'string',
      category: 'string',
      tags: 'array',
      featured: 'boolean',
      image: 'string',
      gallery: 'array',
      students: 'array',
      materials: 'array',
      assignments: 'array',
      attendance: 'array',
      seoTitle: 'string',
      seoDescription: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  subjects: {
    required: ['schoolId', 'classId', 'name'],
    types: {
      id: 'string',
      schoolId: 'string',
      classId: 'string',
      name: 'string',
      description: 'string',
      teacherIds: 'array',
      students: 'array', // All students from the class are here by default
      disabledStudents: 'array', // Student IDs disabled for this subject
      materials: 'array',
      assignments: 'array',
      attendance: 'array',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  subject_materials: {
    required: ['subjectId', 'title'],
    types: {
      id: 'string',
      subjectId: 'string',
      title: 'string',
      description: 'string',
      fileUrl: 'string',
      createdAt: 'string'
    }
  },
  subject_assignments: {
    required: ['subjectId', 'title'],
    types: {
      id: 'string',
      subjectId: 'string',
      title: 'string',
      description: 'string',
      dueDate: 'string',
      maxScore: 'number',
      createdAt: 'string'
    }
  },
  subject_attendance: {
    required: ['subjectId', 'studentId', 'date'],
    types: {
      id: 'string',
      subjectId: 'string',
      studentId: 'string',
      date: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
   subject_enrollments: {
    required: ['subjectId', 'studentId'],
    types: {
      id: 'string',
      subjectId: 'string',
      studentId: 'string',
      status: 'string', // e.g., 'enabled', 'disabled'
      createdAt: 'string'
    }
  },
  class_materials: {
    required: ['classId', 'title'],
    types: {
      id: 'string',
      classId: 'string',
      title: 'string',
      description: 'string',
      fileUrl: 'string',
      createdAt: 'string'
    }
  },
  class_assignments: {
    required: ['classId', 'title'],
    types: {
      id: 'string',
      classId: 'string',
      title: 'string',
      description: 'string',
      dueDate: 'string',
      maxScore: 'number',
      createdAt: 'string'
    }
  },
  class_attendance: {
    required: ['classId', 'studentId', 'date'],
    types: {
      id: 'string',
      classId: 'string',
      studentId: 'string',
      date: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  blog: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      slug: 'string',
      content: 'string',
      excerpt: 'string',
      authorId: 'string',
      status: 'string',
      publishedAt: 'string',
      createdAt: 'string'
    }
  },
  faq: {
    required: ['schoolId', 'question'],
    types: {
      id: 'string',
      schoolId: 'string',
      question: 'string',
      answer: 'string',
      category: 'string',
      order: 'number',
      status: 'string',
      createdAt: 'string'
    }
  },
  announcements: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      content: 'string',
      priority: 'string',
      targetAudience: 'array',
      status: 'string',
      publishedAt: 'string',
      createdAt: 'string'
    }
  },
  testimonials: {
    required: ['schoolId', 'text', 'author'],
    types: {
      id: 'string',
      schoolId: 'string',
      text: 'string',
      author: 'string',
      role: 'string',
      avatar: 'string',
      rating: 'number',
      status: 'string',
      featured: 'boolean',
      date: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  gallery: {
    required: ['schoolId', 'title', 'imageUrl'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      imageUrl: 'string',
      thumbnailUrl: 'string',
      category: 'string',
      tags: 'array',
      uploadedAt: 'string',
      status: 'string',
      featured: 'boolean',
      albumId: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  blog_posts: {
    required: ['schoolId', 'title', 'content'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      content: 'string',
      excerpt: 'string',
      slug: 'string',
      featuredImage: 'string',
      author: 'string',
      authorId: 'string',
      category: 'string',
      tags: 'array',
      status: 'string',
      publishedAt: 'string',
      scheduledAt: 'string',
      featured: 'boolean',
      views: 'number',
      likes: 'number',
      comments: 'number',
      seoTitle: 'string',
      seoDescription: 'string',
      readingTime: 'number',
      relatedPosts: 'array',
      gallery: 'array',
      videoUrl: 'string',
      audioUrl: 'string',
      downloadableFiles: 'array',
      customFields: 'object',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  lms_enrollments: {
    required: ['courseId', 'studentId'],
    types: {
      id: 'string',
      courseId: 'string',
      studentId: 'string',
      status: 'string',
      progress: 'number',
      enrolledAt: 'string'
    }
  },
  lms_assignments: {
    required: ['courseId', 'title'],
    types: {
      id: 'string',
      courseId: 'string',
      title: 'string',
      description: 'string',
      dueDate: 'string',
      maxScore: 'number',
      createdAt: 'string'
    }
  },
  forms: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      fields: 'array',
      embedCode: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  form_submissions: {
    required: ['formId'],
    types: {
      id: 'string',
      formId: 'string',
      data: 'object',
      submittedAt: 'string'
    }
  },
  wiki_articles: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      content: 'string',
      categoryId: 'string',
      authorId: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  wiki_categories: {
    required: ['schoolId', 'name'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      description: 'string',
      order: 'number',
      createdAt: 'string'
    }
  },
  fees: {
    required: ['schoolId'],
    types: {
      id: 'string',
      schoolId: 'string',
      studentId: 'string',
      type: 'string',
      amount: 'number',
      description: 'string',
      dueDate: 'string',
      status: 'string',
      paymentMethod: 'string',
      createdAt: 'string'
    }
  },
  events: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      excerpt: 'string',
      slug: 'string',
      date: 'string',
      time: 'string',
      endDate: 'string',
      endTime: 'string',
      location: 'string',
      category: 'string',
      image: 'string',
      gallery: 'array',
      organizer: 'string',
      organizerId: 'string',
      capacity: 'number',
      registrations: 'array',
      status: 'string',
      tags: 'array',
      featured: 'boolean',
      recurring: 'boolean',
      recurringPattern: 'object',
      ticketPrice: 'number',
      ticketTypes: 'array',
      requirements: 'array',
      agenda: 'array',
      speakers: 'array',
      sponsors: 'array',
      socialLinks: 'object',
      seoTitle: 'string',
      seoDescription: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  jobs: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      requirements: 'string',
      location: 'string',
      type: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  job_applications: {
    required: ['jobId', 'applicantName'],
    types: {
      id: 'string',
      jobId: 'string',
      applicantName: 'string',
      email: 'string',
      phone: 'string',
      resume: 'string',
      coverLetter: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  support_tickets: {
    required: ['schoolId', 'subject'],
    types: {
      id: 'string',
      schoolId: 'string',
      userId: 'string',
      subject: 'string',
      description: 'string',
      priority: 'string',
      status: 'string',
      assignedTo: 'string',
      createdAt: 'string'
    }
  },
  calendar_events: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      startDate: 'string',
      endDate: 'string',
      type: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  elibrary: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      author: 'string',
      description: 'string',
      fileUrl: 'string',
      fileType: 'string',
      category: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  results: {
    required: ['schoolId', 'studentId'],
    types: {
      id: 'string',
      schoolId: 'string',
      studentId: 'string',
      classId: 'string',
      term: 'string',
      session: 'string',
      subjects: 'array',
      totalScore: 'number',
      grade: 'string',
      position: 'number',
      remarks: 'string',
      createdAt: 'string'
    }
  },
  forum_threads: {
    required: ['schoolId', 'subjectId', 'title', 'userId'],
    types: {
      id: 'string',
      schoolId: 'string',
      subjectId: 'string',
      title: 'string',
      userId: 'string', // author
      status: 'string', // 'open', 'closed', 'hidden'
      sticky: 'boolean',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  forum_posts: {
    required: ['threadId', 'userId', 'content'],
    types: {
      id: 'string',
      threadId: 'string',
      userId: 'string', // author
      content: 'string',
      parentId: 'string', // for replies to other posts
      status: 'string', // 'visible', 'hidden', 'deleted'
      reactions: 'object',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  messages: {
    required: ['schoolId', 'senderId'],
    types: {
      id: 'string',
      schoolId: 'string',
      senderId: 'string',
      receiverId: 'string',
      subject: 'string',
      content: 'string',
      type: 'string',
      status: 'string',
      readAt: 'string',
      createdAt: 'string'
    }
  },
  products: {
    required: ['schoolId', 'name', 'price'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      description: 'string',
      price: 'number',
      status: 'string',
      stock: 'number',
      category: 'string',
      images: 'array',
      tags: 'array',
      featured: 'boolean',
      slug: 'string',
      seoTitle: 'string',
      seoDescription: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  orders: {
    required: ['schoolId', 'customerId', 'items', 'total'],
    types: {
      id: 'string',
      schoolId: 'string',
      customerId: 'string',
      items: 'array',
      total: 'number',
      status: 'string',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  customers: {
    required: ['firstName', 'lastName', 'email'],
    types: {
      id: 'string',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      phone: 'string',
      address: 'string',
      createdAt: 'string'
    }
  },
  live_class_schedules: {
   required: ['schoolId', 'subjectId', 'topic', 'startTime', 'teacherId'],
   types: {
     id: 'string',
     schoolId: 'string',
     subjectId: 'string',
     teacherId: 'string',
     topic: 'string',
     startTime: 'string',
     status: 'string', // scheduled, ongoing, finished
     accessCode: 'string'
   }
 },
 class_questions: {
    required: ['classId', 'userId', 'question'],
    types: {
      id: 'string',
      classId: 'string',
      userId: 'string',
      question: 'string',
      answered: 'boolean',
      createdAt: 'string'
    }
  },
  class_polls: {
    required: ['classId', 'question', 'options'],
    types: {
      id: 'string',
      classId: 'string',
      question: 'string',
      options: 'object',
      status: 'string', // 'open', 'closed'
      createdAt: 'string'
    }
  }
};

// Initialize SDK with configuration
const sdk = new UniversalSDK({
  owner: githubUsername,
  repo: githubRepo,
  token: githubToken,
  schemas: dbSchema
});

export default sdk;

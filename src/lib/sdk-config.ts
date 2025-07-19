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
      headerStyle: 'string',
      footerStyle: 'string',
      blogPostStyle: 'string',
      blogArchiveStyle: 'string',
      announcementPostStyle: 'string',
      announcementArchiveStyle: 'string',
      eventPostStyle: 'string',
      eventArchiveStyle: 'string',
      programPostStyle: 'string',
      programArchiveStyle: 'string',
      classPostStyle: 'string',
      classArchiveStyle: 'string',
      coursePostStyle: 'string',
      courseArchiveStyle: 'string',
      galleryPostStyle: 'string',
      galleryArchiveStyle: 'string',
      elibraryBookPostStyle: 'string',
      elibraryBookArchiveStyle: 'string',
      knowledgebasePostStyle: 'string',
      knowledgebaseArchiveStyle: 'string',
      faqPostStyle: 'string',
      faqArchiveStyle: 'string',
      jobPostStyle: 'string',
      jobArchiveStyle: 'string',
      lightGreen: 'string',
      lighterGreen: 'string',
      backgroundLight: 'string',
      backgroundMedium: 'string'
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
      duration: 'string',
      price: 'number',
      status: 'string',
      createdAt: 'string'
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
      students: 'array',
      materials: 'array',
      assignments: 'array',
      attendance: 'array',
      createdAt: 'string'
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
      date: 'string',
      time: 'string',
      location: 'string',
      category: 'string',
      image: 'string',
      organizer: 'string',
      capacity: 'number',
      registrations: 'array',
      status: 'string',
      tags: 'array',
      recurring: 'boolean',
      recurringPattern: 'object',
      createdAt: 'string'
    }
  },
  gallery: {
    required: ['schoolId', 'title'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      imageUrl: 'string',
      category: 'string',
      createdAt: 'string'
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
    },
    products: {
      required: ['name', 'price', 'status'],
      types: {
        name: 'string',
        price: 'number',
        status: 'string',
        stock: 'number',
      },
    },
    orders: {
      required: ['customerId', 'items', 'total', 'status'],
      types: {
        total: 'number',
        status: 'string',
      },
    },
    customers: {
      required: ['firstName', 'lastName', 'email'],
      types: {
        email: 'string',
      },
    },
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

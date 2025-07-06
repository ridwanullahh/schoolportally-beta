
import UniversalSDK from './sdk';

const githubUsername = import.meta.env.VITE_GITHUB_OWNER || 'ridwanullahh';
const githubRepo = import.meta.env.VITE_GITHUB_REPO || 'schoolportalbetadb';
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || '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';

// Database schema configuration
const dbSchema = {
  users: {
    required: ['id', 'email', 'password'],
    types: {
      id: 'string',
      email: 'string',
      password: 'string',
      firstName: 'string',
      lastName: 'string',
      roles: 'array',
      permissions: 'array',
      schoolId: 'string',
      verified: 'boolean',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  schools: {
    required: ['id', 'name'],
    types: {
      id: 'string',
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
      updatedAt: 'string'
    }
  },
  pages: {
    required: ['id', 'schoolId'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      slug: 'string',
      type: 'string',
      status: 'string',
      sections: 'array',
      createdAt: 'string',
      updatedAt: 'string'
    }
  },
  admissions: {
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
    types: {
      id: 'string',
      schoolId: 'string',
      name: 'string',
      programId: 'string',
      teacherId: 'string',
      schedule: 'string',
      capacity: 'number',
      enrolled: 'number',
      status: 'string',
      createdAt: 'string'
    }
  },
  blog: {
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
  lms_courses: {
    required: ['id', 'schoolId'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      instructorId: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  lms_enrollments: {
    required: ['id', 'courseId', 'studentId'],
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
    required: ['id', 'courseId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'formId'],
    types: {
      id: 'string',
      formId: 'string',
      data: 'object',
      submittedAt: 'string'
    }
  },
  wiki_articles: {
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
    types: {
      id: 'string',
      schoolId: 'string',
      title: 'string',
      description: 'string',
      startDate: 'string',
      endDate: 'string',
      location: 'string',
      type: 'string',
      status: 'string',
      createdAt: 'string'
    }
  },
  gallery: {
    required: ['id', 'schoolId'],
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
    required: ['id', 'schoolId'],
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
    required: ['id', 'jobId'],
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
    required: ['id', 'schoolId'],
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

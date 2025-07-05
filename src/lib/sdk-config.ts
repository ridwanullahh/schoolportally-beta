
import UniversalSDK from './sdk';

// SDK Configuration
const sdkConfig = {
  owner: import.meta.env.VITE_GITHUB_OWNER || '',
  repo: import.meta.env.VITE_GITHUB_REPO || '',
  token: import.meta.env.VITE_GITHUB_TOKEN || '',
  branch: 'main',
  basePath: 'db',
  mediaPath: 'media',
  cloudinary: {
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || '',
  },
  smtp: {
    endpoint: import.meta.env.VITE_SMTP_ENDPOINT || '',
    from: import.meta.env.VITE_SMTP_FROM || 'no-reply@schoolportal.top',
  },
  templates: {
    otp: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your OTP Code</h2>
        <p>Your verification code is: <strong style="font-size: 24px; color: #4f46e5;">{{otp}}</strong></p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `,
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to SchoolPortal!</h2>
        <p>Thank you for joining our platform. Your school management journey starts here.</p>
        <p>Best regards,<br>The SchoolPortal Team</p>
      </div>
    `,
  },
  schemas: {
    users: {
      required: ['email'],
      types: {
        email: 'string',
        password: 'string',
        firstName: 'string',
        lastName: 'string',
        phone: 'string',
        avatar: 'string',
        verified: 'boolean',
        roles: 'array',
        permissions: 'array',
        schoolId: 'string',
        userType: 'string',
        status: 'string',
      },
      defaults: {
        verified: false,
        roles: [],
        permissions: [],
        status: 'pending',
      },
    },
    schools: {
      required: ['name', 'slug', 'ownerId'],
      types: {
        name: 'string',
        slug: 'string',
        ownerId: 'string',
        logo: 'string',
        favicon: 'string',
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
        customDomain: 'string',
        branding: 'object',
      },
      defaults: {
        status: 'active',
        subscriptionPlan: 'standard',
        subscriptionStatus: 'trial',
        timezone: 'UTC',
        currency: 'USD',
        onboardingCompleted: false,
      },
    },
    pages: {
      required: ['title', 'slug', 'schoolId'],
      types: {
        title: 'string',
        slug: 'string',
        schoolId: 'string',
        type: 'string',
        status: 'string',
        sections: 'array',
        seoTitle: 'string',
        seoDescription: 'string',
        featuredImage: 'string',
        publishedAt: 'string',
      },
      defaults: {
        status: 'published',
        sections: [],
      },
    },
    programs: {
      required: ['name', 'schoolId'],
      types: {
        name: 'string',
        slug: 'string',
        description: 'string',
        schoolId: 'string',
        type: 'string',
        duration: 'string',
        fee: 'number',
        capacity: 'number',
        enrolled: 'number',
        status: 'string',
        featuredImage: 'string',
      },
      defaults: {
        type: 'academic',
        fee: 0,
        capacity: 30,
        enrolled: 0,
        status: 'active',
      },
    },
    classes: {
      required: ['name', 'schoolId'],
      types: {
        name: 'string',
        slug: 'string',
        description: 'string',
        schoolId: 'string',
        teacherId: 'string',
        programId: 'string',
        schedule: 'object',
        capacity: 'number',
        enrolled: 'number',
        fee: 'number',
        status: 'string',
      },
      defaults: {
        capacity: 30,
        enrolled: 0,
        status: 'active',
      },
    },
    admissions: {
      required: ['studentName', 'email', 'schoolId'],
      types: {
        studentName: 'string',
        email: 'string',
        phone: 'string',
        parentName: 'string',
        parentEmail: 'string',
        parentPhone: 'string',
        schoolId: 'string',
        programId: 'string',
        grade: 'string',
        previousSchool: 'string',
        documents: 'array',
        status: 'string',
        notes: 'string',
        submittedAt: 'string',
        reviewedAt: 'string',
        reviewedBy: 'string',
      },
      defaults: {
        status: 'pending',
        documents: [],
      },
    },
    blog_posts: {
      required: ['title', 'content', 'schoolId'],
      types: {
        title: 'string',
        slug: 'string',
        content: 'string',
        excerpt: 'string',
        schoolId: 'string',
        authorId: 'string',
        status: 'string',
        featuredImage: 'string',
        publishedAt: 'string',
        tags: 'array',
        categories: 'array',
      },
      defaults: {
        status: 'draft',
        tags: [],
        categories: [],
      },
    },
    events: {
      required: ['title', 'date', 'schoolId'],
      types: {
        title: 'string',
        slug: 'string',
        description: 'string',
        date: 'string',
        startTime: 'string',
        endTime: 'string',
        location: 'string',
        schoolId: 'string',
        type: 'string',
        rsvpRequired: 'boolean',
        maxAttendees: 'number',
        currentAttendees: 'number',
        featuredImage: 'string',
        status: 'string',
      },
      defaults: {
        type: 'general',
        rsvpRequired: false,
        maxAttendees: 0,
        currentAttendees: 0,
        status: 'published',
      },
    },
    announcements: {
      required: ['title', 'content', 'schoolId'],
      types: {
        title: 'string',
        content: 'string',
        schoolId: 'string',
        authorId: 'string',
        priority: 'string',
        targetAudience: 'array',
        status: 'string',
        publishedAt: 'string',
        expiresAt: 'string',
      },
      defaults: {
        priority: 'normal',
        targetAudience: ['all'],
        status: 'published',
      },
    },
    gallery: {
      required: ['title', 'schoolId'],
      types: {
        title: 'string',
        slug: 'string',
        description: 'string',
        schoolId: 'string',
        images: 'array',
        category: 'string',
        featured: 'boolean',
      },
      defaults: {
        images: [],
        featured: false,
      },
    },
    faqs: {
      required: ['question', 'answer', 'schoolId'],
      types: {
        question: 'string',
        answer: 'string',
        schoolId: 'string',
        category: 'string',
        order: 'number',
        status: 'string',
      },
      defaults: {
        status: 'published',
        order: 0,
      },
    },
  },
  auth: {
    requireEmailVerification: true,
    otpTriggers: ['register', 'login'],
  },
};

// Initialize SDK instance
export const sdk = new UniversalSDK(sdkConfig);

// Initialize SDK on app start
sdk.init().catch(console.error);

export default sdk;

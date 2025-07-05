
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
        verified: 'boolean',
        roles: 'array',
        permissions: 'array',
        schoolId: 'string',
      },
      defaults: {
        verified: false,
        roles: [],
        permissions: [],
      },
    },
    schools: {
      required: ['name', 'slug', 'ownerId'],
      types: {
        name: 'string',
        slug: 'string',
        ownerId: 'string',
        logo: 'string',
        address: 'string',
        phone: 'string',
        email: 'string',
        website: 'string',
        timezone: 'string',
        currency: 'string',
        status: 'string',
        subscriptionPlan: 'string',
        subscriptionStatus: 'string',
      },
      defaults: {
        status: 'active',
        subscriptionPlan: 'standard',
        subscriptionStatus: 'trial',
        timezone: 'UTC',
        currency: 'USD',
      },
    },
    classes: {
      required: ['name', 'schoolId'],
      types: {
        name: 'string',
        description: 'string',
        schoolId: 'string',
        teacherId: 'string',
        schedule: 'object',
        capacity: 'number',
        enrolled: 'number',
      },
      defaults: {
        capacity: 30,
        enrolled: 0,
      },
    },
    programs: {
      required: ['name', 'schoolId'],
      types: {
        name: 'string',
        description: 'string',
        schoolId: 'string',
        type: 'string',
        duration: 'string',
        fee: 'number',
      },
      defaults: {
        type: 'academic',
        fee: 0,
      },
    },
    admissions: {
      required: ['studentName', 'email', 'schoolId'],
      types: {
        studentName: 'string',
        email: 'string',
        phone: 'string',
        schoolId: 'string',
        programId: 'string',
        status: 'string',
        documents: 'array',
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
        content: 'string',
        excerpt: 'string',
        schoolId: 'string',
        authorId: 'string',
        status: 'string',
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
        description: 'string',
        date: 'string',
        time: 'string',
        location: 'string',
        schoolId: 'string',
        type: 'string',
        rsvpRequired: 'boolean',
        maxAttendees: 'number',
      },
      defaults: {
        type: 'general',
        rsvpRequired: false,
        maxAttendees: 0,
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
        publishedAt: 'string',
        expiresAt: 'string',
      },
      defaults: {
        priority: 'normal',
        targetAudience: ['all'],
      },
    },
    gallery: {
      required: ['title', 'schoolId'],
      types: {
        title: 'string',
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
    pages: {
      required: ['title', 'slug', 'schoolId'],
      types: {
        title: 'string',
        slug: 'string',
        content: 'object',
        schoolId: 'string',
        template: 'string',
        status: 'string',
        seoTitle: 'string',
        seoDescription: 'string',
      },
      defaults: {
        status: 'published',
        template: 'default',
        content: { sections: [] },
      },
    },
    site_settings: {
      required: ['schoolId'],
      types: {
        schoolId: 'string',
        siteName: 'string',
        logo: 'string',
        favicon: 'string',
        primaryColor: 'string',
        secondaryColor: 'string',
        font: 'string',
        customDomain: 'string',
        seoSettings: 'object',
        socialLinks: 'object',
      },
      defaults: {
        primaryColor: '#4f46e5',
        secondaryColor: '#06b6d4',
        font: 'Inter',
        seoSettings: {},
        socialLinks: {},
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

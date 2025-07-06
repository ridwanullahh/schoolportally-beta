

import UniversalSDK from './sdk';

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'demo';
const githubRepo = import.meta.env.VITE_GITHUB_REPO || 'schoolportalbetadb';
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';

// Database schema configuration
const dbSchema = {
  users: {
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
  },
  schools: {
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
  },
  pages: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    slug: 'string',
    type: 'string',
    status: 'string',
    sections: 'array',
    createdAt: 'string',
    updatedAt: 'string'
  },
  admissions: {
    id: 'string',
    schoolId: 'string',
    studentName: 'string',
    email: 'string',
    phone: 'string',
    program: 'string',
    status: 'string',
    documents: 'array',
    createdAt: 'string'
  },
  programs: {
    id: 'string',
    schoolId: 'string',
    name: 'string',
    description: 'string',
    duration: 'string',
    price: 'number',
    status: 'string',
    createdAt: 'string'
  },
  classes: {
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
  },
  blog: {
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
  },
  faq: {
    id: 'string',
    schoolId: 'string',
    question: 'string',
    answer: 'string',
    category: 'string',
    order: 'number',
    status: 'string',
    createdAt: 'string'
  },
  announcements: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    content: 'string',
    priority: 'string',
    targetAudience: 'array',
    status: 'string',
    publishedAt: 'string',
    createdAt: 'string'
  },
  lms_courses: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    description: 'string',
    instructorId: 'string',
    status: 'string',
    createdAt: 'string'
  },
  lms_enrollments: {
    id: 'string',
    courseId: 'string',
    studentId: 'string',
    status: 'string',
    progress: 'number',
    enrolledAt: 'string'
  },
  lms_assignments: {
    id: 'string',
    courseId: 'string',
    title: 'string',
    description: 'string',
    dueDate: 'string',
    maxScore: 'number',
    createdAt: 'string'
  },
  forms: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    description: 'string',
    fields: 'array',
    embedCode: 'string',
    status: 'string',
    createdAt: 'string'
  },
  form_submissions: {
    id: 'string',
    formId: 'string',
    data: 'object',
    submittedAt: 'string'
  },
  wiki_articles: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    content: 'string',
    categoryId: 'string',
    authorId: 'string',
    status: 'string',
    createdAt: 'string'
  },
  wiki_categories: {
    id: 'string',
    schoolId: 'string',
    name: 'string',
    description: 'string',
    order: 'number',
    createdAt: 'string'
  },
  fees: {
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
  },
  events: {
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
  },
  gallery: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    description: 'string',
    imageUrl: 'string',
    category: 'string',
    createdAt: 'string'
  },
  jobs: {
    id: 'string',
    schoolId: 'string',
    title: 'string',
    description: 'string',
    requirements: 'string',
    location: 'string',
    type: 'string',
    status: 'string',
    createdAt: 'string'
  },
  job_applications: {
    id: 'string',
    jobId: 'string',
    applicantName: 'string',
    email: 'string',
    phone: 'string',
    resume: 'string',
    coverLetter: 'string',
    status: 'string',
    createdAt: 'string'
  },
  support_tickets: {
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
};

// Initialize SDK with configuration
const sdk = new UniversalSDK({
  owner: githubUsername,
  repo: githubRepo,
  token: githubToken,
  schemas: dbSchema
});

export default sdk;


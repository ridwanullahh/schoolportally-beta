
import UniversalSDK from './sdk';

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || 'demo';
const githubRepo = import.meta.env.VITE_GITHUB_REPO || 'schoolportalbetadb';
const githubToken = import.meta.env.VITE_GITHUB_TOKEN || '';

// Database schema configuration
const dbSchema = {
  users: {
    id: { type: 'string', required: true },
    email: { type: 'string', required: true },
    password: { type: 'string', required: true },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    roles: { type: 'array' },
    permissions: { type: 'array' },
    schoolId: { type: 'string' },
    verified: { type: 'boolean' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  schools: {
    id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    slug: { type: 'string' },
    ownerId: { type: 'string' },
    address: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    website: { type: 'string' },
    timezone: { type: 'string' },
    currency: { type: 'string' },
    status: { type: 'string' },
    subscriptionPlan: { type: 'string' },
    subscriptionStatus: { type: 'string' },
    onboardingCompleted: { type: 'boolean' },
    branding: { type: 'object' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  pages: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    slug: { type: 'string' },
    type: { type: 'string' },
    status: { type: 'string' },
    sections: { type: 'array' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },
  admissions: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    studentName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    program: { type: 'string' },
    status: { type: 'string' },
    documents: { type: 'array' },
    createdAt: { type: 'string' }
  },
  programs: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    name: { type: 'string' },
    description: { type: 'string' },
    duration: { type: 'string' },
    price: { type: 'number' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  classes: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    name: { type: 'string' },
    programId: { type: 'string' },
    teacherId: { type: 'string' },
    schedule: { type: 'string' },
    capacity: { type: 'number' },
    enrolled: { type: 'number' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  blog: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    slug: { type: 'string' },
    content: { type: 'string' },
    excerpt: { type: 'string' },
    authorId: { type: 'string' },
    status: { type: 'string' },
    publishedAt: { type: 'string' },
    createdAt: { type: 'string' }
  },
  faq: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    question: { type: 'string' },
    answer: { type: 'string' },
    category: { type: 'string' },
    order: { type: 'number' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  announcements: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    content: { type: 'string' },
    priority: { type: 'string' },
    targetAudience: { type: 'array' },
    status: { type: 'string' },
    publishedAt: { type: 'string' },
    createdAt: { type: 'string' }
  },
  lms_courses: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    instructorId: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  lms_enrollments: {
    id: { type: 'string', required: true },
    courseId: { type: 'string', required: true },
    studentId: { type: 'string', required: true },
    status: { type: 'string' },
    progress: { type: 'number' },
    enrolledAt: { type: 'string' }
  },
  lms_assignments: {
    id: { type: 'string', required: true },
    courseId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    dueDate: { type: 'string' },
    maxScore: { type: 'number' },
    createdAt: { type: 'string' }
  },
  forms: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    fields: { type: 'array' },
    embedCode: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  form_submissions: {
    id: { type: 'string', required: true },
    formId: { type: 'string', required: true },
    data: { type: 'object' },
    submittedAt: { type: 'string' }
  },
  wiki_articles: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    content: { type: 'string' },
    categoryId: { type: 'string' },
    authorId: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  wiki_categories: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    name: { type: 'string' },
    description: { type: 'string' },
    order: { type: 'number' },
    createdAt: { type: 'string' }
  },
  fees: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    studentId: { type: 'string' },
    type: { type: 'string' },
    amount: { type: 'number' },
    description: { type: 'string' },
    dueDate: { type: 'string' },
    status: { type: 'string' },
    paymentMethod: { type: 'string' },
    createdAt: { type: 'string' }
  },
  events: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    location: { type: 'string' },
    type: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  gallery: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    imageUrl: { type: 'string' },
    category: { type: 'string' },
    createdAt: { type: 'string' }
  },
  jobs: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    title: { type: 'string' },
    description: { type: 'string' },
    requirements: { type: 'string' },
    location: { type: 'string' },
    type: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  job_applications: {
    id: { type: 'string', required: true },
    jobId: { type: 'string', required: true },
    applicantName: { type: 'string' },
    email: { type: 'string' },
    phone: { type: 'string' },
    resume: { type: 'string' },
    coverLetter: { type: 'string' },
    status: { type: 'string' },
    createdAt: { type: 'string' }
  },
  support_tickets: {
    id: { type: 'string', required: true },
    schoolId: { type: 'string', required: true },
    userId: { type: 'string' },
    subject: { type: 'string' },
    description: { type: 'string' },
    priority: { type: 'string' },
    status: { type: 'string' },
    assignedTo: { type: 'string' },
    createdAt: { type: 'string' }
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

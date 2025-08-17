export interface PaymentResult {
  status: 'success' | 'failed';
  transactionId?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  message?: string;
}

export interface QuickFact {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  group?: string;
  graphPoint?: number;
}

export interface Branding {
  // Core brand colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Background colors
  primaryBackgroundColor?: string;
  secondaryBackgroundColor?: string;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;

  // Text colors
  primaryTextColor?: string;
  secondaryTextColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;

  // Button colors
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonTextColor?: string;

  // Additional colors
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  infoColor?: string;

  // Typography
  fontFamily?: string;
  headingFontFamily?: string;
  googleFontFamily?: string;
  fontWeight?: string;
  fontSize?: string;

  // Assets
  logoUrl?: string;
  faviconUrl?: string;

  // Style selections
  headerStyle?: string;
  footerStyle?: string;
  breadcrumbStyle?: string;
  theme?: string;
  currentTheme?: string;
}

// Theme System
export interface Theme {
  id: string;
  name: string;
  description?: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal' | 'bold';
  styles: {
    header: string;
    footer: string;
    breadcrumb: string;
    sections: { [sectionType: string]: string };
    archives: { [archiveType: string]: string };
    singlePosts: { [postType: string]: string };
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
  };
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Font System
export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';
  variants: string[];
  subsets: string[];
  source: 'google' | 'system' | 'custom';
  url?: string;
  preview?: string;
}

// AI Chat System
export interface AIChatSession {
  id: string;
  userId: string;
  schoolId: string;
  title: string;
  context: 'admin' | 'teacher' | 'student';
  contextData?: {
    subject?: string;
    class?: string;
    module?: string;
    lesson?: string;
  };
  messages: AIChatMessage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    model?: string;
    tokens?: number;
    processingTime?: number;
  };
}

export interface School {
  id: string;
  uid?: string;
  name: string;
  slug: string;
  ownerId: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
  currency?: string;
  status?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  onboardingCompleted?: boolean;
  branding?: Branding;
  createdAt: string;
  updatedAt: string;

  // Style configurations
  headerStyle?: string;
  footerStyle?: string;
  blogPostStyle?: string;
  blogArchiveStyle?: string;
  announcementPostStyle?: string;
  announcementArchiveStyle?: string;
  eventPostStyle?: string;
  eventArchiveStyle?: string;
  programPostStyle?: string;
  programArchiveStyle?: string;
  classPostStyle?: string;
  classArchiveStyle?: string;
  coursePostStyle?: string;
  courseArchiveStyle?: string;
  galleryPostStyle?: string;
  galleryArchiveStyle?: string;
  elibraryBookPostStyle?: string;
  elibraryBookArchiveStyle?: string;
  knowledgebasePostStyle?: string;
  knowledgebaseArchiveStyle?: string;
  faqPostStyle?: string;
  faqArchiveStyle?: string;
  jobPostStyle?: string;
  jobArchiveStyle?: string;
}

export interface Section {
  id: string;
  type: string;
  content: { [key: string]: any };
  styleId: string;
  settings?: { [key: string]: any };
  order: number;
  visible: boolean;
}

export interface Page {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  sections?: Section[];
  seoTitle?: string;
  seoDescription?: string;
  showOnHeader?: boolean;
  showOnFooter?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  uid?: string;
  schoolId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published' | 'archived';
  authorId: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[];
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  views?: number;
  likes?: number;
  comments?: any[];
  relatedPosts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  uid?: string;
  schoolId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  status: 'draft' | 'published' | 'archived';
  featuredImage?: string;
  images?: string[];
  category?: string;
  tags?: string[];
  inventory?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Enhanced LMS System Types

// Live Class System
export interface LiveClass {
  id: string;
  schoolId: string;
  teacherId: string;
  title: string;
  description?: string;
  subject?: string;
  classId?: string;
  scheduleId?: string;
  roomId: string;
  accessCode?: string;
  requiresAccessCode: boolean;
  maxParticipants?: number;
  status: 'scheduled' | 'waiting' | 'live' | 'ended' | 'cancelled';
  startTime: string;
  endTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  settings: LiveClassSettings;
  participants: LiveClassParticipant[];
  recordings?: LiveClassRecording[];
  polls?: LiveClassPoll[];
  qna?: LiveClassQnA[];
  chat?: LiveClassMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface LiveClassSettings {
  allowStudentCamera: boolean;
  allowStudentMicrophone: boolean;
  allowStudentScreenShare: boolean;
  allowStudentChat: boolean;
  muteStudentsOnJoin: boolean;
  disableStudentCameraOnJoin: boolean;
  enableWaitingRoom: boolean;
  enableRecording: boolean;
  enableBreakoutRooms: boolean;
  maxChatMessageLength: number;
  allowHandRaising: boolean;
  allowPrivateChat: boolean;
  enableWhiteboard: boolean;
  enableFileSharing: boolean;
}

export interface LiveClassParticipant {
  id: string;
  userId: string;
  userType: 'teacher' | 'student';
  displayName: string;
  avatar?: string;
  joinedAt: string;
  leftAt?: string;
  status: 'waiting' | 'joined' | 'left' | 'kicked';
  permissions: {
    camera: boolean;
    microphone: boolean;
    screenShare: boolean;
    chat: boolean;
    handRaised: boolean;
  };
  connectionStatus: 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
  mediaStatus: {
    camera: boolean;
    microphone: boolean;
    screenShare: boolean;
  };
}

export interface LiveClassMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderType: 'teacher' | 'student';
  content: string;
  type: 'text' | 'file' | 'system';
  isPrivate: boolean;
  recipientId?: string;
  timestamp: string;
  edited?: boolean;
  editedAt?: string;
}

export interface LiveClassPoll {
  id: string;
  classId: string;
  createdBy: string;
  question: string;
  options: LiveClassPollOption[];
  type: 'multiple-choice' | 'single-choice' | 'text' | 'rating';
  isAnonymous: boolean;
  allowMultipleAnswers: boolean;
  timeLimit?: number;
  status: 'draft' | 'active' | 'ended';
  responses: LiveClassPollResponse[];
  createdAt: string;
  endedAt?: string;
}

export interface LiveClassPollOption {
  id: string;
  text: string;
  order: number;
}

export interface LiveClassPollResponse {
  id: string;
  pollId: string;
  userId: string;
  userName: string;
  selectedOptions: string[];
  textResponse?: string;
  rating?: number;
  submittedAt: string;
}

export interface LiveClassQnA {
  id: string;
  classId: string;
  askerId: string;
  askerName: string;
  question: string;
  answer?: string;
  answeredBy?: string;
  answeredAt?: string;
  status: 'pending' | 'answered' | 'dismissed';
  isAnonymous: boolean;
  upvotes: string[];
  createdAt: string;
}

export interface LiveClassRecording {
  id: string;
  classId: string;
  title: string;
  duration: number;
  fileUrl: string;
  thumbnailUrl?: string;
  size: number;
  format: string;
  quality: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}

// Module and Lesson System
export interface LMSModule {
  id: string;
  schoolId: string;
  classId?: string;
  subjectId?: string;
  title: string;
  description?: string;
  order: number;
  status: 'draft' | 'published' | 'archived';
  lessons: LMSLesson[];
  prerequisites?: string[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  content: LMSLessonContent;
  order: number;
  status: 'draft' | 'published' | 'archived';
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment' | 'live-class';
  estimatedDuration: number;
  resources: LMSResource[];
  assignments?: LMSAssignment[];
  quizzes?: LMSQuiz[];
  prerequisites?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSLessonContent {
  type: 'video' | 'text' | 'interactive' | 'mixed';
  videoUrl?: string;
  videoDuration?: number;
  textContent?: string;
  interactiveElements?: LMSInteractiveElement[];
  attachments?: LMSAttachment[];
}

export interface LMSInteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'discussion' | 'code-editor' | 'whiteboard' | 'simulation';
  title: string;
  content: any;
  position: number;
  required: boolean;
}

export interface LMSResource {
  id: string;
  title: string;
  description?: string;
  type: 'file' | 'link' | 'video' | 'audio' | 'image';
  url: string;
  fileSize?: number;
  mimeType?: string;
  downloadable: boolean;
  createdAt: string;
}

export interface LMSAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

// Assignment System
export interface LMSAssignment {
  id: string;
  lessonId?: string;
  moduleId?: string;
  classId?: string;
  subjectId?: string;
  title: string;
  description: string;
  instructions: string;
  type: 'essay' | 'multiple-choice' | 'file-upload' | 'code' | 'presentation';
  maxPoints: number;
  dueDate: string;
  allowLateSubmission: boolean;
  latePenalty?: number;
  submissionFormat: string[];
  maxFileSize?: number;
  rubric?: LMSRubric;
  submissions: LMSSubmission[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content?: string;
  files?: LMSAttachment[];
  submittedAt: string;
  status: 'draft' | 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  isLate: boolean;
}

export interface LMSRubric {
  id: string;
  criteria: LMSRubricCriterion[];
  totalPoints: number;
}

export interface LMSRubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  levels: LMSRubricLevel[];
}

export interface LMSRubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

// Quiz System
export interface LMSQuiz {
  id: string;
  lessonId?: string;
  moduleId?: string;
  classId?: string;
  subjectId?: string;
  title: string;
  description?: string;
  instructions: string;
  questions: LMSQuizQuestion[];
  timeLimit?: number;
  maxAttempts: number;
  passingScore: number;
  showCorrectAnswers: boolean;
  showScoreImmediately: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  attempts: LMSQuizAttempt[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface LMSQuizQuestion {
  id: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'ordering';
  question: string;
  explanation?: string;
  points: number;
  options?: LMSQuizOption[];
  correctAnswers: string[];
  order: number;
  required: boolean;
}

export interface LMSQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface LMSQuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: LMSQuizAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  submittedAt?: string;
  timeSpent: number;
  attemptNumber: number;
}

export interface LMSQuizAnswer {
  questionId: string;
  selectedOptions: string[];
  textAnswer?: string;
  isCorrect: boolean;
  pointsEarned: number;
}

// Forum System
export interface ForumCategory {
  id: string;
  schoolId: string;
  classId?: string;
  subjectId?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
  isPrivate: boolean;
  allowedRoles: string[];
  moderators: string[];
  threads: ForumThread[];
  createdAt: string;
  updatedAt: string;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  status: 'open' | 'closed' | 'pinned' | 'locked';
  tags?: string[];
  views: number;
  likes: number;
  replies: ForumReply[];
  lastReplyAt?: string;
  lastReplyBy?: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  parentReplyId?: string;
  likes: number;
  isEdited: boolean;
  editedAt?: string;
  attachments?: LMSAttachment[];
  createdAt: string;
  updatedAt: string;
}

// Breadcrumb System
export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface BreadcrumbStyle {
  id: string;
  name: string;
  category: string;
  cssClass: string;
  preview?: string;
}

// WebRTC and Real-time Communication
export interface WebRTCConnection {
  id: string;
  userId: string;
  peerId: string;
  classId: string;
  connectionType: 'offer' | 'answer';
  sdp?: string;
  iceCandidates: RTCIceCandidate[];
  status: 'connecting' | 'connected' | 'disconnected' | 'failed';
  createdAt: string;
}

export interface MediaStream {
  id: string;
  userId: string;
  classId: string;
  type: 'camera' | 'microphone' | 'screen';
  isActive: boolean;
  quality: 'low' | 'medium' | 'high';
  constraints: MediaStreamConstraints;
}

// Rate Limiting for AI
export interface AIRateLimit {
  userId: string;
  requests: number;
  windowStart: number;
  windowDuration: number;
  maxRequests: number;
}

// Enhanced User Types for LMS
export interface LMSUser {
  id: string;
  schoolId: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  status: 'active' | 'inactive' | 'suspended';
  classes?: string[];
  subjects?: string[];
  permissions: LMSPermissions;
  preferences: LMSUserPreferences;
  progress?: LMSProgress;
  createdAt: string;
  updatedAt: string;
}

export interface LMSPermissions {
  canCreateClasses: boolean;
  canManageStudents: boolean;
  canCreateAssignments: boolean;
  canGradeAssignments: boolean;
  canStartLiveClasses: boolean;
  canModerateForums: boolean;
  canAccessAnalytics: boolean;
  canManageContent: boolean;
}

export interface LMSUserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
    assignments: boolean;
    grades: boolean;
    announcements: boolean;
    liveClasses: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
    showProfile: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
}

export interface LMSProgress {
  modulesCompleted: string[];
  lessonsCompleted: string[];
  assignmentsSubmitted: string[];
  quizzesTaken: string[];
  totalTimeSpent: number;
  lastActivity: string;
  achievements: string[];
  currentStreak: number;
  longestStreak: number;
}

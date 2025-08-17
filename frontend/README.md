# SchoolPortally Beta

A comprehensive school management platform built with React, TypeScript, and modern web technologies. Now featuring advanced LMS capabilities, AI-powered assistance, and comprehensive theming system.

## 🚀 New Features (Latest Update)

### 🤖 AI-Powered Floating Chat Assistant
- **Context-Aware AI**: Gemini 2.5-flash powered chat with role-based context (Admin, Teacher, Student)
- **Multiple API Keys**: Automatic failover with rate limiting protection
- **Session Management**: Multiple chat sessions with persistent history
- **Smart Context**: Automatically adapts responses based on current page/module

### 📚 Enhanced LMS System
- **Live Classes**: Google Meet-style interface with WebRTC support
  - Real-time video/audio communication
  - Interactive whiteboard and screen sharing
  - Live polls and Q&A sessions
  - Participant management and waiting rooms
  - Class recordings and playback
- **Module & Lesson Management**: Structured course content with prerequisites
- **Assignment System**: Multiple assignment types with rubric-based grading
- **Quiz Engine**: Various question types with auto-grading
- **Discussion Forums**: Threaded discussions with moderation tools

### 🎨 Advanced Theming System
- **11 Pre-designed Themes**: Modern, Classic, Creative, Minimal, and Bold categories
- **8 Breadcrumb Styles**: Multiple navigation styles with responsive design
- **Google Fonts Integration**: 15+ carefully selected fonts for educational websites
- **Custom Font Upload**: Support for custom font files
- **Theme Customizer**: Real-time color and typography customization
- **Theme Import/Export**: Share and backup custom themes

### 🧭 Smart Navigation
- **Dynamic Breadcrumbs**: Auto-generated from URL structure
- **Multiple Breadcrumb Styles**: Arrow, Slash, Dots, Chevron, Line, Pill, Gradient, Card
- **Responsive Design**: Mobile-optimized navigation patterns
- **Context-Aware**: Specialized breadcrumbs for different content types

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **UI Components**: Radix UI + Custom Components
- **Icons**: Lucide React
- **Build Tool**: Vite
- **AI Integration**: Google Gemini 2.5-flash
- **Real-time**: WebSocket/Socket.IO for live features
- **Media**: WebRTC for video communication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ridwanullahh/schoolportally-beta.git
cd schoolportally-beta
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```env
# GitHub Configuration (Required)
VITE_GITHUB_OWNER=your-github-username
VITE_GITHUB_REPO=your-repo-name
VITE_GITHUB_TOKEN=your-github-personal-access-token

# Cloudinary Configuration (Required for media upload)
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_API_SECRET=your-api-secret

# AI Configuration (Gemini 2.5-flash)
VITE_GEMINI_API_KEY_1=your-primary-gemini-api-key
VITE_GEMINI_API_KEY_2=your-secondary-gemini-api-key
VITE_GEMINI_API_KEY_3=your-tertiary-gemini-api-key

# WebRTC Configuration (for Live Classes)
VITE_WEBRTC_STUN_SERVER=stun:stun.l.google.com:19302
VITE_WEBRTC_TURN_SERVER=turn:your-turn-server.com:3478

# Real-time Features
VITE_WEBSOCKET_URL=ws://localhost:3001
VITE_SOCKET_IO_URL=http://localhost:3001
```

5. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/              # Admin panel components
│   │   ├── ThemeManager.tsx
│   │   └── FontSelector.tsx
│   ├── lms/                # LMS components
│   │   ├── EnhancedLiveClass.tsx
│   │   ├── LiveClassChat.tsx
│   │   ├── LiveClassPoll.tsx
│   │   ├── LiveClassQnA.tsx
│   │   ├── LiveClassParticipants.tsx
│   │   └── PreLiveClassInterface.tsx
│   ├── shared/             # Shared components
│   │   ├── FloatingAIChat.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── ModernLiveClass.tsx
│   └── ui/                 # Base UI components
├── services/               # Business logic services
│   ├── aiService.ts        # AI chat functionality
│   ├── themeService.ts     # Theme management
│   └── fontService.ts      # Font management
├── themes/
│   └── styles/
│       └── breadcrumbs.css # Breadcrumb styling
├── types/                  # TypeScript definitions
│   └── index.ts           # Enhanced with LMS, AI, and theme types
├── pages/                  # Page components
├── contexts/               # React contexts
├── hooks/                  # Custom React hooks
└── lib/                    # Utility libraries
```

## 🎯 Key Features

### Multi-tenant Architecture
- Support for multiple schools with isolated data
- Dynamic branding per school
- Role-based access control

### Content Management
- Blog posts, events, announcements
- Dynamic page builder
- SEO optimization
- Media management

### LMS Capabilities
- Live video classes with WebRTC
- Course and lesson management
- Assignment and quiz systems
- Discussion forums
- Progress tracking

### AI Integration
- Context-aware chat assistant
- Role-based responses (Admin/Teacher/Student)
- Rate limiting and failover protection
- Session management

### Theming System
- 11 pre-designed themes
- Custom theme creation
- Google Fonts integration
- Responsive breadcrumb navigation

## 🔧 Configuration

### AI Chat Setup
1. Get Gemini API keys from Google AI Studio
2. Configure multiple keys for redundancy
3. Set rate limits and timeout values
4. Customize context prompts for different user roles

### Live Classes Setup
1. Configure WebRTC STUN/TURN servers
2. Set up WebSocket server for real-time communication
3. Configure media constraints and quality settings
4. Set up recording storage (optional)

### Theme Customization
1. Access Theme Manager in admin panel
2. Select from pre-designed themes or create custom
3. Configure fonts from Google Fonts or upload custom
4. Set breadcrumb styles and navigation preferences

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
- Configure production environment variables
- Set up HTTPS for WebRTC functionality
- Configure CORS for API endpoints
- Set up CDN for media assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Changelog

### v2.0.0 (Latest)
- ✨ Added AI-powered floating chat assistant
- 🎓 Enhanced LMS with live classes and WebRTC
- 🎨 Comprehensive theming system with 11 themes
- 🧭 Smart breadcrumb navigation with 8 styles
- 📝 Advanced assignment and quiz systems
- 💬 Real-time discussion forums
- 🎯 Context-aware AI responses
- 📱 Mobile-optimized live class interface

### v1.0.0
- 🏫 Multi-tenant school management
- 📝 Content management system
- 👥 User management and roles
- 🎨 Basic theming and branding
- 📱 Responsive design

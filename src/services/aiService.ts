import { AIChatSession, AIChatMessage, AIRateLimit } from '@/types';

class AIService {
  private apiKeys: string[] = [];
  private currentKeyIndex = 0;
  private rateLimits = new Map<string, AIRateLimit>();
  private conversationMemory = new Map<string, AIChatMessage[]>();
  private model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
  private maxRequestsPerMinute = parseInt(import.meta.env.VITE_AI_RATE_LIMIT_PER_MINUTE) || 10;
  private requestTimeout = parseInt(import.meta.env.VITE_AI_REQUEST_TIMEOUT) || 30000;
  private maxConversationHistory = 10; // Keep last 10 messages for context

  constructor() {
    this.initializeApiKeys();
  }

  private initializeApiKeys() {
    // Load multiple API keys from environment
    const keys = [
      import.meta.env.VITE_GEMINI_API_KEY_1,
      import.meta.env.VITE_GEMINI_API_KEY_2,
      import.meta.env.VITE_GEMINI_API_KEY_3,
    ].filter(Boolean);

    if (keys.length === 0) {
      console.warn('No Gemini API keys found in environment variables');
      return;
    }

    this.apiKeys = keys;
  }

  private getNextApiKey(): string {
    if (this.apiKeys.length === 0) {
      throw new Error('No API keys available');
    }

    const key = this.apiKeys[this.currentKeyIndex];
    this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
    return key;
  }

  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowDuration = 60000; // 1 minute
    
    let userLimit = this.rateLimits.get(userId);
    
    if (!userLimit) {
      userLimit = {
        userId,
        requests: 0,
        windowStart: now,
        windowDuration,
        maxRequests: this.maxRequestsPerMinute
      };
      this.rateLimits.set(userId, userLimit);
    }

    // Reset window if expired
    if (now - userLimit.windowStart >= windowDuration) {
      userLimit.requests = 0;
      userLimit.windowStart = now;
    }

    // Check if limit exceeded
    if (userLimit.requests >= userLimit.maxRequests) {
      return false;
    }

    userLimit.requests++;
    return true;
  }

  private getContextPrompt(context: string, contextData?: any): string {
    const basePrompts = {
      admin: `You are an AI assistant helping a school administrator. You can help with:
        - Content creation for website sections and marketing materials
        - School management strategies and operational efficiency
        - Educational policies and procedures development
        - Marketing and communication strategies
        - Data analysis and reporting insights
        - Technology integration planning
        - Budget planning and resource allocation
        - Staff management and professional development
        - Student enrollment and retention strategies
        - Compliance and regulatory requirements
        - Crisis management and emergency planning
        - Community engagement and partnerships`,

      teacher: `You are an AI assistant helping a teacher. You can help with:
        - Lesson planning and curriculum development
        - Creating educational content and materials
        - Assessment and grading strategies
        - Classroom management techniques
        - Student engagement activities and interactive learning
        - Educational technology integration
        - Parent communication strategies
        - Differentiated instruction for diverse learners
        - Special needs accommodation strategies
        - Professional development planning
        - Research-based teaching methodologies
        - Student progress tracking and analytics`,
      
      student: `You are an AI assistant helping a student. You can help with:
        - Understanding course materials and concepts
        - Study strategies and techniques
        - Assignment and project guidance
        - Research assistance
        - Time management and organization
        - Academic goal setting
        - Learning resources and references`
    };

    let prompt = basePrompts[context as keyof typeof basePrompts] || basePrompts.student;

    if (contextData) {
      if (contextData.subject) {
        prompt += `\n\nCurrent subject context: ${contextData.subject}`;
      }
      if (contextData.class) {
        prompt += `\nCurrent class context: ${contextData.class}`;
      }
      if (contextData.module) {
        prompt += `\nCurrent module context: ${contextData.module}`;
      }
      if (contextData.lesson) {
        prompt += `\nCurrent lesson context: ${contextData.lesson}`;
      }
    }

    prompt += `\n\nPlease provide helpful, accurate, and educational responses. Keep responses concise but comprehensive.`;

    return prompt;
  }

  private getConversationHistory(sessionId: string): AIChatMessage[] {
    return this.conversationMemory.get(sessionId) || [];
  }

  private addToConversationMemory(sessionId: string, message: AIChatMessage): void {
    const history = this.getConversationHistory(sessionId);
    history.push(message);

    // Keep only the last N messages to prevent context overflow
    if (history.length > this.maxConversationHistory) {
      history.splice(0, history.length - this.maxConversationHistory);
    }

    this.conversationMemory.set(sessionId, history);
  }

  private buildConversationContext(sessionId: string, currentMessage: string): any[] {
    const history = this.getConversationHistory(sessionId);
    const contents = [];

    // Add conversation history
    history.forEach(msg => {
      contents.push({
        parts: [{ text: `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}` }]
      });
    });

    // Add current message
    contents.push({
      parts: [{ text: `User: ${currentMessage}` }]
    });

    return contents;
  }

  async sendMessage(
    sessionId: string,
    message: string,
    userId: string,
    context: string,
    contextData?: any
  ): Promise<AIChatMessage> {
    // Check rate limit
    if (!this.checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Please wait before sending another message.');
    }

    const apiKey = this.getNextApiKey();
    const contextPrompt = this.getContextPrompt(context, contextData);

    // Create user message for memory
    const userMessage: AIChatMessage = {
      id: `msg_${Date.now()}_user`,
      sessionId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Add user message to conversation memory
    this.addToConversationMemory(sessionId, userMessage);

    try {
      // Build conversation context with history
      const conversationContents = this.buildConversationContext(sessionId, message);

      // Prepend system context
      const systemContent = {
        parts: [{ text: contextPrompt }]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [systemContent, ...conversationContents],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: AbortSignal.timeout(this.requestTimeout)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from AI');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      const processingTime = Date.now();

      const assistantMessage: AIChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        metadata: {
          model: this.model,
          tokens: data.usageMetadata?.totalTokenCount || 0,
          processingTime: processingTime - Date.now()
        }
      };

      // Add AI response to conversation memory
      this.addToConversationMemory(sessionId, assistantMessage);

      return assistantMessage;

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Fallback response for errors
      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again in a moment.',
        timestamp: new Date().toISOString(),
        metadata: {
          model: this.model,
          tokens: 0,
          processingTime: 0
        }
      };
    }
  }

  async createSession(
    userId: string,
    schoolId: string,
    context: string,
    title?: string,
    contextData?: any
  ): Promise<AIChatSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: sessionId,
      userId,
      schoolId,
      title: title || `${context.charAt(0).toUpperCase() + context.slice(1)} Chat`,
      context: context as 'admin' | 'teacher' | 'student',
      contextData,
      messages: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  getRemainingRequests(userId: string): number {
    const userLimit = this.rateLimits.get(userId);
    if (!userLimit) return this.maxRequestsPerMinute;
    
    const now = Date.now();
    if (now - userLimit.windowStart >= userLimit.windowDuration) {
      return this.maxRequestsPerMinute;
    }
    
    return Math.max(0, userLimit.maxRequests - userLimit.requests);
  }

  getTimeUntilReset(userId: string): number {
    const userLimit = this.rateLimits.get(userId);
    if (!userLimit) return 0;
    
    const now = Date.now();
    const timeRemaining = userLimit.windowDuration - (now - userLimit.windowStart);
    return Math.max(0, timeRemaining);
  }
}

export const aiService = new AIService();
export default aiService;

import sdk from '@/lib/sdk-config';
import { 
  LiveClass, 
  LMSModule, 
  LMSLesson, 
  LMSAssignment, 
  LMSQuiz, 
  LMSSubmission,
  LMSQuizAttempt,
  LiveClassParticipant,
  LiveClassMessage,
  LiveClassPoll,
  LiveClassQnA
} from '@/types';

class LMSService {
  // Live Classes
  async createLiveClass(classData: Omit<LiveClass, 'id' | 'createdAt' | 'updatedAt'>): Promise<LiveClass> {
    const liveClass: LiveClass = {
      ...classData,
      id: `live_class_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await sdk.insert('live_classes', liveClass);
    return liveClass;
  }

  async getLiveClasses(schoolId: string): Promise<LiveClass[]> {
    const allClasses = await sdk.get<LiveClass>('live_classes');
    return allClasses.filter(cls => cls.schoolId === schoolId);
  }

  async getLiveClassById(classId: string): Promise<LiveClass | null> {
    const allClasses = await sdk.get<LiveClass>('live_classes');
    return allClasses.find(cls => cls.id === classId) || null;
  }

  async updateLiveClass(classId: string, updates: Partial<LiveClass>): Promise<void> {
    await sdk.update('live_classes', classId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteLiveClass(classId: string): Promise<void> {
    await sdk.delete('live_classes', classId);
  }

  // Live Class Participants
  async addParticipant(classId: string, participant: Omit<LiveClassParticipant, 'joinedAt'>): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const newParticipant: LiveClassParticipant = {
      ...participant,
      joinedAt: new Date().toISOString()
    };

    const updatedParticipants = [...(liveClass.participants || []), newParticipant];
    await this.updateLiveClass(classId, { participants: updatedParticipants });
  }

  async removeParticipant(classId: string, participantId: string): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const updatedParticipants = (liveClass.participants || []).filter(p => p.id !== participantId);
    await this.updateLiveClass(classId, { participants: updatedParticipants });
  }

  async updateParticipant(classId: string, participantId: string, updates: Partial<LiveClassParticipant>): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const updatedParticipants = (liveClass.participants || []).map(p => 
      p.id === participantId ? { ...p, ...updates } : p
    );
    await this.updateLiveClass(classId, { participants: updatedParticipants });
  }

  // Live Class Chat
  async sendMessage(classId: string, message: Omit<LiveClassMessage, 'id' | 'timestamp'>): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const newMessage: LiveClassMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    const updatedChat = [...(liveClass.chat || []), newMessage];
    await this.updateLiveClass(classId, { chat: updatedChat });
  }

  // Live Class Polls
  async createPoll(classId: string, poll: Omit<LiveClassPoll, 'id' | 'createdAt'>): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const newPoll: LiveClassPoll = {
      ...poll,
      id: `poll_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedPolls = [...(liveClass.polls || []), newPoll];
    await this.updateLiveClass(classId, { polls: updatedPolls });
  }

  async submitPollResponse(classId: string, pollId: string, response: any): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const updatedPolls = (liveClass.polls || []).map(poll => {
      if (poll.id === pollId) {
        return {
          ...poll,
          responses: [...(poll.responses || []), response]
        };
      }
      return poll;
    });

    await this.updateLiveClass(classId, { polls: updatedPolls });
  }

  // Live Class Q&A
  async askQuestion(classId: string, question: Omit<LiveClassQnA, 'id' | 'createdAt'>): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const newQuestion: LiveClassQnA = {
      ...question,
      id: `qna_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const updatedQnA = [...(liveClass.qna || []), newQuestion];
    await this.updateLiveClass(classId, { qna: updatedQnA });
  }

  async answerQuestion(classId: string, questionId: string, answer: string, answeredBy: string): Promise<void> {
    const liveClass = await this.getLiveClassById(classId);
    if (!liveClass) throw new Error('Live class not found');

    const updatedQnA = (liveClass.qna || []).map(item => {
      if (item.id === questionId) {
        return {
          ...item,
          answer,
          answeredBy,
          answeredAt: new Date().toISOString(),
          status: 'answered' as const
        };
      }
      return item;
    });

    await this.updateLiveClass(classId, { qna: updatedQnA });
  }

  // Modules
  async createModule(moduleData: Omit<LMSModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<LMSModule> {
    const module: LMSModule = {
      ...moduleData,
      id: `module_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await sdk.insert('lms_modules', module);
    return module;
  }

  async getModules(schoolId: string, classId?: string, subjectId?: string): Promise<LMSModule[]> {
    const allModules = await sdk.get<LMSModule>('lms_modules');
    return allModules.filter(module => {
      if (module.schoolId !== schoolId) return false;
      if (classId && module.classId !== classId) return false;
      if (subjectId && module.subjectId !== subjectId) return false;
      return true;
    });
  }

  async updateModule(moduleId: string, updates: Partial<LMSModule>): Promise<void> {
    await sdk.update('lms_modules', moduleId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }

  // Lessons
  async createLesson(lessonData: Omit<LMSLesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<LMSLesson> {
    const lesson: LMSLesson = {
      ...lessonData,
      id: `lesson_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await sdk.insert('lms_lessons', lesson);
    return lesson;
  }

  async getLessons(moduleId: string): Promise<LMSLesson[]> {
    const allLessons = await sdk.get<LMSLesson>('lms_lessons');
    return allLessons.filter(lesson => lesson.moduleId === moduleId);
  }

  // Assignments
  async createAssignment(assignmentData: Omit<LMSAssignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<LMSAssignment> {
    const assignment: LMSAssignment = {
      ...assignmentData,
      id: `assignment_${Date.now()}`,
      submissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await sdk.insert('lms_assignments', assignment);
    return assignment;
  }

  async getAssignments(schoolId: string, classId?: string, subjectId?: string): Promise<LMSAssignment[]> {
    const allAssignments = await sdk.get<LMSAssignment>('lms_assignments');
    return allAssignments.filter(assignment => {
      // Filter logic based on class/subject association
      return true; // Simplified for now
    });
  }

  async submitAssignment(assignmentId: string, submission: Omit<LMSSubmission, 'id' | 'submittedAt'>): Promise<void> {
    const allAssignments = await sdk.get<LMSAssignment>('lms_assignments');
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    if (!assignment) throw new Error('Assignment not found');

    const newSubmission: LMSSubmission = {
      ...submission,
      id: `submission_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      isLate: new Date() > new Date(assignment.dueDate)
    };

    const updatedSubmissions = [...assignment.submissions, newSubmission];
    await sdk.update('lms_assignments', assignmentId, { 
      submissions: updatedSubmissions,
      updatedAt: new Date().toISOString()
    });
  }

  // Quizzes
  async createQuiz(quizData: Omit<LMSQuiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<LMSQuiz> {
    const quiz: LMSQuiz = {
      ...quizData,
      id: `quiz_${Date.now()}`,
      attempts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await sdk.insert('lms_quizzes', quiz);
    return quiz;
  }

  async submitQuizAttempt(quizId: string, attempt: Omit<LMSQuizAttempt, 'id' | 'submittedAt'>): Promise<void> {
    const allQuizzes = await sdk.get<LMSQuiz>('lms_quizzes');
    const quiz = allQuizzes.find(q => q.id === quizId);
    
    if (!quiz) throw new Error('Quiz not found');

    const newAttempt: LMSQuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}`,
      submittedAt: new Date().toISOString()
    };

    const updatedAttempts = [...quiz.attempts, newAttempt];
    await sdk.update('lms_quizzes', quizId, { 
      attempts: updatedAttempts,
      updatedAt: new Date().toISOString()
    });
  }

  // Integration with existing systems
  async syncWithExistingData(): Promise<void> {
    try {
      // Sync existing live class schedules
      const schedules = await sdk.get('live_class_schedules');
      
      for (const schedule of schedules) {
        // Convert old schedule format to new LiveClass format
        const existingClass = await this.getLiveClassById(schedule.id);
        
        if (!existingClass) {
          await this.createLiveClass({
            schoolId: schedule.schoolId || '',
            teacherId: schedule.teacherId || '',
            title: schedule.title || 'Live Class',
            description: schedule.description || '',
            subject: schedule.subject || '',
            classId: schedule.classId || '',
            roomId: schedule.roomId || schedule.id,
            status: schedule.status === 'ongoing' ? 'live' : 'scheduled',
            startTime: schedule.startTime || new Date().toISOString(),
            endTime: schedule.endTime || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            settings: {
              allowStudentCamera: true,
              allowStudentMicrophone: true,
              allowStudentScreenShare: false,
              allowStudentChat: true,
              muteStudentsOnJoin: true,
              disableStudentCameraOnJoin: false,
              enableWaitingRoom: false,
              enableRecording: false,
              enableBreakoutRooms: false,
              maxChatMessageLength: 500,
              allowHandRaising: true,
              allowPrivateChat: false,
              enableWhiteboard: true,
              enableFileSharing: true
            },
            participants: [],
            chat: [],
            polls: [],
            qna: []
          });
        }
      }
    } catch (error) {
      console.error('Error syncing LMS data:', error);
    }
  }
}

export const lmsService = new LMSService();
export default lmsService;

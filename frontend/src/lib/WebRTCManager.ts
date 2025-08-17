// Enhanced WebRTC Manager for Live Classes
import Peer from 'peerjs';

export interface Participant {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  joinedAt: string;
}

export interface WebRTCSettings {
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

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'public' | 'private';
  recipientId?: string;
  isModerated?: boolean;
}

export interface WhiteboardData {
  type: 'draw' | 'erase' | 'clear' | 'shape';
  data: any;
  timestamp: string;
  userId: string;
}

class WebRTCManager {
  private peer: Peer | null = null;
  private localStream: MediaStream | null = null;
  private connections: Map<string, RTCPeerConnection> = new Map();
  private participants: Map<string, Participant> = new Map();
  private chatMessages: ChatMessage[] = [];
  private whiteboardData: WhiteboardData[] = [];
  private isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // Event callbacks
  public onParticipantJoined?: (participant: Participant) => void;
  public onParticipantLeft?: (participantId: string) => void;
  public onStreamReceived?: (stream: MediaStream, participantId: string) => void;
  public onChatMessage?: (message: ChatMessage) => void;
  public onWhiteboardUpdate?: (data: WhiteboardData) => void;
  public onRecordingStarted?: () => void;
  public onRecordingStopped?: (blob: Blob) => void;
  public onError?: (error: Error) => void;

  constructor(
    private userId: string,
    private userName: string,
    private userRole: 'teacher' | 'student',
    private classSettings: WebRTCSettings
  ) {}

  async initialize(): Promise<void> {
    try {
      // Initialize PeerJS
      this.peer = new Peer(this.userId, {
        host: 'localhost', // Replace with your PeerJS server
        port: 9000,
        path: '/peerjs',
        debug: 2
      });

      this.peer.on('open', (id) => {
        console.log('Peer connected with ID:', id);
      });

      this.peer.on('connection', (conn) => {
        this.handleDataConnection(conn);
      });

      this.peer.on('call', (call) => {
        this.handleIncomingCall(call);
      });

      this.peer.on('error', (error) => {
        console.error('Peer error:', error);
        this.onError?.(error);
      });

      // Get user media
      await this.getUserMedia();

    } catch (error) {
      console.error('Failed to initialize WebRTC:', error);
      this.onError?.(error as Error);
    }
  }

  private async getUserMedia(): Promise<void> {
    try {
      const constraints: MediaStreamConstraints = {
        video: this.userRole === 'teacher' || this.classSettings.allowStudentCamera,
        audio: this.userRole === 'teacher' || this.classSettings.allowStudentMicrophone
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Add self as participant
      const selfParticipant: Participant = {
        id: this.userId,
        name: this.userName,
        role: this.userRole,
        isVideoEnabled: !this.classSettings.disableStudentCameraOnJoin || this.userRole === 'teacher',
        isAudioEnabled: !this.classSettings.muteStudentsOnJoin || this.userRole === 'teacher',
        isScreenSharing: false,
        isHandRaised: false,
        joinedAt: new Date().toISOString()
      };

      this.participants.set(this.userId, selfParticipant);
      this.onParticipantJoined?.(selfParticipant);

    } catch (error) {
      console.error('Failed to get user media:', error);
      this.onError?.(error as Error);
    }
  }

  async joinClass(classId: string): Promise<void> {
    if (!this.peer) {
      throw new Error('WebRTC not initialized');
    }

    // Connect to existing participants
    // This would typically involve getting participant list from server
    // For now, we'll simulate this
    console.log('Joining class:', classId);
  }

  async connectToParticipant(participantId: string): Promise<void> {
    if (!this.peer || !this.localStream) {
      throw new Error('WebRTC not initialized or no local stream');
    }

    try {
      // Create data connection
      const dataConn = this.peer.connect(participantId);
      this.handleDataConnection(dataConn);

      // Create media call
      const call = this.peer.call(participantId, this.localStream);
      this.handleOutgoingCall(call, participantId);

    } catch (error) {
      console.error('Failed to connect to participant:', error);
      this.onError?.(error as Error);
    }
  }

  private handleDataConnection(conn: any): void {
    // TODO: type the connection when PeerJS types are available in your project

    conn.on('open', () => {
      console.log('Data connection opened with:', conn.peer);
    });

    conn.on('data', (data: any) => {
      this.handleDataMessage(data, conn.peer);
    });

    conn.on('close', () => {
      console.log('Data connection closed with:', conn.peer);
    });
  }

  private handleIncomingCall(call: any): void {
    if (this.localStream) {
      call.answer(this.localStream);
      this.handleCallStream(call);
    }
  }

  private handleOutgoingCall(call: any, participantId: string): void {
    this.handleCallStream(call);
  }

  private handleCallStream(call: any): void {
    call.on('stream', (remoteStream: MediaStream) => {
      console.log('Received remote stream from:', call.peer);
      this.onStreamReceived?.(remoteStream, call.peer);
    });

    call.on('close', () => {
      console.log('Call closed with:', call.peer);
      this.participants.delete(call.peer);
      this.onParticipantLeft?.(call.peer);
    });
  }

  private handleDataMessage(data: any, senderId: string): void {
    switch (data.type) {
      case 'chat':
        this.handleChatMessage(data.message, senderId);
        break;
      case 'whiteboard':
        this.handleWhiteboardData(data.data);
        break;
      case 'participant-update':
        this.handleParticipantUpdate(data.participant);
        break;
      default:
        console.log('Unknown data message type:', data.type);
    }
  }

  // Chat functionality
  sendChatMessage(content: string, recipientId?: string): void {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: this.userId,
      senderName: this.userName,
      content: content.slice(0, this.classSettings.maxChatMessageLength),
      timestamp: new Date().toISOString(),
      type: recipientId ? 'private' : 'public',
      recipientId
    };

    this.chatMessages.push(message);
    this.onChatMessage?.(message);

    // Broadcast to other participants
    this.broadcastData({
      type: 'chat',
      message
    });
  }

  private handleChatMessage(message: ChatMessage, senderId: string): void {
    this.chatMessages.push(message);
    this.onChatMessage?.(message);
  }

  // Whiteboard functionality
  sendWhiteboardData(data: any): void {
    const whiteboardData: WhiteboardData = {
      type: data.type,
      data: data.data,
      timestamp: new Date().toISOString(),
      userId: this.userId
    };

    this.whiteboardData.push(whiteboardData);
    this.onWhiteboardUpdate?.(whiteboardData);

    // Broadcast to other participants
    this.broadcastData({
      type: 'whiteboard',
      data: whiteboardData
    });
  }

  private handleWhiteboardData(data: WhiteboardData): void {
    this.whiteboardData.push(data);
    this.onWhiteboardUpdate?.(data);
  }

  // Media controls
  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.updateParticipantStatus({ isVideoEnabled: videoTrack.enabled });
      }
    }
  }

  toggleAudio(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.updateParticipantStatus({ isAudioEnabled: audioTrack.enabled });
      }
    }
  }

  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      // Replace video track in all connections
      const videoTrack = screenStream.getVideoTracks()[0];
      this.connections.forEach((connection) => {
        const sender = connection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      this.updateParticipantStatus({ isScreenSharing: true });

      screenStream.getVideoTracks()[0].onended = () => {
        this.stopScreenShare();
      };

    } catch (error) {
      console.error('Failed to start screen share:', error);
      this.onError?.(error as Error);
    }
  }

  async stopScreenShare(): Promise<void> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      
      // Replace screen share track with camera track
      this.connections.forEach((connection) => {
        const sender = connection.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });

      this.updateParticipantStatus({ isScreenSharing: false });
    }
  }

  // Recording functionality
  async startRecording(): Promise<void> {
    if (!this.localStream) {
      throw new Error('No local stream available for recording');
    }

    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.localStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.onRecordingStopped?.(blob);
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.onRecordingStarted?.();

    } catch (error) {
      console.error('Failed to start recording:', error);
      this.onError?.(error as Error);
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  // Utility methods
  private updateParticipantStatus(updates: Partial<Participant>): void {
    const participant = this.participants.get(this.userId);
    if (participant) {
      Object.assign(participant, updates);
      this.participants.set(this.userId, participant);
      
      // Broadcast update to other participants
      this.broadcastData({
        type: 'participant-update',
        participant
      });
    }
  }

  private handleParticipantUpdate(participant: Participant): void {
    this.participants.set(participant.id, participant);
  }

  private broadcastData(data: any): void {
    // This would broadcast to all connected participants
    // Implementation depends on your signaling server
    console.log('Broadcasting data:', data);
  }

  getParticipants(): Participant[] {
    return Array.from(this.participants.values());
  }

  getChatMessages(): ChatMessage[] {
    return this.chatMessages;
  }

  getWhiteboardData(): WhiteboardData[] {
    return this.whiteboardData;
  }

  disconnect(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    this.connections.forEach(connection => connection.close());
    this.connections.clear();

    if (this.peer) {
      this.peer.destroy();
    }

    this.participants.clear();
    this.chatMessages = [];
    this.whiteboardData = [];
  }
}

export default WebRTCManager;

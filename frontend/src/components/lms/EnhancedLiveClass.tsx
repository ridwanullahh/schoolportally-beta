import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, 
  MessageCircle, Users, Hand, Settings, Phone, 
  Camera, CameraOff, Volume2, VolumeX, MoreVertical,
  Send, Smile, Paperclip, UserCheck, UserX
} from 'lucide-react';
import { LiveClass, LiveClassParticipant, LiveClassMessage, LiveClassSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
// Import components will be created separately

interface EnhancedLiveClassProps {
  classData: LiveClass;
  onLeaveClass: () => void;
  onEndClass?: () => void;
}

export const EnhancedLiveClass: React.FC<EnhancedLiveClassProps> = ({
  classData,
  onLeaveClass,
  onEndClass
}) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [participants, setParticipants] = useState<LiveClassParticipant[]>(classData.participants || []);
  const [messages, setMessages] = useState<LiveClassMessage[]>(classData.chat || []);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants' | 'polls' | 'qna'>('chat');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const ws = useRef<WebSocket | null>(null);

  const isTeacher = user?.role === 'teacher';
  const settings = classData.settings;

  useEffect(() => {
    initializeWebRTC();
    connectWebSocket();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled && (isTeacher || settings.allowStudentCamera),
        audio: isAudioEnabled && (isTeacher || settings.allowStudentMicrophone)
      });
      
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to get user media:', error);
    }
  };

  const connectWebSocket = () => {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001';
    ws.current = new WebSocket(`${wsUrl}/live-class/${classData.id}`);
    
    ws.current.onopen = () => {
      console.log('Connected to live class WebSocket');
      // Join the class
      ws.current?.send(JSON.stringify({
        type: 'join',
        userId: user?.id,
        userName: user?.name,
        userType: user?.role
      }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from live class WebSocket');
      // Attempt to reconnect
      setTimeout(connectWebSocket, 3000);
    };
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'participant-joined':
        setParticipants(prev => [...prev, data.participant]);
        break;
      case 'participant-left':
        setParticipants(prev => prev.filter(p => p.id !== data.participantId));
        break;
      case 'message':
        setMessages(prev => [...prev, data.message]);
        break;
      case 'hand-raised':
        setParticipants(prev => prev.map(p => 
          p.id === data.participantId 
            ? { ...p, permissions: { ...p.permissions, handRaised: data.raised } }
            : p
        ));
        break;
      case 'media-toggle':
        setParticipants(prev => prev.map(p => 
          p.id === data.participantId 
            ? { ...p, mediaStatus: { ...p.mediaStatus, [data.mediaType]: data.enabled } }
            : p
        ));
        break;
      case 'screen-share':
        handleScreenShare(data);
        break;
      case 'webrtc-offer':
      case 'webrtc-answer':
      case 'webrtc-ice-candidate':
        handleWebRTCSignaling(data);
        break;
    }
  };

  const handleWebRTCSignaling = async (data: any) => {
    const { fromUserId, type, payload } = data;
    
    let pc = peerConnections.current.get(fromUserId);
    if (!pc) {
      pc = createPeerConnection(fromUserId);
      peerConnections.current.set(fromUserId, pc);
    }

    switch (type) {
      case 'webrtc-offer':
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.current?.send(JSON.stringify({
          type: 'webrtc-answer',
          toUserId: fromUserId,
          payload: answer
        }));
        break;
      case 'webrtc-answer':
        await pc.setRemoteDescription(new RTCSessionDescription(payload));
        break;
      case 'webrtc-ice-candidate':
        await pc.addIceCandidate(new RTCIceCandidate(payload));
        break;
    }
  };

  const createPeerConnection = (userId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers from environment
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current?.send(JSON.stringify({
          type: 'webrtc-ice-candidate',
          toUserId: userId,
          payload: event.candidate
        }));
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStreams(prev => new Map(prev.set(userId, remoteStream)));
    };

    // Add local stream tracks
    if (localStream) {
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  };

  const toggleVideo = async () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        // Notify other participants
        ws.current?.send(JSON.stringify({
          type: 'media-toggle',
          mediaType: 'camera',
          enabled: videoTrack.enabled
        }));
      }
    }
  };

  const toggleAudio = async () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        
        // Notify other participants
        ws.current?.send(JSON.stringify({
          type: 'media-toggle',
          mediaType: 'microphone',
          enabled: audioTrack.enabled
        }));
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
        
        // Replace video track in peer connections
        const videoTrack = screenStream.getVideoTracks()[0];
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => 
            s.track && s.track.kind === 'video'
          );
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        // Notify other participants
        ws.current?.send(JSON.stringify({
          type: 'screen-share',
          enabled: true,
          userId: user?.id
        }));
        
        screenStream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } else {
        stopScreenShare();
      }
    } catch (error) {
      console.error('Screen share error:', error);
    }
  };

  const stopScreenShare = async () => {
    if (screenShareRef.current?.srcObject) {
      const stream = screenShareRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      screenShareRef.current.srcObject = null;
    }
    
    setIsScreenSharing(false);
    
    // Restore camera video
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      peerConnections.current.forEach(pc => {
        const sender = pc.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
    
    // Notify other participants
    ws.current?.send(JSON.stringify({
      type: 'screen-share',
      enabled: false,
      userId: user?.id
    }));
  };

  const toggleHandRaise = () => {
    const newHandRaised = !handRaised;
    setHandRaised(newHandRaised);
    
    ws.current?.send(JSON.stringify({
      type: 'hand-raise',
      raised: newHandRaised
    }));
  };

  const sendMessage = (content: string) => {
    const message: LiveClassMessage = {
      id: `msg_${Date.now()}`,
      classId: classData.id,
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderType: user?.role as 'teacher' | 'student',
      content,
      type: 'text',
      isPrivate: false,
      timestamp: new Date().toISOString()
    };
    
    ws.current?.send(JSON.stringify({
      type: 'message',
      message
    }));
  };

  const endClass = () => {
    if (isTeacher && onEndClass) {
      ws.current?.send(JSON.stringify({
        type: 'end-class'
      }));
      onEndClass();
    }
  };

  const leaveClass = () => {
    ws.current?.send(JSON.stringify({
      type: 'leave'
    }));
    onLeaveClass();
  };

  const cleanup = () => {
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    
    // Close WebSocket
    if (ws.current) {
      ws.current.close();
    }
  };

  const handleScreenShare = (data: any) => {
    // Handle incoming screen share from other participants
    console.log('Screen share update:', data);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{classData.title}</h1>
          <p className="text-sm text-gray-400">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
            className="text-white hover:bg-gray-700"
          >
            <Users size={20} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="text-white hover:bg-gray-700"
          >
            <MessageCircle size={20} />
          </Button>
          
          {isTeacher && (
            <Button
              variant="destructive"
              size="sm"
              onClick={endClass}
            >
              End Class
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={leaveClass}
          >
            <Phone size={20} className="mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Screen Share or Main Video */}
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            {isScreenSharing ? (
              <video
                ref={screenShareRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 p-4 w-full h-full">
                {/* Local Video */}
                <div className="relative bg-gray-700 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                    You {handRaised && '✋'}
                  </div>
                </div>
                
                {/* Remote Videos */}
                {Array.from(remoteStreams.entries()).map(([userId, stream]) => {
                  const participant = participants.find(p => p.userId === userId);
                  return (
                    <div key={userId} className="relative bg-gray-700 rounded-lg overflow-hidden">
                      <video
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                        ref={(video) => {
                          if (video) video.srcObject = stream;
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
                        {participant?.displayName} {participant?.permissions.handRaised && '✋'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-90 px-6 py-3 rounded-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudio}
                className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVideo}
                className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-600' : 'bg-red-600'}`}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </Button>
              
              {(isTeacher || settings.allowStudentScreenShare) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-blue-600' : 'bg-gray-600'}`}
                >
                  {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                </Button>
              )}
              
              {settings.allowHandRaising && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleHandRaise}
                  className={`p-3 rounded-full ${handRaised ? 'bg-yellow-600' : 'bg-gray-600'}`}
                >
                  <Hand size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {(isChatOpen || isParticipantsOpen) && (
          <div className="w-80 bg-gray-800 border-l border-gray-700">
            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              {['chat', 'participants', 'polls', 'qna'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 px-4 text-sm font-medium capitalize ${
                    activeTab === tab 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'qna' ? 'Q&A' : tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="h-full">
              {activeTab === 'chat' && (
                <LiveClassChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  currentUserId={user?.id || ''}
                />
              )}
              
              {activeTab === 'participants' && (
                <LiveClassParticipants
                  participants={participants}
                  isTeacher={isTeacher}
                  settings={settings}
                />
              )}
              
              {activeTab === 'polls' && (
                <LiveClassPoll
                  classId={classData.id}
                  isTeacher={isTeacher}
                  polls={classData.polls || []}
                />
              )}
              
              {activeTab === 'qna' && (
                <LiveClassQnA
                  classId={classData.id}
                  isTeacher={isTeacher}
                  qnaItems={classData.qna || []}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLiveClass;

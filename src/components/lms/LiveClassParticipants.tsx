import React, { useState } from 'react';
import { 
  Users, Mic, MicOff, Video, VideoOff, Hand, 
  UserCheck, UserX, Volume2, VolumeX, MoreVertical,
  Crown, Shield, Eye, EyeOff
} from 'lucide-react';
import { LiveClassParticipant, LiveClassSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LiveClassParticipantsProps {
  participants: LiveClassParticipant[];
  isTeacher: boolean;
  settings: LiveClassSettings;
  onToggleParticipantMedia?: (participantId: string, mediaType: 'camera' | 'microphone', enabled: boolean) => void;
  onKickParticipant?: (participantId: string) => void;
  onPromoteToModerator?: (participantId: string) => void;
  onMuteAll?: () => void;
  onUnmuteAll?: () => void;
  onDisableAllCameras?: () => void;
  onEnableAllCameras?: () => void;
}

export const LiveClassParticipants: React.FC<LiveClassParticipantsProps> = ({
  participants,
  isTeacher,
  settings,
  onToggleParticipantMedia,
  onKickParticipant,
  onPromoteToModerator,
  onMuteAll,
  onUnmuteAll,
  onDisableAllCameras,
  onEnableAllCameras
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  const teachers = participants.filter(p => p.userType === 'teacher');
  const students = participants.filter(p => p.userType === 'student');
  const connectedParticipants = participants.filter(p => p.status === 'joined');
  const waitingParticipants = participants.filter(p => p.status === 'waiting');

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'connecting':
      case 'reconnecting':
        return 'text-yellow-400';
      case 'disconnected':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return '●';
      case 'connecting':
      case 'reconnecting':
        return '◐';
      case 'disconnected':
        return '○';
      default:
        return '○';
    }
  };

  const handleToggleMedia = (participantId: string, mediaType: 'camera' | 'microphone') => {
    const participant = participants.find(p => p.id === participantId);
    if (!participant) return;

    const currentStatus = participant.mediaStatus[mediaType];
    onToggleParticipantMedia?.(participantId, mediaType, !currentStatus);
  };

  const ParticipantItem: React.FC<{ participant: LiveClassParticipant }> = ({ participant }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg group">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={participant.avatar} />
          <AvatarFallback className="bg-gray-600 text-white">
            {participant.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {/* Connection Status */}
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
          participant.connectionStatus === 'connected' ? 'bg-green-400' :
          participant.connectionStatus === 'connecting' || participant.connectionStatus === 'reconnecting' ? 'bg-yellow-400' :
          'bg-red-400'
        }`} />
      </div>

      {/* Participant Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-white font-medium truncate">
            {participant.displayName}
          </span>
          
          {participant.userType === 'teacher' && (
            <Crown size={14} className="text-yellow-400" />
          )}
          
          {participant.permissions.handRaised && (
            <Hand size={14} className="text-yellow-400" />
          )}
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <span className={getConnectionStatusColor(participant.connectionStatus)}>
            {getConnectionStatusIcon(participant.connectionStatus)} {participant.connectionStatus}
          </span>
          <span>•</span>
          <span>{participant.userType}</span>
        </div>
      </div>

      {/* Media Status */}
      <div className="flex items-center space-x-1">
        <div className={`p-1 rounded ${
          participant.mediaStatus.microphone ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {participant.mediaStatus.microphone ? (
            <Mic size={12} className="text-white" />
          ) : (
            <MicOff size={12} className="text-white" />
          )}
        </div>
        
        <div className={`p-1 rounded ${
          participant.mediaStatus.camera ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {participant.mediaStatus.camera ? (
            <Video size={12} className="text-white" />
          ) : (
            <VideoOff size={12} className="text-white" />
          )}
        </div>
      </div>

      {/* Actions */}
      {isTeacher && participant.userType === 'student' && (
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(showActions === participant.id ? null : participant.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={14} />
          </Button>

          {showActions === participant.id && (
            <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-48">
              <div className="py-1">
                <button
                  onClick={() => handleToggleMedia(participant.id, 'microphone')}
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  {participant.mediaStatus.microphone ? <MicOff size={14} /> : <Mic size={14} />}
                  <span>{participant.mediaStatus.microphone ? 'Mute' : 'Unmute'}</span>
                </button>
                
                <button
                  onClick={() => handleToggleMedia(participant.id, 'camera')}
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  {participant.mediaStatus.camera ? <VideoOff size={14} /> : <Video size={14} />}
                  <span>{participant.mediaStatus.camera ? 'Disable Camera' : 'Enable Camera'}</span>
                </button>
                
                <div className="border-t border-gray-600 my-1" />
                
                <button
                  onClick={() => onPromoteToModerator?.(participant.id)}
                  className="w-full px-3 py-2 text-left text-sm text-white hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Shield size={14} />
                  <span>Make Moderator</span>
                </button>
                
                <button
                  onClick={() => onKickParticipant?.(participant.id)}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <UserX size={14} />
                  <span>Remove from Class</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Participants</h3>
          <span className="text-sm text-gray-400">
            {connectedParticipants.length} connected
          </span>
        </div>

        {/* Teacher Controls */}
        {isTeacher && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onMuteAll}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-300 hover:text-white"
            >
              <MicOff size={12} className="mr-1" />
              Mute All
            </Button>
            
            <Button
              onClick={onUnmuteAll}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-300 hover:text-white"
            >
              <Mic size={12} className="mr-1" />
              Unmute All
            </Button>
            
            <Button
              onClick={onDisableAllCameras}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-300 hover:text-white"
            >
              <VideoOff size={12} className="mr-1" />
              Disable Cameras
            </Button>
            
            <Button
              onClick={onEnableAllCameras}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-300 hover:text-white"
            >
              <Video size={12} className="mr-1" />
              Enable Cameras
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        {/* Waiting Room */}
        {waitingParticipants.length > 0 && isTeacher && (
          <div className="p-4 border-b border-gray-700">
            <h4 className="font-medium text-yellow-400 mb-3 flex items-center">
              <Eye size={16} className="mr-2" />
              Waiting Room ({waitingParticipants.length})
            </h4>
            <div className="space-y-2">
              {waitingParticipants.map(participant => (
                <div key={participant.id} className="flex items-center justify-between p-2 bg-yellow-900 bg-opacity-30 rounded">
                  <span className="text-white">{participant.displayName}</span>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <UserCheck size={14} />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      <UserX size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teachers */}
        {teachers.length > 0 && (
          <div className="p-4">
            <h4 className="font-medium text-gray-300 mb-3 flex items-center">
              <Crown size={16} className="mr-2" />
              Teachers ({teachers.length})
            </h4>
            <div className="space-y-1">
              {teachers.map(participant => (
                <ParticipantItem key={participant.id} participant={participant} />
              ))}
            </div>
          </div>
        )}

        {/* Students */}
        <div className="p-4">
          <h4 className="font-medium text-gray-300 mb-3 flex items-center">
            <Users size={16} className="mr-2" />
            Students ({students.length})
          </h4>
          
          {students.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>No students in class</p>
            </div>
          ) : (
            <div className="space-y-1">
              {students.map(participant => (
                <ParticipantItem key={participant.id} participant={participant} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-750">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-white">{connectedParticipants.length}</div>
            <div className="text-xs text-gray-400">Connected</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-400">
              {participants.filter(p => p.mediaStatus.microphone).length}
            </div>
            <div className="text-xs text-gray-400">Unmuted</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-400">
              {participants.filter(p => p.mediaStatus.camera).length}
            </div>
            <div className="text-xs text-gray-400">Video On</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveClassParticipants;

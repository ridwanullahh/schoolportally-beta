import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import LiveClassManager from '@/lib/LiveClassManager';
import { Input } from '../ui/input';
import { Video, Mic, VideoOff, MicOff, PhoneOff, Users, MessageSquare, Edit, ScreenShare } from 'lucide-react';
import WaitingRoom from './WaitingRoom';
import sdk from '@/lib/sdk-config';
import Whiteboard from './Whiteboard';
import Poll from './Poll';
import QandA from './QandA';
import Participants from './Participants';
import { useParams } from 'react-router-dom';

const ModernLiveClass = () => {
    const { user } = useAuth();
    const { roomId } = useParams();
    const [peerId, setPeerId] = useState('');
    const [inCall, setInCall] = useState(false);
    const [stream, setStream] = useState(null);
    const [isTeacher, setIsTeacher] = useState(false);
    const videoGridRef = useRef(null);
    const myVideoRef = useRef(null);
    const liveClassManager = useRef<LiveClassManager | null>(null);

    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [handRaised, setHandRaised] = useState(false);
    const [raisedHands, setRaisedHands] = useState({});
    const [schedule, setSchedule] = useState(null);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [showChat, setShowChat] = useState(true);
    const [showQandA, setShowQandA] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
       setIsTeacher(user.userType === 'teacher');
       
       const onStream = (remoteStream) => {
           const video = document.createElement('video');
           addVideoStream(video, remoteStream);
       }

       const onData = (data) => {
           if (data.type === 'chat') {
               setChatMessages(prev => [...prev, data.message]);
           } else if (data.type === 'hand-raise') {
               setRaisedHands(prev => ({ ...prev, [data.userId]: true }));
           } else if (data.type === 'hand-lower') {
               setRaisedHands(prev => ({ ...prev, [data.userId]: false }));
           } else if (data.type === 'user-joined') {
               setParticipants(prev => [...prev, data.user]);
           } else if (data.type === 'user-left') {
               setParticipants(prev => prev.filter(p => p.id !== data.userId));
           } else if (data.type === 'mute-user') {
               if (data.userId === user.id) {
                   toggleMic(false);
               }
           } else if (data.type === 'camera-off-user') {
               if (data.userId === user.id) {
                   toggleVideo(false);
               }
           }
       };
       
       const onPeerLeft = (peerId) => {
           // remove video element of peer that left
       }

       liveClassManager.current = new LiveClassManager(user.id, onStream, onPeerLeft, onData);

       navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(localStream => {
           setStream(localStream);
           liveClassManager.current?.start(localStream);
           if(myVideoRef.current) {
               addVideoStream(myVideoRef.current, localStream);
           }
       });

    }, []);

    const addVideoStream = (video, stream) => {
        if(video) {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            if(videoGridRef.current) {
                videoGridRef.current.append(video);
            }
        }
    }
    
    // Placeholder for a more robust connection logic
    const connectToNewUser = (userId) => {
       liveClassManager.current?.connect(userId);
    }

    if(!inCall && !isTeacher) {
        return <WaitingRoom onJoin={() => setInCall(true)} stream={stream} />
    }
   
   const startClass = async () => {
       setInCall(true);
       const allSchedules = await sdk.get('live_class_schedules');
       const relevantSchedule = allSchedules.find(s => s.subjectId === roomId && s.status === 'scheduled');
       if (relevantSchedule) {
           await sdk.update('live_class_schedules', relevantSchedule.id, { status: 'ongoing' });
           setSchedule(relevantSchedule);
       }
       // simplified broadcast
       if(liveClassManager.current) {
           // const conn = liveClassManager.current.peer.connect(roomId);
           // conn.on('open', () => {
           //     conn.send({type: 'class-started'});
           // });
       }
   }
   
    const toggleVideo = (forceState?: boolean) => {
        const targetState = forceState ?? !isVideoOn;
        if (myVideoRef.current && myVideoRef.current.srcObject) {
            myVideoRef.current.srcObject.getVideoTracks().forEach(track => track.enabled = targetState);
            setIsVideoOn(targetState);
        }
    };

    const toggleMic = (forceState?: boolean) => {
        const targetState = forceState ?? !isMicOn;
        if (myVideoRef.current && myVideoRef.current.srcObject) {
            myVideoRef.current.srcObject.getAudioTracks().forEach(track => track.enabled = targetState);
            setIsMicOn(targetState);
        }
    };
    
    const endCall = async () => {
        if (liveClassManager.current) {
            liveClassManager.current.destroy();
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        setInCall(false);
        if (isTeacher && schedule) {
            await sdk.update('live_class_schedules', schedule.id, { status: 'ended' });
        }
        // Redirect or update UI
    }

    const sendChatMessage = () => {
        if (chatInput.trim() === '') return;
        const message = { user: user.firstName, text: chatInput };
        setChatMessages(prev => [...prev, message]);
        if (liveClassManager.current) {
            liveClassManager.current.broadcast({ type: 'chat', message });
        }
        setChatInput('');
    }

    const shareScreen = async () => {
        if (!liveClassManager.current) return;

        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            liveClassManager.current.replaceTrack(screenStream.getVideoTracks()[0]);
            setIsScreenSharing(true);

            screenStream.getVideoTracks()[0].onended = () => {
                stopScreenShare();
            };
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    };

    const stopScreenShare = () => {
        if (!liveClassManager.current || !stream) return;
        liveClassManager.current.replaceTrack(stream.getVideoTracks()[0]);
        setIsScreenSharing(false);
    };

    const toggleHandRaise = () => {
        const newHandRaisedState = !handRaised;
        setHandRaised(newHandRaisedState);
        if (liveClassManager.current) {
            const event = newHandRaisedState ? 'hand-raise' : 'hand-lower';
            liveClassManager.current.broadcast({ type: event, userId: user.id });
        }
    };

    const handleMuteUser = (userId) => {
        if (liveClassManager.current) {
            liveClassManager.current.broadcast({ type: 'mute-user', userId });
        }
    };

    const handleCameraOffUser = (userId) => {
        if (liveClassManager.current) {
            liveClassManager.current.broadcast({ type: 'camera-off-user', userId });
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <div className="flex flex-col flex-1">
                <div className="flex-1 flex">
                    <div ref={videoGridRef} className="grid flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        <video ref={myVideoRef} muted={true} className="w-full h-full object-cover rounded-lg" autoPlay playsInline></video>
                    </div>
                    {showChat && (
                        <div className="w-80 bg-gray-800 p-4 flex flex-col">
                            <h3 className="text-lg font-bold mb-4">Chat</h3>
                            <div className="flex-1 overflow-y-auto mb-4">
                                {chatMessages.map((msg, i) => (
                                    <p key={i}><strong>{msg.user}:</strong> {msg.text}</p>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="bg-gray-700 border-gray-600" />
                                <Button onClick={sendChatMessage}>Send</Button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-gray-800 p-4 flex justify-center items-center gap-4">
                   {isTeacher && !inCall && <Button onClick={startClass}>Start Class</Button>}
                   {inCall && (
                       <>
                           <Button onClick={() => toggleMic()} variant="ghost">{isMicOn ? <Mic size={24} /> : <MicOff size={24}/>}</Button>
                           <Button onClick={() => toggleVideo()} variant="ghost">{isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}</Button>
                           <Button onClick={endCall} variant="destructive"><PhoneOff size={24} /></Button>
                           <Button onClick={() => setShowChat(!showChat)} variant="ghost"><MessageSquare size={24} /></Button>
                           <Button onClick={() => setShowWhiteboard(!showWhiteboard)} variant="ghost"><Edit size={24} /></Button>
                           <Button onClick={isScreenSharing ? stopScreenShare : shareScreen} variant="ghost">
                               <ScreenShare size={24} />
                               {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                           </Button>
                           <Button onClick={toggleHandRaise} variant={handRaised ? "default" : "ghost"}>Hand</Button>
                           {/* Simple display of who has hands raised. This can be improved with a participant list UI */}
                           <div className="flex items-center gap-2">
                               {Object.entries(raisedHands).map(([userId, isRaised]) => (
                                   isRaised ? <span key={userId}>User {userId} </span> : null
                               ))}
                           </div>
                          <Button onClick={() => setShowQandA(!showQandA)} variant="ghost">Q&A</Button>
                          <Button onClick={() => setShowParticipants(!showParticipants)} variant="ghost"><Users size={24} /></Button>
                       </>
                   )}
                </div>
           </div>
           {showWhiteboard && (
               <div className="w-1/3 bg-gray-800 p-4">
                    <h3 className="text-lg font-bold">Whiteboard</h3>
                    <Whiteboard />
                    <div className="mt-8">
                       <Poll classId={roomId} liveClassManager={liveClassManager.current} />
                    </div>
               </div>
           )}
           {showQandA && (
               <div className="w-1/3 bg-gray-800 p-4">
                   <QandA classId={roomId} />
               </div>
           )}
           {showParticipants && (
               <div className="w-1/3 bg-gray-800 p-4">
                   <Participants
                       participants={participants}
                       onMute={handleMuteUser}
                       onCameraOff={handleCameraOffUser}
                       isTeacher={isTeacher}
                   />
               </div>
           )}
        </div>
    )
}

export default ModernLiveClass;
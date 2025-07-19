import React, { useRef, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Video, Mic, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

const WaitingRoom = ({ onJoin, stream }) => {
    const videoRef = useRef(null);
   const [devices, setDevices] = useState({video: false, audio: false});

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
       navigator.mediaDevices.enumerateDevices().then(devices => {
           const video = devices.some(d => d.kind === 'videoinput');
           const audio = devices.some(d => d.kind === 'audioinput');
           setDevices({video, audio});
       })
    }, [stream]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to join?</h2>
            <div className="w-full max-w-md bg-gray-700 rounded-lg overflow-hidden">
                <video ref={videoRef} className="w-full" autoPlay playsInline muted />
            </div>
            <div className="flex gap-4 mt-4">
               <div className={`flex items-center gap-2 ${devices.audio ? 'text-green-400' : 'text-red-400'}`}>
                   {devices.audio ? <CheckCircle /> : <AlertTriangle />}
                   Microphone
               </div>
               <div className={`flex items-center gap-2 ${devices.video ? 'text-green-400' : 'text-red-400'}`}>
                   {devices.video ? <CheckCircle /> : <AlertTriangle />}
                   Camera
               </div>
            </div>
            <Button onClick={onJoin} className="mt-8">
                <Phone className="mr-2" /> Join Now
            </Button>
        </div>
    );
};

export default WaitingRoom;
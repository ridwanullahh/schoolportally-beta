import React from 'react';
import { Button } from '../ui/button';
import { MicOff, VideoOff } from 'lucide-react';

const Participants = ({ participants, onMute, onCameraOff, isTeacher }) => {
    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Participants</h3>
            <div className="space-y-2">
                {participants.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg">
                        <span>{p.name}</span>
                        {isTeacher && (
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => onMute(p.id)}><MicOff size={16} /></Button>
                                <Button size="sm" onClick={() => onCameraOff(p.id)}><VideoOff size={16} /></Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Participants;
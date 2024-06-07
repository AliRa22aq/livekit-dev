import { Participant } from 'livekit-client'; // Make sure to import LiveKitParticipant type if available
import React, { useState, useEffect } from 'react';
import { Room } from 'livekit-client';
import { useSearchParams } from 'next/navigation';
import { LiveKitRoom, RoomContext, useMaybeRoomContext, useRoomContext, useToken } from '@livekit/components-react';
import { useRoom } from '@livekit/react-core';

interface Props {
    participants: Participant[]; // Update the type of participants
}

const ParticipantList: React.FC<Props> = ({ participants }) => {
    return (
        <div>
            <h2>Participants</h2>
            <ul>
                {participants.map(participant => (
                    <li key={participant.sid}>{participant.identity}</li>
                ))}
            </ul>
        </div>
    );
};



const IndexPage = () => {
    // State to hold participants
    const params = useSearchParams();
    const roomName = params?.get('room') ?? 'PlanetMoon';
    const userIdentity = params?.get('user')!;

    const [participants, setParticipants] = useState<Participant[]>([]);
    const [room, setRoom] = useState(new Room());

    const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT!, roomName, {
        userInfo: {
            identity: userIdentity,
            name: userIdentity,
        },
    });
    
    
    
    useEffect(() => {
        // Initialize LiveKit room and connect
        const room = new Room();
        // room.connect(process.env.NEXT_PUBLIC_LK_SERVER_URL!, token!);

        setRoom(room);

        console.log("room: ", room.name);
        setParticipants((prevParticipants) => [...prevParticipants, room.localParticipant])
        
        // Listen for participant events
        room.on('participantConnected', (participant) => {
            setParticipants((prevParticipants) => [...prevParticipants, participant]);
        });

        room.on('participantDisconnected', (participant) => {
            setParticipants(prevParticipants => prevParticipants.filter(p => p.sid !== participant.sid));
        });

        // Clean up on component unmount
        return () => {
            room.disconnect();
        };
    }, [token]); // Run only once on component mount

    return (
        <LiveKitRoom
            room={room}
            token={token}
            serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
            connect={true}
            >
            <h1>Welcome to the Twitter Space Clone</h1>
            <ParticipantList participants={participants} />
        </LiveKitRoom>
    );
};

export default IndexPage;

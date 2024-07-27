import {
    ControlBar,
    LiveKitRoom,
    RoomAudioRenderer,
    RoomName,
    TrackLoop,
    TrackMutedIndicator,
    useIsMuted,
    useIsSpeaking,
    useParticipants,
    useRoomContext,
    useToken,
    useTrackRefContext,
    useTracks,
} from '@livekit/components-react';
import styles from '../styles/Clubhouse.module.scss';
import { Track } from 'livekit-client';
import { useMemo, useState } from 'react';
import { generateRandomUserId } from '../lib/helper';
import { Button } from '@chakra-ui/react';

const avatarSeed = ["Loki", "Mimi", "Princess", "Abby", "Jasmine", "Miss kitty", "Annie", "Garfield"]


const Clubhouse = () => {

    const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;
    const roomName = params?.get('room') ?? 'test-room';
    const userIdentity = params?.get('user') ?? generateRandomUserId();

    const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
        userInfo: {
            identity: userIdentity,
            name: userIdentity,
        },
    });

    const [tryToConnect, setTryToConnect] = useState(false);
    const [connected, setConnected] = useState(false);



    return (
        <div data-lk-theme="default" className={styles.container}>
            <LiveKitRoom
                token={token}
                serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
                connect={tryToConnect}
                video={false}
                audio={true}
                onConnected={() => setConnected(true)}
                onDisconnected={() => {
                    setTryToConnect(false);
                    setConnected(false);
                }}
            >
                <div style={{ display: 'grid', placeContent: 'center', height: '100%' }}>
                    <button
                        className="lk-button"
                        onClick={() => {
                            setTryToConnect(true);
                        }}
                    >
                        Enter Room
                    </button>
                </div>

                <div className={styles.slider} style={{ bottom: connected ? '0px' : '-100%' }}>
                    <h1>
                        <RoomName />
                    </h1>
                    <Stage />

                    {/* <ControlBar
                        variation="minimal"
                        controls={{ microphone: true, camera: false, screenShare: false }}
                    /> */}

                    <Controler />
                    
                    <RoomAudioRenderer />
                </div>
            </LiveKitRoom>
        </div>
    );
};

const Controler = () => {

    const { localParticipant } = useRoomContext();
    
    const handleMuteUnmute = async () => {

        try {
            await localParticipant.setMicrophoneEnabled(!localParticipant.isMicrophoneEnabled)
        }
        catch (e) {
            alert(`${e}`);
        }

    }

    return (
        <Button w="200px" size="sm" mx="auto" onClick={handleMuteUnmute}> {localParticipant.isMicrophoneEnabled ? "mute" : "unmute"} </Button>
    )
}

const Stage = () => {
    const tracksReferences = useTracks([Track.Source.Microphone]);
    return (
        <div className="">
            <div className={styles.stageGrid}>
                <TrackLoop tracks={tracksReferences}>
                    <CustomParticipantTile></CustomParticipantTile>
                </TrackLoop>
            </div>
        </div>
    );
};

const CustomParticipantTile = () => {
    const trackRef = useTrackRefContext();
    const isSpeaking = useIsSpeaking(trackRef.participant);
    const isMuted = useIsMuted(trackRef);


    const user_image = useMemo(() => avatarSeed[Math.floor(Math.random() * avatarSeed.length)], [])


    return (
        <section className={styles['participant-tile']} title={trackRef.participant.name}>
            <div
                // className={`rounded-full border-2 p-0.5 transition-colors duration-1000 ${
                className={styles['avatar-container']}
                style={{ borderColor: isSpeaking ? 'greenyellow' : 'transparent' }}
            >
                <div
                    className={styles.avatar}
                // className="z-10 grid aspect-square items-center overflow-hidden rounded-full bg-beige transition-all will-change-transform"
                >
                    <img
                        src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user_image}`}
                        className="fade-in"
                        width={150}
                        height={150}
                        alt={`Avatar of user: ${trackRef.participant.identity}`}
                    />
                </div>
            </div>

            <div style={{ opacity: isMuted ? 1 : 0 }} className={styles['mic-container']}>
                <div>
                    <TrackMutedIndicator className={styles.mic} trackRef={trackRef}></TrackMutedIndicator>
                </div>
            </div>
                    </section>
    );
};
export default Clubhouse;
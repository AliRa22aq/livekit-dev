import { LiveKitRoom, useToken, VideoConference, setLogLevel, useTracks, RoomContext, ControlBar, LayoutContext, LayoutContextProvider } from '@livekit/components-react';
import { Room, RoomConnectOptions, Track } from 'livekit-client';
import type { NextPage } from 'next';
import { generateRandomUserId } from '../lib/helper';
import { useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { LayoutGroup } from 'framer-motion';

const MinimalExample: NextPage = () => {
  const params = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;
  const roomName = params?.get('room') ?? 'test-room';
  setLogLevel('info', { liveKitClientLogLevel: 'warn' });

  const userIdentity = params?.get('user')!;

  const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
    userInfo: {
      identity: userIdentity,
      name: userIdentity,
    },
  });
  console.log("token: ", token);

  return (
    <div data-lk-theme="default" style={{ height: '100vh' }}>
      <LiveKitRoom
        video={false}
        audio={false}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
        onMediaDeviceFailure={(e) => {
          console.error(e);
          alert(
            'Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab',
          );
        }}
      >
        {
          <RoomContext.Consumer>
            {
              (LiveKitRoom) => {
                // LiveKitRoom?.simulateParticipants();
                return (
                  <Box> 
                    <Box> {LiveKitRoom?.name} </Box>
                    <Box> {LiveKitRoom?.numParticipants} </Box>

                    <Box>
                      localParticipant: {LiveKitRoom?.localParticipant.name}
                    </Box>
                    {
                      LiveKitRoom?.remoteParticipants && (
                        <Box>
                          localParticipant: {Array.from(LiveKitRoom?.remoteParticipants.values()).map((remoteParticipant) => {
                            return (
                              <span> {remoteParticipant.name} </span>
                            )
                          })}
                        </Box>
                      )

                    }

                    <LayoutContextProvider>
                      <LayoutContext.Consumer>
                        {
                          () => {
                            return (
                              <ControlBar controls={{camera: false, chat: false, microphone: true, settings: true, leave:true, screenShare: false}} />
                            )
                          }
                        }
                      </LayoutContext.Consumer>
                    </LayoutContextProvider>

                  </Box>
                )
              }
            }
          </RoomContext.Consumer>
        }
        {/* <VideoConference /> */}
      </LiveKitRoom>
    </div>
  );
};

export default MinimalExample;

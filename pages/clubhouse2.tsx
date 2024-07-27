import {
  ConnectionState,
  ControlBar,
  GridLayout,
  LayoutContextProvider,
  LiveKitRoom,
  ParticipantContext,
  ParticipantLoop,
  RoomAudioRenderer,
  RoomContext,
  RoomName,
  TrackLoop,
  TrackMutedIndicator,
  TrackRefContext,
  TrackReference,
  TrackReferenceOrPlaceholder,
  useAudioPlayback,
  useIsMuted,
  useIsSpeaking,
  useLiveKitRoom,
  useLocalParticipantPermissions,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
  useParticipantContext,
  useParticipantTile,
  useParticipantTracks,
  useParticipants,
  useRoomContext,
  useToken,
  useTrackByName,
  useTrackRefContext,
  useTracks,
} from '@livekit/components-react';
import styles from '../styles/Clubhouse.module.scss';
import { Track, LocalParticipant, RemoteParticipant, RoomOptions, RoomEvent, TrackPublication, LocalAudioTrack, DataPacket_Kind } from 'livekit-client';
import { useEffect, useMemo, useState } from 'react';
import { generateRandomUserId } from '../lib/helper';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Center, Divider, Flex, HStack, Image, VStack, useDisclosure, useEventListener } from '@chakra-ui/react';
import { useRoom } from '@livekit/react-core';
import ListenersModel from '../components/ListenersModel';

import { Room, Participant, LocalTrackPublication, RemoteTrackPublication } from 'livekit-client';
import { UpdateParticipantRequest } from 'livekit-server-sdk/dist/proto/livekit_room';
import { ParticipantInfo } from 'livekit-server-sdk';


export const avatarSeed = ["Loki", "Mimi", "Princess", "Abby", "Jasmine", "Miss kitty", "Annie", "Garfield"]

const adminIdentity = "ali"
const admin_image = avatarSeed[Math.floor(Math.random() * avatarSeed.length)]
const user_image = avatarSeed[Math.floor(Math.random() * avatarSeed.length)]


const Clubhouse = () => {

  const params = useSearchParams();

  // const roomName = params?.get('room') ?? 'PlanetMoon';
  const roomName = 'PlanetMoon';
  const myIdentity = params?.get('user')!;

  const [tryToConnect, setTryToConnect] = useState(false);
  const [connected, setConnected] = useState(false);

  const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
    userInfo: {
      identity: myIdentity,
      name: myIdentity,
    },
  });

  return (
    <div data-lk-theme="default" className={styles.container}>
      <LiveKitRoom
        // room={room}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
        connect={tryToConnect}
        video={false}
        audio={true}
        // audio={adminIdentity === adminIdentity ? true : false}
        // simulateParticipants={25}
        onConnected={() => setConnected(true)}
        onDisconnected={() => {
          setTryToConnect(false);
          setConnected(false);
        }}
      >

        {
          !connected && (
            <button
              className="lk-button"
              onClick={() => {
                setTryToConnect(true);
              }}
            >
              Enter Room
            </button>
          )
        }


        {/* <ConnectionState /> */}

        {
          connected && (
            <Box p="16px">

              <Center fontSize="16px" m="12px">
                {roomName} Audio AMA
              </Center>

              <Stage myIdentity={myIdentity} />


              {/* <CustomControlBar userIdentity={userIdentity} /> */}

              <RoomAudioRenderer />

            </Box>
          )
        }

      </LiveKitRoom>
    </div>
  );
};

const Stage = ({ myIdentity }: { myIdentity: string }) => {

  const tracks = useTracks([Track.Source.Microphone, Track.Source.Unknown]);
  const adminTrack = tracks.find((track) => track.participant.identity === adminIdentity);
  const participantsTrack = tracks.filter((track) => track.participant.identity !== adminIdentity);

  return (
    <Box>

      <Box border="1px solid transparent">
        <Box> Admin </Box>
        {
          adminTrack && (
            <Box>
              <CustomAdminTile trackRef={adminTrack} />
              <CustomControlBar
                myIdentity={myIdentity}
                userIdentity={adminTrack.participant.identity}
              />
              <Divider bgColor="white" />
            </Box>
          )
        }
      </Box>

      <Box border="1px solid transparent">
        <Box> Participants </Box>
        {
          participantsTrack.map((trackRef) => (
            <Box>
              <CustomParticipantsTile trackRef={trackRef} />
              <CustomControlBar
                myIdentity={myIdentity}
                userIdentity={trackRef.participant.identity}
              />
              <Divider bgColor="white" />
            </Box>
          ))
        }
        {/* </Flex> */}
      </Box>

    </Box>
  );
};

const CustomAdminTile = ({ trackRef }: { trackRef: TrackReferenceOrPlaceholder }) => {

  const isMuted = useIsMuted(trackRef);

  // const handleTrackMuted = () => {
  //   setIsMuted(true);
  // };

  // useEffect(() => {
  //   room.on("trackMuted", handleTrackMuted);

  //   return () => {
  //     room.off('trackMuted', handleTrackMuted);
  //     // room.off('trackUnmuted', handleTrackUnmuted);
  //   };


  // }, [])

  // console.log("isMuted: ", isMuted);

  return (
    <>

      <section title={trackRef.participant.name}>


        <VStack spacing={0} w="70px">
          <Box
            as="img"
            borderRadius="50px"
            border="3px solid transparent"
            borderColor={trackRef.participant.isSpeaking ? 'grey' : 'transparent'}
            src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${admin_image}`}
            className="fade-in"
            width={70}
            height={70}
            alt={`Avatar of user: ${trackRef.participant.identity}`}
          />
          <Box>{trackRef.participant.name}</Box>
        </VStack>

        {
          <Flex style={{ opacity: isMuted ? 1 : 0 }} justify="end">
            <TrackMutedIndicator trackRef={trackRef} />
          </Flex>
        }


      </section>
    </>
  );
};

const CustomParticipantsTile = ({ trackRef }: { trackRef: TrackReferenceOrPlaceholder }) => {
  const isMuted = useIsMuted(trackRef);

  const room = useRoomContext();

  useEffect(() => {

    room.on(RoomEvent.DataReceived, async (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      _?: DataPacket_Kind,
      topic?: string
    ) => {
      const event = JSON.parse(new TextDecoder().decode(payload));
      console.log(`Data event received: ${topic} by ${participant?.name}`);

      if (topic === 'forceMuteParticipant') {
        await room.localParticipant.setMicrophoneEnabled(false);
        await room.localParticipant.setCameraEnabled(false);
      }
      if (topic === 'forceUnMuteParticipant') {
        await room.localParticipant.setMicrophoneEnabled(true);
        await room.localParticipant.setCameraEnabled(true);
      }

      else if (topic === 'forceLeaveParticipant') {
        await room.disconnect();
      }

    })
  }, [])


  return (
    <>
      <section title={trackRef.participant.name}>
        <VStack w="70px" spacing={0} width={100}>

          <Box
            borderRadius="50px"
            border="3px solid transparent"
            borderColor={trackRef.participant.isSpeaking ? 'grey' : 'transparent'}
            as="img"
            src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user_image}`}
            className="fade-in"
            width={70}
            height={70}
            alt={`Avatar of user: ${trackRef.participant.identity}`}
          />
          <Box>{trackRef.participant.name}</Box>
        </VStack>

        {
          <Flex style={{ opacity: isMuted ? 1 : 0 }} justify="end">
            <TrackMutedIndicator trackRef={trackRef} />
          </Flex>
        }

      </section>
    </>
  );
};


const CustomControlBar = ({ myIdentity, userIdentity }: { myIdentity: string, userIdentity: string }) => {

  const room = useRoomContext();

  const muteAllParticipants = async () => {

    await room.localParticipant.setCameraEnabled(false);
    await room.localParticipant.setMicrophoneEnabled(false);

    const strData = JSON.stringify({ some: "data" });
    const data = new TextEncoder().encode(strData);
    room.localParticipant.publishData(data, {
      reliable: true,
      topic: "forceMuteParticipant",
      destinationIdentities: []
    });

  }

  const unmuteAllParticipants = async () => {

    await room.localParticipant.setCameraEnabled(true);
    await room.localParticipant.setMicrophoneEnabled(true);

    const strData = JSON.stringify({ some: "data" });
    const data = new TextEncoder().encode(strData);
    room.localParticipant.publishData(data, {
      reliable: true,
      topic: "forceUnMuteParticipant",
      destinationIdentities: []
    });

  }

  const muteOneParticipant = async () => {

    const strData = JSON.stringify({ some: "data" });
    const data = new TextEncoder().encode(strData);
    room.localParticipant.publishData(data, {
      reliable: true,
      topic: "forceMuteParticipant",
      destinationIdentities: [userIdentity]
    });

  }

  const unmuteOneParticipant = async () => {

    const strData = JSON.stringify({ some: "data" });
    const data = new TextEncoder().encode(strData);
    room.localParticipant.publishData(data, {
      reliable: true,
      topic: "forceUnMuteParticipant",
      destinationIdentities: [userIdentity]
    });

  }

  //   return (
  //     <HStack w="full" justify="space-between">

  //       <ControlBar
  //         variation='minimal'
  //         controls={{ microphone: true, camera: false, screenShare: false, leave: true, chat: false }}
  //         about='blabla'
  //       />

  //       <HStack>
  //         <Button size="sm" mx="10px" bgColor="#444444" color="white" onClick={muteAllParticipants}>
  //           Mute AMA
  //         </Button>
  //         <Button size="sm" mx="10px" bgColor="#444444" color="white" onClick={unmuteAllParticipants}>
  //           Unmute AMA
  //         </Button>
  //       </HStack>

  //     </HStack>
  //   )
  // }
  // else if (myIdentity === adminIdentity) {
  //   return (
  //     <HStack w="full" >
  //       <Button size="sm" mx="10px" bgColor="#444444" color="white" onClick={muteOneParticipant}>
  //         Mute
  //       </Button>
  //       <Button size="sm" mx="10px" bgColor="#444444" color="white" onClick={unmuteOneParticipant}>
  //         Unmute
  //       </Button>
  //     </HStack>
  //   )
  // }
  // else if(myIdentity !== adminIdentity && userIdentity !== adminIdentity){

  if (myIdentity === userIdentity) {
    return (
      <HStack w="full" justify="start">
        <ControlBar
          variation='minimal'
          controls={{ microphone: true, camera: false, screenShare: false, leave: true, chat: false }}
          about='blabla'
        />
      </HStack>
    )
  }

  // }
}


export default Clubhouse;

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
import { Track, LocalParticipant, RemoteParticipant, RoomOptions } from 'livekit-client';
import { useEffect, useMemo, useState } from 'react';
import { generateRandomUserId } from '../lib/helper';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Center, Divider, Flex, HStack, Image, VStack, useDisclosure } from '@chakra-ui/react';
import { useRoom } from '@livekit/react-core';
import ListenersModel from '../components/ListenersModel';

import { Room, Participant, LocalTrackPublication, RemoteTrackPublication } from 'livekit-client';


export const avatarSeed = ["Loki", "Mimi", "Princess", "Abby", "Jasmine", "Miss kitty", "Annie", "Garfield"]

const adminIdentity = "ali"
const admin_image = avatarSeed[Math.floor(Math.random() * avatarSeed.length)]
const user_image = avatarSeed[Math.floor(Math.random() * avatarSeed.length)]

// enum UserCategories {
//   ADMIN, 
//   COADMIN, 
//   SPEAKER, 
//   LISTENER
// }


const Clubhouse = () => {
  
  const params = useSearchParams();
  
  const roomName = params?.get('room') ?? 'PlanetMoon';
  const userIdentity = params?.get('user')!;
  
  
  // console.log("userIdentity: ", userIdentity);
  
  const [tryToConnect, setTryToConnect] = useState(false);
  const [connected, setConnected] = useState(false);
  const [coAdminIdentities, setCoAdminIdentities] = useState<string[]>([]);

  const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
    userInfo: {
      identity: userIdentity,
      name: userIdentity,
    },
  });
  const [room] = useState(new Room());

  return (
    <div data-lk-theme="default" className={styles.container}>
      <LiveKitRoom
        room={room}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LK_SERVER_URL}
        connect={tryToConnect}
        video={false}
        // audio={adminIdentity === adminIdentity ? true : false}
        audio={true}
        // simulateParticipants={25}
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

        {/* <ConnectionState /> */}

        <Box className={styles.slider} style={{ bottom: connected ? '0px' : '-100%' }} border="1px solid yellow" p="16px">

          <Center fontSize="16px" m="12px">
            {roomName} Audio AMA
          </Center>

  
            <Stage userIdentity={userIdentity} />




          <CustomControlBar userIdentity={userIdentity}/>

          <RoomAudioRenderer />



        </Box>


      </LiveKitRoom>
    </div>
  );
};

const Stage = ({userIdentity}:{userIdentity: string}) => {

  // const tracksReferences = useTracks([Track.Source.Microphone]);
  // console.log("tracksReferences: ", tracksReferences);
  // const adminTrackReference = tracksReferences.find((trackRef) => trackRef.participant.name === admin);

  // const trackReferences = useTracks([Track.Source.Microphone]);

  // const {get} = useTra();
  // const admin = trackReferences.find((trackRef) => trackRef.participant.name === adminIdentity);

  // const listeners = participants.filter((participant) => participant.name !== admin)


  return (
    <Box border="1px solid transparent">

        
        <CustomAdminTile />
        <CustomParticipantsTile userIdentity={userIdentity} />


      {
        // tracksReferences.map((trackRef) => {




        //   const isSpeaking = trackRef.participant.isSpeaking;
        //   const isMuted = trackRef.publication.isMuted;
        //   const avatarSeed = ["Loki", "Mimi", "Princess", "Abby", "Jasmine", "Miss kitty", "Annie", "Garfield"]
        //   const id = avatarSeed[Math.floor(Math.random())];

        //   return (
        //     <section title={trackRef.participant.name} >

        //       <VStack spacing={0} >

        //         <Box boxSize={100} >
        //           <Box
        //             borderRadius="50px"
        //             border="3px solid transparent" borderColor={isSpeaking ? 'grey' : 'transparent'}
        //             as="img"
        //             src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${id}`}
        //             className="fade-in"
        //             width={100}
        //             height={100}
        //             alt={`Avatar of user: ${trackRef.participant.identity}`}
        //           />
        //         </Box>
        //         <Box>{trackRef.participant.name}</Box>
        //       </VStack>

        //       <Flex style={{ opacity: isMuted ? 1 : 0 }} justify="end">
        //         <TrackMutedIndicator trackRef={trackRef}></TrackMutedIndicator>
        //       </Flex>

        //     </section>
        //   )
        // })
      }

      {/* <TrackLoop tracks={tracksReferences}>
          <CustomParticipantTile />
        </TrackLoop> */}
    </Box>
  );
};

const CustomAdminTile = () => {

  // const adminTrackRef =  useTrackRefContext();
  
  // const adminTrackRef = useMaybeTrackRefContext();
  // const participatContext = useParticipantContext();
  const participants = useParticipants();
  const admin = participants.find((participant) => participant.identity === adminIdentity)
  // const isMuted = useIsMuted(adminTrackRef);

  // const tracks = useTracks([
  //   { source: Track.Source.Camera, withPlaceholder: true },
  //   { source: Track.Source.ScreenShare, withPlaceholder: false },
  // ]);


  // let isMuted: boolean | undefined = undefined;
  // const trackReferences = useMaybeTrackRefContext();
  // console.log("trackReferences: ", trackReferences);

  // if(trackReferences){
  // }
  
  
  // const isSpeaking = useIsSpeaking(admin);
  
  if (!admin) {
    return <Box />
  }

  return (
    <>

      <section title={admin.name}>

        <Box border="1px solid transparent">
          <Box> Admin </Box>

          <VStack spacing={0} w="70px">
            <Box
              as="img"
              borderRadius="50px"
              border="3px solid transparent"
              borderColor={admin.isSpeaking ? 'grey' : 'transparent'}
              src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${admin_image}`}
              className="fade-in"
              width={70}
              height={70}
              alt={`Avatar of user: ${admin.identity}`}
            />
            <Box>{admin.name}</Box>
          </VStack>

        </Box>

        {
          // adminTrackRef && (
            // <Flex style={{ opacity: isMuted ? 1 : 0 }} justify="end">
            //   <TrackMutedIndicator trackRef={adminTrackRef}></TrackMutedIndicator>
            // </Flex>
          // )
        }


      </section>

      {/* <section title={admin.name}>

        <Box border="1px solid transparent">
          <Box> Admin </Box>

          <VStack spacing={0} w="70px">
            <Box
              as="img"
              borderRadius="50px"
              border="3px solid transparent"
              borderColor={admin.isSpeaking ? 'grey' : 'transparent'}
              src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${admin_image}`}
              className="fade-in"
              width={70}
              height={70}
              alt={`Avatar of user: ${admin.identity}`}
            />
            <Box>{admin.name}</Box>
          </VStack>

        </Box>

        {
          adminTrackRef && (
          <Flex style={{ opacity: isMuted ? 1 : 0 }} justify="end">
            <TrackMutedIndicator trackRef={trackReferences}></TrackMutedIndicator>
          </Flex>
          )
        }


      </section> */}
      <Divider bgColor="white" />
    </>
  );
};

const CustomParticipantsTile = ({userIdentity}:{userIdentity: string}) => {

  const participants = useParticipants();
  const listeners = participants.filter((participant) => participant.name !== adminIdentity)
  const listenersModal = useDisclosure();

  return (
    <>
      <Box borderBottom="1px solid black" >
        
        {
          adminIdentity === userIdentity ?
            <Box cursor="pointer" onClick={() => listenersModal.onOpen()}> Listeners </Box> :
            <Box> Listeners </Box>
        }

        <Flex w="full" flexWrap="wrap" overflowY="scroll" maxH="250px">
          {
            listeners.map((listener, index) => {
              return (
                <VStack title={listener.name} w="70px" spacing={0} key={index} width={100}>
                  <Box
                    borderRadius="50px"
                    border="3px solid transparent"
                    borderColor={listener.isSpeaking ? 'grey' : 'transparent'}
                    as="img"
                    src={`https://api.dicebear.com/8.x/adventurer/svg?seed=${user_image}`}
                    className="fade-in"
                    width={70}
                    height={70}
                    alt={`Avatar of user: ${listener.identity}`}
                  />
                  <Box>{listener.name}</Box>
                </VStack>
              )
            })
          }
        </Flex>
      </Box>
      <Divider bgColor="white" />
    </>
  );
};

const CustomControlBar = ({userIdentity}:{userIdentity: string}) => {


  // const tracks = useTracks([{
  //   source: Track.Source.Microphone, withPlaceholder: false
  // }]);
  
  // tracks.map((track) => {
  //   // track.publication?.handleMuted()
  //   console.log("track.publication?.isMuted: ", )
  // })

  // const room = useRoomContext();

  // const muteAllParticipants = () => {
  //   if (room) {
  //     // Mute remote participants
  //     room.remoteParticipants.forEach((participant) => {
  //       muteParticipant(participant);
  //     });

  //     // Mute local participant
  //     muteParticipant(room.localParticipant);
  //   }
  // };

  // const muteParticipant = (participant: Participant) => {
  //   participant.getTrackPublications().forEach((track) => {
  //     if (track.kind === 'audio') {
  //       track.audioTrack?.setAudioContext(undefined);
  //     }
  //   });
  // };
  // const participantTracks = useParticipantTracks([Track.Source.Microphone], "alina")
  // // const room = useRoom();

  // const handleMute = () => {
  //   participantTracks.map(({ publication }) => {
  //     if (publication.track?.kind == "audio") {
  //       publication.handleMuted();
  //     }
  //   })
  // }

  if(adminIdentity === userIdentity){
    return (
        <HStack w="full" justify="space-between">
  
          <ControlBar
            variation='minimal'
            controls={{ microphone: true, camera: false, screenShare: false, leave: true, chat: false }}
            about='blabla'
          />
  
          <Button size="sm" mx="10px" bgColor="#444444" color="white">
            Mute AMA
          </Button>
  
        </HStack>
      )
  }
  return (
    <HStack w="full" justify="end">
      <ControlBar
        variation='minimal'
        controls={{ microphone: true, camera: false, screenShare: false, leave: true, chat: false }}
        about='blabla'
      />
    </HStack>
  )
}


export default Clubhouse;

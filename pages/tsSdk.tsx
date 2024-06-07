import React, { useEffect } from 'react'
import { Room, RoomEvent, RoomOptions, Track, VideoPresets } from 'livekit-client'
import { useToken } from '@livekit/components-react';
import { generateRandomUserId } from '../lib/helper';

const url = process.env.NEXT_PUBLIC_LK_SERVER_URL || "";

const tsSdk = () => {
    const roomName = "PlanetMoon";
    const userIdentity = generateRandomUserId();
    
    const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
        userInfo: {
            identity: userIdentity,
            name: userIdentity,
        },
    });

    // const doAction = async () => {
    //     if (token) {
    //         // console.log('connected to room', room);
    //         const room = new Room({
    //             // automatically manage subscribed video quality
    //             adaptiveStream: true,
        
    //             // optimize publishing bandwidth and CPU for published tracks
    //             dynacast: true,
        
    //             // default capture settings
    //             videoCaptureDefaults: {
    //                 resolution: VideoPresets.h720.resolution,
    //             },
    //         });
        
            
    //         room.prepareConnection(url, token);
    //         await room.connect(url, token);
            
    //         console.log('connected to room', room.name);
    //         // await room.localParticipant.enableCameraAndMicrophone();
    //         room
    //             .on(RoomEvent.TrackSubscribed, (e) => console.log(e))
    //             .on(RoomEvent.TrackUnsubscribed, (e) => console.log(e))
    //             .on(RoomEvent.ActiveSpeakersChanged, (e) => console.log(e))
    //             .on(RoomEvent.Disconnected, (e) => console.log(e))
    //             .on(RoomEvent.LocalTrackUnpublished, (e) => console.log(e));

    //         // const rp = room.remoteParticipants;
    //         // console.log("rp: ", rp);

    //         Object.values(room.remoteParticipants).map((remoteParticipant) => {
    //             console.log("remoteParticipant: ", remoteParticipant)
    //         })
            
    //         // const p = room.localParticipant;
    //         // turn on the local user's camera and mic, this may trigger a browser prompt
    //         // to ensure permissions are granted
    //         // await p.setCameraEnabled(true);
    //         // await p.setMicrophoneEnabled(true);
    //         // await p.setScreenShareEnabled(true);

    //     }
    // }

    // useEffect(() => {
    //     doAction();
    // }, [])



    // const rp = room.remoteParticipants.get('Ali');
    // console.log("rp: ", rp);
    // if (rp) {
    //     // if the other user has enabled their camera, attach it to a new HTMLVideoElement
    //     if (rp.isCameraEnabled) {
    //         const publication = rp.getTrackPublication(Track.Source.Camera);
    //         if (publication?.isSubscribed) {
    //             const videoElement = publication.videoTrack?.attach();
    //             // do something with the element
    //         }
    //     }
    // }


    // // call this some time before actually connecting to speed up the actual connection




    return (
        <div>tsSdk</div>
    )
}

export default tsSdk
import { ParticipantInfo, RoomServiceClient } from "livekit-server-sdk";
import { NextApiRequest, NextApiResponse } from "next";


const livekitUrlHostname = process.env.NEXT_PUBLIC_LK_SERVER_URL || "";
const LIVEKIT_API_KEY = process.env.LK_API_KEY || "";
const LIVEKIT_API_SECRET = process.env.LK_API_SECRET || "";

const roomClient = new RoomServiceClient(
    livekitUrlHostname,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET
);

export default async function handleToken(req: NextApiRequest, res: NextApiResponse) {
    try {
        const roomName = 'PlanetMoon';
        const participants: ParticipantInfo[] = await roomClient.listParticipants(roomName);

        const muteAllTracks = async (participants: ParticipantInfo[], roomName: string) => {
            const muteTasks = participants.map(async (participant) => {
                const { tracks, identity } = participant;
                const trackMuteTasks = tracks.map(async (track) => {
                    const muted = false;
                    await roomClient.mutePublishedTrack(roomName, identity, track.sid, muted);
                });
                await Promise.all(trackMuteTasks);
            });
            await Promise.all(muteTasks);
        };

        await muteAllTracks(participants, roomName);

        res.status(200).json({ success: true, msg: `All users muted successfully` });

    } catch (e) {
        res.statusMessage = (e as Error).message;
        res.status(500).end();
    }
}




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

    const participantId = req.body.participantId as string;

    try {
        const roomName = 'PlanetMoon';
        const participant: ParticipantInfo = await roomClient.getParticipant(roomName, participantId);

        const muteAllTracks = async (participant: ParticipantInfo, roomName: string) => {
                const { tracks, identity } = participant;
                const trackMuteTasks = tracks.map(async (track) => {
                    const muted = true;
                    await roomClient.mutePublishedTrack(roomName, identity, track.sid, muted);
                });
                await Promise.all(trackMuteTasks);
        };

        await muteAllTracks(participant, roomName);

        res.status(200).json({ success: true, msg: `${participant.name} muted successfully` });

    } catch (e) {
        res.statusMessage = (e as Error).message;
        res.status(500).end();
    }
}




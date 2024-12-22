import React, { useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

const RoomPage = () => {
    const { roomId } = useParams();
    const meetingRef = useRef(null);

    const myMeeting = useCallback(async () => {
        const appID = 1559930417;
        const serverSecret = "58558852ec71d4b801b2ecd7f9eb0374";

        const userId = `user_${Date.now()}`;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            userId,
            "Participant"
        );

        const zc = ZegoUIKitPrebuilt.create(kitToken);

        zc.joinRoom({
            container: meetingRef.current,
            sharedLinks: [{
                name: 'Copy Link',
                url: `https://http://localhost:3003/room/${roomId}`
            }],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
        });
    }, [roomId]); // Depend on roomId so the function updates if the roomId changes

    React.useEffect(() => {
        myMeeting();
    }, [myMeeting]);

    return <div ref={meetingRef} style={{ width: '100%', height: '100vh' }} />;
};

export default RoomPage;

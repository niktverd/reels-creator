/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import axios from 'axios';
import {doc, getDoc, updateDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tokenId = await obtainToken(req, res);

        if (!tokenId) {
            res.status(401).json({
                success: false,
                error: 'Authentication required',
            });
            return;
        }

        // Check if user has Instagram token
        const userRef = doc(db, 'users', tokenId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().instagramToken) {
            res.status(400).json({
                success: false,
                error: 'Instagram token not found. Please connect your Instagram account first.',
            });
            return;
        }

        const accessToken = userSnap.data().instagramToken;
        const {videoUrl, videoId, caption = ''} = req.body;

        if (!videoUrl || !videoId) {
            res.status(400).json({
                success: false,
                error: 'Video URL and video ID are required',
            });
            return;
        }

        // Send request to publish video on Instagram
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_INSTAGRAM_INTEGRATION_BACKEND}/api/instagram/publish-video-from-url`,
                {
                    videoUrl,
                    caption,
                    accessToken,
                },
            );

            // If successful or pending, mark video as published in Firebase
            if (response.data.success || response.data.status === 'pending') {
                // Update video document to mark as published to Instagram
                const videoRef = doc(db, 'videos', tokenId, 'items', videoId);
                await updateDoc(videoRef, {
                    publishedToInstagram: true,
                    instagramPublishDate: new Date().toISOString(),
                    instagramMediaContainerId: response.data.mediaContainerId || null,
                });

                res.status(response.data.success ? 200 : 202).json({
                    ...response.data,
                });
            } else {
                throw new Error(response.data.error || 'Failed to publish to Instagram');
            }
        } catch (error: any) {
            console.error('Instagram publishing error:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to publish to Instagram',
            });
        }
    } catch (error: any) {
        console.error('API error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
        });
    }
};

export default handler;

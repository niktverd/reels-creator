/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from 'axios';
import {doc, getDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

// Utility functions
const log = (message: any) => console.log(message);
const logError = (error: any) => console.error(error);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            ok: false,
            message: `Method ${req.method} Not Allowed`,
        });
    }

    try {
        const {accessToken} = req.query;

        if (accessToken && typeof accessToken === 'string') {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_INSTAGRAM_INTEGRATION_BACKEND}/api/ui/get-user-content`,
                {
                    params: {
                        accessToken,
                    },
                },
            );
            return res.status(200).json(response.data);
        }

        const tokenId = await obtainToken(req, res);
        if (!tokenId) {
            return res.status(401).json({
                ok: false,
                message: 'Authentication required',
            });
        }

        const userRef = doc(db, 'users', tokenId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || !userSnap.data().instagramToken) {
            return res.status(400).json({
                ok: false,
                message: 'Instagram token not found. Please connect your Instagram account first.',
            });
        }

        const token = userSnap.data().instagramToken;

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_INSTAGRAM_INTEGRATION_BACKEND}/api/ui/get-user-content`,
            {
                params: {
                    accessToken: token,
                },
            },
        );

        return res.status(200).json(response.data);
    } catch (error) {
        log(error);
        logError(error);

        return res.status(500).json({
            ok: false,
            message: error instanceof Error ? error.message : 'Internal server error',
        });
    }
};

export default handler;

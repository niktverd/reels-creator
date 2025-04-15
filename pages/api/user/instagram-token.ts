/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import {omit} from 'lodash';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tokenId = await obtainToken(req, res);

        if (!tokenId) {
            res.status(404).json({
                ok: false,
                message: 'tokenId is not provided',
            });
            return;
        }

        if (req.method === 'POST') {
            const {instagramToken} = req.body;

            if (!instagramToken) {
                res.status(400).json({
                    ok: false,
                    message: 'Instagram token is required',
                });
                return;
            }

            // Get user document reference
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            // Prepare user data with Instagram token
            const userData = userSnap.exists()
                ? {...userSnap.data(), instagramToken}
                : {instagramToken};

            // Save updated user data
            await setDoc(userRef, userData, {merge: true});

            res.status(200).json({
                ok: true,
                message: 'Instagram token saved successfully',
            });
            return;
        } else if (req.method === 'GET') {
            // Get user's Instagram token
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                res.status(200).json({
                    ok: true,
                    instagramToken: null,
                });
                return;
            }

            const userData = userSnap.data();

            res.status(200).json({
                ok: true,
                instagramToken: userData.instagramToken || null,
            });
            return;
        } else if (req.method === 'DELETE') {
            // Delete user's Instagram token
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                res.status(404).json({
                    ok: false,
                    message: 'User not found',
                });
                return;
            }

            const userData = userSnap.data();

            if (!userData.instagramToken) {
                res.status(200).json({
                    ok: true,
                    message: 'No Instagram token to delete',
                });
                return;
            }

            // Remove the instagramToken field while preserving other user data
            await setDoc(userRef, omit(userData, 'instagramToken'));

            res.status(200).json({
                ok: true,
                message: 'Instagram token deleted successfully',
            });
            return;
        }

        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).json({
            ok: false,
            message: `Method ${req.method} Not Allowed`,
        });
    } catch (error) {
        console.error('Instagram token API error:', error);
        res.status(500).json({
            ok: false,
            message: 'Internal server error',
        });
    }
};

export default handler;

/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import {arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tokenId = await obtainToken(req, res);

        if (!tokenId) {
            res.status(401).json({
                ok: false,
                message: 'Authentication required',
            });
            return;
        }

        // GET method to retrieve user's favorites
        if (req.method === 'GET') {
            // Get user document reference
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                res.status(200).json({
                    ok: true,
                    favorites: [],
                });
                return;
            }

            const userData = userSnap.data();

            res.status(200).json({
                ok: true,
                favorites: userData.favorites || [],
            });
            return;
        }

        // POST method to add/remove a favorite
        if (req.method === 'POST') {
            const {mediaId, action} = req.body;

            if (!mediaId) {
                res.status(400).json({
                    ok: false,
                    message: 'Media ID is required',
                });
                return;
            }

            if (!['add', 'remove'].includes(action)) {
                res.status(400).json({
                    ok: false,
                    message: 'Action must be either "add" or "remove"',
                });
                return;
            }

            // Get user document reference
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            // If user doesn't exist, create a new document with favorites array
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    favorites: action === 'add' ? [mediaId] : [],
                });

                res.status(200).json({
                    ok: true,
                    message: action === 'add' ? 'Added to favorites' : 'Nothing to remove',
                });
                return;
            }

            // If user exists, update favorites array
            await updateDoc(userRef, {
                favorites: action === 'add' ? arrayUnion(mediaId) : arrayRemove(mediaId),
            });

            res.status(200).json({
                ok: true,
                message: action === 'add' ? 'Added to favorites' : 'Removed from favorites',
            });
            return;
        }

        // Method not allowed
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
            ok: false,
            message: `Method ${req.method} Not Allowed`,
        });
    } catch (error) {
        console.error('Favorites operation error:', error);
        res.status(500).json({
            ok: false,
            message: 'An error occurred while processing your request',
        });
    }
};

export default handler;

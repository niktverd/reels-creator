/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // This is a GET-only endpoint for processing the Instagram callback
        if (req.method !== 'GET') {
            res.setHeader('Allow', ['GET']);
            res.status(405).json({
                ok: false,
                message: `Method ${req.method} Not Allowed`,
            });
            return;
        }

        // Extract the Instagram token from query parameters
        const {token, userId} = req.query;

        if (!token || typeof token !== 'string') {
            res.status(400).json({
                ok: false,
                message: 'Instagram token is missing or invalid',
            });
            return;
        }

        // Get the user's ID from the session
        try {
            const tokenId = await obtainToken(req, res);

            if (!tokenId) {
                res.status(401).json({
                    ok: false,
                    message: 'Authentication required',
                });
                return;
            }

            // Get user document reference
            const userRef = doc(db, 'users', tokenId);
            const userSnap = await getDoc(userRef);

            // Prepare user data with Instagram token and ID
            const userData = userSnap.exists()
                ? {
                      ...userSnap.data(),
                      instagramToken: token,
                      instagramUserId: userId || null,
                  }
                : {
                      instagramToken: token,
                      instagramUserId: userId || null,
                  };

            // Save updated user data
            await setDoc(userRef, userData, {merge: true});

            // Redirect to account page
            res.redirect(302, '/account');
        } catch (error) {
            console.error('Authentication error:', error);
            res.redirect(302, '/account?error=auth_failed');
        }
    } catch (error) {
        console.error('Instagram connection error:', error);
        res.redirect(302, '/account?error=connection_failed');
    }
};

export default handler;

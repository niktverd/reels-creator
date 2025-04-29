import {createUserWithEmailAndPassword, getAuth, updateProfile} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import {firebaseApp, firestore} from '../../../configs/firebase';

type Data = {
    success: boolean;
    message?: string;
    user?: {
        id: string;
        email: string;
        name?: string;
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({success: false, message: 'Method not allowed'});
    }

    try {
        const {email, password, name} = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Minimum password requirements
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // Create user in Firebase Auth
        const auth = getAuth(firebaseApp);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the user profile if name is provided
        if (name) {
            await updateProfile(user, {
                displayName: name,
            });
        }

        // Store additional user data in Firestore
        await setDoc(doc(firestore, 'users', user.uid), {
            email: user.email,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString(),
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.uid,
                email: user.email || email,
                name: user.displayName || name,
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        // eslint-disable-next-line no-console
        console.error('Registration error:', error);

        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-in-use') {
            return res.status(400).json({
                success: false,
                message: 'Email is already in use',
            });
        }

        // General error
        return res.status(500).json({
            success: false,
            message: error.message || 'An error occurred during registration',
        });
    }
}

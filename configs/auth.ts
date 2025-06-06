import {FirestoreAdapter as firestoreAdapter} from '@auth/firebase-adapter';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {cert} from 'firebase-admin/app';
import type {AuthOptions} from 'next-auth';
import type {Adapter} from 'next-auth/adapters';
import credentialsProvider from 'next-auth/providers/credentials';
import github from 'next-auth/providers/github';
import googleProvider from 'next-auth/providers/google';

import {firebaseApp} from './firebase';

const firebasePrivateKey = JSON.parse(
    process.env.FIREBASE_PRIVATE_KEY_ADD || process.env.FIREBASE_PRIVATE_KEY || '{}',
);

export const authConfig: AuthOptions = {
    adapter: firestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: firebasePrivateKey.value,
        }),
    }) as Adapter,
    providers: [
        googleProvider({
            clientId: process.env.AUTH_GOOGLE_CLIEN_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_CLIEN_SECRET as string,
        }),
        github({
            clientId: process.env.AUTH_GITHUB_CLIEN_ID as string,
            clientSecret: process.env.AUTH_GITHUB_CLIEN_SECRET as string,
        }),
        credentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const auth = getAuth(firebaseApp);
                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        credentials.email,
                        credentials.password,
                    );

                    const user = userCredential.user;

                    if (user) {
                        return {
                            id: user.uid,
                            name: user.displayName || user.email?.split('@')[0] || 'User',
                            email: user.email,
                            image: user.photoURL,
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Firebase authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    theme: {
        colorScheme: 'dark', // "auto" | "dark" | "light"
        brandColor: '#ff0000', // Hex color code
        logo: '', // Absolute URL to image
        buttonText: '#00ff00', // Hex color code
    },
    session: {
        strategy: 'jwt',
    },
};

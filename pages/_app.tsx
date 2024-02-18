import React from 'react';

import type {AppProps} from 'next/app';
import {SessionProvider} from 'next-auth/react';

import {FormatProvider} from '../src/contexts/formatContext';

import '../styles/globals.css';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <FormatProvider>
            <SessionProvider>
                <Component {...pageProps} />
            </SessionProvider>
        </FormatProvider>
    );
}

export default MyApp;

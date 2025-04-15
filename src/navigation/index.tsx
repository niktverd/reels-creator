import React from 'react';

import Link from 'next/link';
import {useSession} from 'next-auth/react';

import {SingInOut} from '../components/SingInOut/SingInOut';

export const Navigation = ({children}: React.PropsWithChildren<{}>) => {
    const session = useSession();

    return (
        <React.Fragment>
            <nav style={{marginBottom: 24, padding: 24, backgroundColor: 'lightgreen'}}>
                <Link href={'/'} style={{marginRight: 10}}>
                    Home
                </Link>
                <Link href={'/app'} style={{marginRight: 10}}>
                    Create video
                </Link>
                {session ? (
                    <Link href={'/account/videos'} style={{marginRight: 10}}>
                        Account
                    </Link>
                ) : null}
                {/* {session ? (
                    <Link href={'/moderation'} style={{marginRight: 10}}>
                        Moderate
                    </Link>
                ) : null} */}
                <SingInOut />
            </nav>
            {children}
        </React.Fragment>
    );
};

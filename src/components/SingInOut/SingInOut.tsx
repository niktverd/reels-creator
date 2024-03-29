import React from 'react';

import Link from 'next/link';
import {signOut, useSession} from 'next-auth/react';

export const SingInOut = () => {
    const session = useSession();

    return session.status === 'authenticated' ? (
        <Link href="/" onClick={() => signOut()}>
            Sign out
        </Link>
    ) : (
        <Link href="/api/auth/signin">Sign In</Link>
    );
};

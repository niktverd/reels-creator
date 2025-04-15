import React from 'react';

import {useRouter} from 'next/router';

const AccountIndexPage = () => {
    const router = useRouter();

    React.useEffect(() => {
        router.replace('/account/videos');
    }, [router]);

    return null;
};

export default AccountIndexPage;

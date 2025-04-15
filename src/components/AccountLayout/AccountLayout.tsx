import React from 'react';

import {Paper, Tab, Tabs} from '@material-ui/core';
import {useRouter} from 'next/router';

import {Navigation} from '../../navigation';

import styles from '../../../styles/Account.module.css';

type AccountLayoutProps = React.PropsWithChildren<{}>;

export const AccountLayout = ({children}: AccountLayoutProps) => {
    const router = useRouter();
    const path = router.pathname;

    const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: string) => {
        router.push(newValue);
    };

    return (
        <Navigation>
            <div className={styles.accountContainer}>
                <Paper className={styles.tabsContainer}>
                    <Tabs
                        value={path}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Videos" value="/account/videos" />
                        <Tab label="Instagram" value="/account/instagram" />
                    </Tabs>
                </Paper>
                <div className={styles.tabContent}>{children}</div>
            </div>
        </Navigation>
    );
};

import React from 'react';

import {SingInOut} from '../components/SingInOut/SingInOut';

export const Navigation = ({children}: React.PropsWithChildren<{}>) => {
    return (
        <React.Fragment>
            <nav style={{marginBottom: 24, padding: 24, backgroundColor: 'lightgreen'}}>
                <SingInOut />
            </nav>
            {children}
        </React.Fragment>
    );
};

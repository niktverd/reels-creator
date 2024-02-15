import React from 'react';

import {Navigation} from '../src/navigation';

import styles from '../styles/DefaultCrop.module.css';

const Demo = () => {
    return (
        <Navigation>
            <div className={styles.container}>
                <video
                    width={360}
                    height={640}
                    controls={true}
                    src="https://firebasestorage.googleapis.com/v0/b/reels-creator-15261.appspot.com/o/Gj4FCvO8KhSNJMf1xZwX%2F20240211164628754-output.mp4?alt=media&token=56a9018a-4780-4c44-97e2-2863aed13cc8"
                >
                    <track kind="captions" />
                </video>
            </div>
        </Navigation>
    );
};

export default Demo;

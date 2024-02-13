import React from 'react';

import type {VideoType} from '../../types/video';

import styles from './Video.module.css';

type VideoProps = {
    video: VideoType;
};

export const Video = ({video}: VideoProps) => {
    return (
        <div className={styles.container}>
            <video width="100%" height="100%" controls={true} src={video.url} loop={true}>
                <track kind="captions" label={video.name} src={video.url} />
            </video>
        </div>
    );
};

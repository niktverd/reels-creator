import React from 'react';

import type {VideoType} from '../../types/video';
import {Video} from '../Video/Video';

type VideoGridProps = {
    videos: VideoType[];
};

export const VideoGrid = ({videos}: VideoGridProps) => {
    return (
        <div>
            {videos.map((video) => {
                return (
                    <div
                        key={video.url}
                        style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            width: 180,
                            height: 320,
                        }}
                    >
                        <Video video={video} />
                    </div>
                );
            })}
        </div>
    );
};

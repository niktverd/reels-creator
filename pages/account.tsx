import React from 'react';

import {VideoGrid} from '../src/components/VideoGrid/VideoGrid';
import {Navigation} from '../src/navigation';
import type {VideoType} from '../src/types/video';

import _styles from '../styles/DefaultCrop.module.css';

const Demo = () => {
    const [videos, setVideos] = React.useState<VideoType[]>([]);

    const loadCreators = React.useCallback(() => {
        const load = async () => {
            const response = await fetch('/api/user/list');
            const json = await response.json();
            setVideos(json.data);
        };

        load();
    }, []);

    return (
        <Navigation>
            <div>
                <button onClick={loadCreators}>load</button>
            </div>
            <VideoGrid videos={videos} />
        </Navigation>
    );
};

export default Demo;

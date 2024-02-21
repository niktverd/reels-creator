import React from 'react';

import {Refresh} from '@material-ui/icons';

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

    React.useEffect(() => {
        loadCreators();
    }, [loadCreators]);

    return (
        <Navigation>
            <div style={{display: 'flex', justifyContent: 'flex-end', padding: 30}}>
                <div
                    style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: 50,
                    }}
                >
                    Video generation can take time. Please be patient and refresh page in a few
                    minutes
                </div>
                <button
                    style={{
                        border: '2px solid #fff',
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: 12,
                        cursor: 'pointer',
                    }}
                    onClick={loadCreators}
                >
                    <Refresh />
                </button>
            </div>
            <VideoGrid videos={videos} />
        </Navigation>
    );
};

export default Demo;

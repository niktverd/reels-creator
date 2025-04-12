/* eslint-disable no-console */
// eslint-disable-next-line no-restricted-syntax
import React, {useState} from 'react';

import type {VideoType} from '../../types/video';

import styles from './Video.module.css';

type VideoProps = {
    video: VideoType;
    hasInstagramToken?: boolean;
};

export const Video = ({video, hasInstagramToken = false}: VideoProps) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [published, setPublished] = useState(Boolean(video.publishedToInstagram));

    const handlePublishToInstagram = async () => {
        if (!hasInstagramToken || !video.id) return;

        try {
            setIsPublishing(true);
            const response = await fetch('/api/user/publish-to-instagram', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    videoUrl: video.url,
                    videoId: video.id,
                    caption: video.name,
                }),
            });

            const result = await response.json();

            if (result.success || result.status === 'pending') {
                setPublished(true);
            } else {
                alert(`Failed to publish to Instagram: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error publishing to Instagram:', error);
            alert('An error occurred while publishing to Instagram');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className={styles.container}>
            <video width="100%" height="100%" controls={true} src={video.url} loop={true}>
                <track kind="captions" label={video.name} src={video.url} />
            </video>

            {hasInstagramToken && !published && (
                <button
                    className={styles.instagramButton}
                    onClick={handlePublishToInstagram}
                    disabled={isPublishing}
                >
                    {isPublishing ? 'Publishing...' : 'Publish to Instagram'}
                </button>
            )}

            {published && <div className={styles.publishedBadge}>Published to Instagram</div>}
        </div>
    );
};

import React from 'react';

import {Typography} from '@material-ui/core';

import {EmptyState} from './EmptyState';
import {LoadingState} from './LoadingState';
import {MediaGridItem} from './MediaGridItem';
import type {MediaItem} from './types';

import styles from '../../../styles/Account.module.css';

interface InstagramMediaGridProps {
    media: MediaItem[];
    loading: boolean;
    onRefresh: () => void;
}

export const InstagramMediaGrid = ({media, loading, onRefresh}: InstagramMediaGridProps) => {
    if (loading) {
        return <LoadingState />;
    }

    if (!media || media.length === 0) {
        return <EmptyState onRefresh={onRefresh} loading={loading} />;
    }

    return (
        <div style={{marginTop: 30}}>
            <Typography variant="h5" gutterBottom>
                Instagram Media
            </Typography>
            <div className={styles.mediaGrid}>
                {media.map((item: MediaItem) => (
                    <MediaGridItem key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

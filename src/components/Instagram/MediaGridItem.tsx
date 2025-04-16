import React from 'react';

import {MediaCaption} from './MediaCaption';
import {MediaStats} from './MediaStats';
import {MediaType} from './MediaType';
import {MediaVideo} from './MediaVideo';
import type {MediaItem} from './types';

import styles from '../../../styles/Account.module.css';

interface MediaGridItemProps {
    item: MediaItem;
}

export const MediaGridItem = ({item}: MediaGridItemProps) => {
    return (
        <div className={styles.mediaItem}>
            {item.media_type === 'VIDEO' && item.media_url ? (
                <MediaVideo item={item} />
            ) : (
                <img src={item.thumbnail_url} alt={item.caption || 'Instagram media'} />
            )}

            <MediaType mediaType={item.media_type} />
            <MediaCaption caption={item.caption} />
            <MediaStats
                likes={item.likes}
                likeCount={item.like_count}
                commentsCount={item.comments_count}
                reach={item.reach}
            />
        </div>
    );
};

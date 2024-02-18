import React from 'react';

import type {Area} from 'react-easy-crop/types';

import {useFormatContext} from '../../contexts/formatContext';

// import styles from './CropperPreview.module.css';

type CropperPreviewProps = {
    croppedArea: Area;
    img: unknown;
};

export const CropperPreview = ({croppedArea, img}: CropperPreviewProps) => {
    const {selectedFormat} = useFormatContext();
    const scale = 100 / croppedArea.width;
    const transform = {
        x: `${-croppedArea.x * scale}%`,
        y: `${-croppedArea.y * scale}%`,
        scale,
        width: 'calc(100% + 0.5px)',
        height: 'auto',
    };

    const imageStyle = {
        transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
        width: transform.width,
        height: transform.height,
    };

    return (
        <div className="output" style={{paddingBottom: `${100 / selectedFormat.ratio}%`}}>
            <img src={img as string} alt="" style={imageStyle} />
        </div>
    );
};

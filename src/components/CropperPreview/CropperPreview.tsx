import React from 'react';

import type {Area} from 'react-easy-crop/types';

import {useFormatContext} from '../../contexts/formatContext';

// import styles from './CropperPreview.module.css';

type CropperPreviewProps = {
    croppedArea: Area;
    img: unknown;
    scale: number;
};

export const CropperPreview = ({croppedArea, img, scale}: CropperPreviewProps) => {
    const {selectedFormat} = useFormatContext();

    const transform = {
        x: `${-croppedArea.x}%`,
        y: `${-croppedArea.y}%`,
        scale,
        width: `${10000 / croppedArea.width}%`,
        height: `${10000 / croppedArea.height}%`,
    };

    const imageStyle = {
        transformOrigin: 'top left',
        transform: `scale(${transform.scale}) translate(${transform.x}, ${transform.y})`,
        top: transform.x,
        left: transform.y,
        width: transform.width,
        height: transform.height,
    };

    return (
        <div className="output" style={{paddingBottom: `${100 / selectedFormat.ratio}%`}}>
            <img src={img as string} alt="" style={imageStyle} />
        </div>
    );
};

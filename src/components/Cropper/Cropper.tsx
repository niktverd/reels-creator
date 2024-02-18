import React from 'react';

import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import ReactCropper from 'react-easy-crop';

import type {FileConfig, FormatType} from '../../types/common';

import styles from './Cropper.module.css';

type CropperProps = {
    selectedFormat: FormatType;
    selectedFile: FileConfig | null;
    imageSrc: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCropComplete: (_croppedArea: any, localcroppedAreaPixels: any) => void;
};

export const Cropper = ({
    selectedFormat,
    // selectedFile,
    imageSrc,
    onCropComplete,
}: CropperProps) => {
    const [zoom, setZoom] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);
    const [crop, setCrop] = React.useState({x: 0, y: 0});

    return (
        <div>
            <div className={styles.cropper}>
                <ReactCropper
                    image={imageSrc as string}
                    crop={crop}
                    rotation={rotation || 0}
                    zoom={zoom || 1}
                    aspect={selectedFormat.ratio || 1}
                    onCropChange={setCrop}
                    onRotationChange={(value: number) => setRotation(value)}
                    onCropComplete={onCropComplete}
                    onZoomChange={(value: number) => setZoom(value)}
                />
            </div>

            <div className={styles.controls}>
                <div>
                    <Typography variant="overline">Zoom</Typography>
                    <Slider
                        value={zoom}
                        min={0.1}
                        max={5}
                        step={0.05}
                        aria-labelledby="Zoom"
                        onChange={(_e, localZoom) => setZoom(localZoom as number)}
                    />
                </div>
                <div>
                    <Typography variant="overline">Rotation</Typography>
                    <Slider
                        value={rotation}
                        min={0}
                        max={360}
                        step={1}
                        aria-labelledby="Rotation"
                        onChange={(_e, localRotation) => setRotation(localRotation as number)}
                    />
                </div>
            </div>
        </div>
    );
};

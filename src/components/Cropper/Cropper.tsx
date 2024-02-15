import React from 'react';

import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import ReactCropper from 'react-easy-crop';

import type {FileConfig, FormatType} from '../../types/common';

import styles from './Cropper.module.css';

type CropperProps = {
    selectedFormat: FormatType;
    selectedFile: FileConfig | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<FileConfig | null>>;
    imageSrc: unknown;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCropComplete: (_croppedArea: any, localcroppedAreaPixels: any) => void;
};

export const Cropper = ({
    selectedFormat,
    selectedFile,
    setSelectedFile,
    imageSrc,
    onCropComplete,
}: CropperProps) => {
    const [crop, setCrop] = React.useState({x: 0, y: 0});

    const zoom = selectedFile?.config.zoom;
    const rotation = selectedFile?.config.rotation;

    return (
        <div className={styles.half}>
            <div className={styles.cropper}>
                <ReactCropper
                    image={imageSrc as string}
                    crop={crop}
                    rotation={selectedFile?.config.rotation || 0}
                    zoom={selectedFile?.config.zoom || 1}
                    aspect={selectedFormat.ratio || 1}
                    onCropChange={setCrop}
                    onRotationChange={(value: number) =>
                        selectedFile &&
                        setSelectedFile({
                            ...selectedFile,
                            config: {
                                ...selectedFile.config,
                                rotation: value,
                            },
                        })
                    }
                    onCropComplete={onCropComplete}
                    onZoomChange={(value: number) =>
                        selectedFile &&
                        setSelectedFile({
                            ...selectedFile,
                            config: {
                                ...selectedFile.config,
                                zoom: value,
                            },
                        })
                    }
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
                        onChange={(e, localZoom) =>
                            selectedFile &&
                            setSelectedFile({
                                ...selectedFile,
                                config: {
                                    ...selectedFile?.config,
                                    zoom: localZoom as number,
                                },
                            })
                        }
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
                        onChange={(e, localRotation) =>
                            selectedFile &&
                            setSelectedFile({
                                ...selectedFile,
                                config: {
                                    ...selectedFile?.config,
                                    rotation: localRotation as number,
                                },
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
};

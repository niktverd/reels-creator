import React from 'react';

// import Link from 'next/link';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Cropper from 'react-easy-crop';

import {maxLong, minLong} from '../../constants/common';
import {templates} from '../../templates';
import type {FileConfig, FormatType} from '../../types/common';
import {readFile} from '../../utils/read-file';

import styles from './PrepareContentView.module.css';

type PrepareContentViewProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFileChange: (e: any) => Promise<void>;
    // formats: FormatType[];
    selectedTemplate: string | null;
    selectedFormat: FormatType;
    // setSelectedFormat: React.Dispatch<React.SetStateAction<FormatType>>;
    // setView: React.Dispatch<React.SetStateAction<View>>;
    // zoom: number;
    // rotation: number;
    imgFiles: FileConfig[];
    selectedFile: FileConfig | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<FileConfig | null>>;
    imageSrc: unknown;
    setImageSrc: React.Dispatch<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCropComplete: (_croppedArea: any, localcroppedAreaPixels: any) => void;
    changeResolution: (oldLong?: number, step?: number, tryNotChange?: boolean) => void;
    width: number;
    // setWidth: React.Dispatch<React.SetStateAction<number>>;
    height: number;
    // setHeight: React.Dispatch<React.SetStateAction<number>>;
    showCroppedImage: () => Promise<void>;
};

export const PrepareContentView = ({
    selectedTemplate,
    selectedFormat,
    onFileChange,
    imgFiles,
    selectedFile,
    setSelectedFile,
    imageSrc,
    setImageSrc,
    onCropComplete,
    changeResolution,
    width,
    height,
    showCroppedImage,
}: PrepareContentViewProps) => {
    const [resolution, setResolution] = React.useState(maxLong);
    const [crop, setCrop] = React.useState({x: 0, y: 0});

    const numberOfImages = selectedTemplate ? templates[selectedTemplate]?.images?.length : 0;

    const zoom = selectedFile?.config.zoom;
    const rotation = selectedFile?.config.rotation;

    return (
        <div>
            <div style={{display: 'flex', width: '100%'}}>
                <div
                    style={{
                        padding: 32,
                        width: '30%',
                        fontSize: 32,
                        color: imgFiles.length < numberOfImages ? '#ff0000' : '#00aa00',
                    }}
                >
                    <div>
                        {imgFiles.length} / {numberOfImages}
                    </div>
                    <div>
                        <input type="file" onChange={onFileChange} accept="image/*" multiple />
                    </div>
                </div>
                <div
                    style={{
                        width: '30%',

                        border: '1px dashed gray',
                        padding: 32,
                    }}
                >
                    <Typography variant="overline">Resolution</Typography>
                    <Slider
                        value={resolution}
                        min={minLong}
                        max={maxLong}
                        step={1}
                        aria-labelledby="Resolution"
                        onChange={(e, localResolution) => {
                            const diff = (localResolution as number) - resolution;
                            const step = diff < 0 ? -1 : 1;
                            setResolution(localResolution as number);
                            changeResolution(localResolution as number, step);
                        }}
                    />
                    <div>
                        {width} x {height}
                    </div>
                    <button
                        onClick={() =>
                            changeResolution(selectedFormat.ratio < 1 ? height : width, 1)
                        }
                    >
                        increase
                    </button>
                    <button
                        onClick={() =>
                            changeResolution(selectedFormat.ratio < 1 ? height : width, -1)
                        }
                    >
                        decreasecrease
                    </button>
                </div>
                <div
                    style={{
                        width: '30%',

                        // border: '1px dashed gray',
                        padding: 32,
                    }}
                >
                    <Button onClick={() => showCroppedImage()} variant="contained" color="primary">
                        Show Result
                    </Button>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.half}>
                    <div>
                        <div>
                            {/* <div>
                                    {templates[selectedTemplate]?.images?.map(
                                        (img: Record<string, string>, indx: string) => {
                                            return (
                                                <div key={indx + img.loop}>
                                                    {indx} : {img.loop}
                                                </div>
                                            );
                                        },
                                    )}
                                </div> */}
                        </div>
                    </div>

                    <div>
                        {imgFiles.map((f, index) => {
                            return (
                                <button
                                    key={f.data.name + index}
                                    className={styles.fileItem}
                                    style={{
                                        backgroundColor:
                                            // eslint-disable-next-line no-nested-ternary
                                            numberOfImages <= index
                                                ? 'gray'
                                                : f.id === selectedFile?.id
                                                  ? 'lightcoral'
                                                  : 'inherit',
                                    }}
                                    onClick={async () => {
                                        const fileForCrop = await readFile(f.data);
                                        setImageSrc(fileForCrop);
                                        setSelectedFile(f);
                                    }}
                                >
                                    {f.data.name}| height: {f.config.height}| width:{' '}
                                    {f.config.width}| zoom: {f.config.zoom}| x: {f.config.x}| y:{' '}
                                    {f.config.y}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.half}>
                    <div className={styles.cropper}>
                        <Cropper
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
            </div>
        </div>
    );
};

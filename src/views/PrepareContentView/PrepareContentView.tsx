import React from 'react';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import {Cropper} from '../../components/Cropper/Cropper';
import {maxLong, minLong} from '../../constants/common';
import {templates} from '../../templates';
import type {FileConfig, FormatType} from '../../types/common';
import {readFile} from '../../utils/read-file';

import styles from './PrepareContentView.module.css';

type PrepareContentViewProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFileChange: (e: any) => Promise<void>;
    selectedTemplate: string | null;
    selectedFormat: FormatType;
    imgFiles: FileConfig[];
    selectedFile: FileConfig | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<FileConfig | null>>;
    imageSrc: unknown;
    setImageSrc: React.Dispatch<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onCropComplete: (_croppedArea: any, localcroppedAreaPixels: any) => void;
    changeResolution: (oldLong?: number, step?: number, tryNotChange?: boolean) => void;
    width: number;
    height: number;
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

    const numberOfImages = selectedTemplate ? templates[selectedTemplate]?.images?.length : 0;

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

                <Cropper
                    selectedFormat={selectedFormat}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    imageSrc={imageSrc}
                    onCropComplete={onCropComplete}
                />
            </div>
        </div>
    );
};

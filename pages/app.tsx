import React from 'react';

import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Cropper from 'react-easy-crop';

import {Navigation} from '../src/navigation';
import {templates} from '../src/templates';

import styles from '../styles/DefaultCrop.module.css';

const templatesEntries = Object.entries(templates);

type FormatType = {
    name: string;
    ratio: number;
};

const formats: FormatType[] = [
    {name: '9:16', ratio: 9 / 16},
    {name: '10:16', ratio: 10 / 16},
    {name: '1:1', ratio: 1},
    {name: '16:10', ratio: 16 / 10},
    {name: '16:9', ratio: 16 / 9},
];

type FileConfig = {
    data: File;
    id: string;
    config: {
        zoom: number;
        ratio: number;
        rotation: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

const initialConfig: FileConfig['config'] = {
    zoom: 1,
    ratio: formats[0].ratio,
    rotation: 0,
    x: 0,
    y: 0,
    width: 10,
    height: 10,
};

type View = 'template' | 'format' | 'files';

const Demo = () => {
    const [view, setView] = React.useState<View>('template');
    const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null);

    const [selectedFormat, setSelectedFormat] = React.useState<FormatType>(formats[0]);
    const [selectedFile, setSelectedFile] = React.useState<FileConfig | null>(null);
    const [imgFiles, setImgFiles] = React.useState<FileConfig[]>([]);
    const [imageSrc, setImageSrc] = React.useState<unknown>(null);

    const [crop, setCrop] = React.useState({x: 0, y: 0});

    const numberOfImages = selectedTemplate ? templates[selectedTemplate]?.images?.length : 0;

    React.useEffect(() => {
        const images = imgFiles.map((item) => {
            if (item.id === selectedFile?.id) {
                return {...selectedFile};
            } else {
                return item;
            }
        });

        setImgFiles(images);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        selectedFile?.id,
        selectedFile?.config.height,
        selectedFile?.config.width,
        selectedFile?.config.x,
        selectedFile?.config.y,
        selectedFile?.config.zoom,
        selectedFile?.config.rotation,
        selectedFile?.config.ratio,
        selectedFile,
    ]);

    const onCropComplete = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_croppedArea: any, localcroppedAreaPixels: any) => {
            if (selectedFile) {
                setSelectedFile({
                    ...selectedFile,
                    config: {
                        ...selectedFile.config,
                        ...(localcroppedAreaPixels || {}),
                    },
                });
            }
        },
        [selectedFile],
    );

    const uploadToServer = React.useCallback(async () => {
        if (!imageSrc) {
            return;
        }
        type SearchParamType = Record<string, string>;

        const params: SearchParamType = {};

        const body = new FormData();

        for (const imgFile of imgFiles) {
            body.append(imgFile.id, imgFile.data as unknown as Blob, imgFile.id);
            // eslint-disable-next-line guard-for-in
            for (const configParam in imgFile.config) {
                params[`${imgFile.id}.${configParam}`] = String(
                    imgFile.config[configParam as keyof FileConfig['config']],
                );
            }
        }

        if (selectedTemplate) {
            params.template = selectedTemplate;
        }

        const url = new URLSearchParams(params);
        const response = await fetch(`/api/cropped-docs3?${url.toString()}`, {
            method: 'POST',
            body,
        });

        await response.blob();
    }, [imageSrc, imgFiles, selectedTemplate]);

    const showCroppedImage = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async () => {
            try {
                uploadToServer();
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        },
        [uploadToServer],
    );

    const onFileChange = React.useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async (e: any) => {
            if (e.target.files && e.target.files.length > 0) {
                const files: FileConfig[] = [];
                for (const fileItem of e.target.files) {
                    for (const ext of ['.png', '.jpg', '.jpeg', '.webp']) {
                        if (fileItem.name.endsWith(ext)) {
                            files.push({
                                data: fileItem,
                                id: Math.random().toString().replaceAll('.', '-'),
                                config: initialConfig,
                            });
                            continue;
                        }
                    }
                }
                if (!selectedFile) {
                    setSelectedFile(files?.[0]);
                }

                setImgFiles([...imgFiles, ...files]);
            }
        },
        [imgFiles, selectedFile],
    );

    const zoom = selectedFile?.config.zoom;
    const rotation = selectedFile?.config.rotation;

    if (view === 'template') {
        return (
            <Navigation>
                <div className={styles.formatContainer}>
                    {templatesEntries.map((template) => {
                        return (
                            <button
                                key={template[0]}
                                className={styles.formatItem}
                                onClick={() => {
                                    setSelectedTemplate(template[0]);
                                    setView('format');
                                }}
                            >
                                {template[0]}
                            </button>
                        );
                    })}
                </div>
            </Navigation>
        );
    }

    if (view === 'format') {
        return (
            <Navigation>
                <div className={styles.formatContainer}>
                    {formats.map((f, index) => {
                        return (
                            <button
                                key={f.name + index}
                                style={{
                                    backgroundColor:
                                        f.name === selectedFormat?.name ? 'lightcoral' : 'inherit',
                                }}
                                className={styles.formatItem}
                                onClick={() => {
                                    setSelectedFormat(f);
                                    setView('files');
                                }}
                            >
                                {f.name}
                            </button>
                        );
                    })}
                </div>
            </Navigation>
        );
    }

    return (
        <Navigation>
            <div className={styles.container}>
                <div className={styles.half}>
                    <div>
                        <div>
                            {selectedTemplate && (
                                <div>
                                    <div>{templates[selectedTemplate]?.images?.length}</div>
                                    <div>
                                        {templates[selectedTemplate]?.images?.map(
                                            (img: Record<string, string>, indx: string) => {
                                                return (
                                                    <div key={indx + img.loop}>
                                                        {indx} : {img.loop}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <input type="file" onChange={onFileChange} accept="image/*" multiple />
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
                        <Button
                            onClick={() => showCroppedImage()}
                            variant="contained"
                            color="primary"
                        >
                            Show Result
                        </Button>
                    </div>
                </div>
            </div>
        </Navigation>
    );
};

function readFile(file: File) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
export default Demo;

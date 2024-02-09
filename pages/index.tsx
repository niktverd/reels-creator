import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import styles from "../styles/DefaultCrop.module.css";


type FormatType = {
    name: string;
    ratio: number;
};

const formats: FormatType[] = [
    {name: '9:16', ratio: 9/16},
    {name: '10:16', ratio: 10/16},
    {name: '1:1', ratio: 1},
    {name: '16:10', ratio: 16/10},
    {name: '16:9', ratio: 16/9},
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
    }
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

const Demo = () => {
    const [selectedFormat, setSelectedFormat] = React.useState<FormatType>(formats[0]);
    const [selectedFile, setSelectedFile] = React.useState<FileConfig | null>(null);
    const [imgFiles, setImgFiles] = React.useState<FileConfig[]>([]);
    const [imageSrc, setImageSrc] = React.useState<unknown>(null);

    const [crop, setCrop] = useState({ x: 0, y: 0 });

    useEffect(() => {
        imgFiles.forEach((imgf) => {
            if (imgf.id === selectedFile?.id) {
                imgf.config = selectedFile.config
            }
        })
    }, [selectedFile]);

    const onCropComplete = useCallback((_croppedArea: any, localcroppedAreaPixels: any) => {
        selectedFile && setSelectedFile({
            ...selectedFile,
            config: {
                ...selectedFile.config,
                ...localcroppedAreaPixels || {},
            }
        });
    }, [selectedFile, imgFiles]);

    const showCroppedImage = useCallback(async (data: any) => {
        try {
            uploadToServer({driverLicense: data.driverLicense, expired:data.expired, firstName: data.firstName, lastName: data.lastName});
        } catch (e) {
            console.error(e);
        }
    }, [imageSrc]);

    const onFileChange = async (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
            const files: FileConfig[] = []
            for (const fileItem of e.target.files) {
                for (const ext of ['.png', '.jpg', '.jpeg']) {
                    if (fileItem.name.endsWith(ext)) {
                        files.push({data: fileItem, id: Math.random().toString().replaceAll('.', '-'), config: initialConfig});
                        continue;
                    }
                }
            }
            let imageDataUrl = await readFile(files?.[0].data);
            if (!selectedFile) {
                setSelectedFile(files?.[0]);
            }

            setImgFiles([...imgFiles, ...files]);
            setImageSrc(imageDataUrl);
        }
    };

    const uploadToServer = async (data: any) => {
        if (!imageSrc) {
            return;
        }
        type SearchParamType = Record<string, string>;

        const params: SearchParamType = {};
   
        const body = new FormData();
        
        for (const imgFile of imgFiles) {
            body.append(imgFile.id, imgFile.data as unknown as Blob, imgFile.id);
            for (const configParam in imgFile.config) {
                params[`${imgFile.id}.${configParam}`] = String(imgFile.config[configParam as keyof FileConfig['config']]);
            }
        }

        const url = new URLSearchParams(params);
        const response = await fetch(
            `/api/cropped-docs3?${url.toString()}`,
            {
                method: "POST",
                body,
            }
        );

        await response.blob();
    };

    return (
        <div>
            <div>
                <input type="file" onChange={onFileChange} accept="image/*" multiple />
            </div>
            <div
                className={styles.formatContainer}
            >
                {formats.map((f, index) => {
                    return <div
                        key={f.name + index}
                        style={{backgroundColor: f.name === selectedFormat?.name ? 'lightcoral' : 'inherit'}}
                        className={styles.formatItem}
                        onClick={() => setSelectedFormat(f)}
                    >
                        {f.name}
                    </div>
                })}
            </div>
            <div>
                {imgFiles.map((f, index) => {
                    return <div
                        key={f.data.name + index}
                        className={styles.fileItem}
                        style={{backgroundColor: f.id === selectedFile?.id ? 'lightcoral' : 'inherit'}}
                        onClick={async () => {
                            const fileForCrop = await readFile(f.data);
                            setImageSrc(fileForCrop);
                            setSelectedFile(f);
                        }}
                    >
                        {f.data.name} {f.id}
                    </div>;
                })}
            </div>
                <div className={styles.container}>
                    <div className={styles.cropper}>
                        <Cropper
                            // className={styles.cropper}
                            image={imageSrc as string}
                            crop={crop}
                            rotation={selectedFile?.config.rotation || 0}
                            zoom={selectedFile?.config.zoom || 1}
                            aspect={selectedFormat.ratio || 1}
                            onCropChange={setCrop}
                            onRotationChange={(value: number) => 
                                selectedFile && setSelectedFile({
                                    ...selectedFile, 
                                    config: {
                                        ...selectedFile.config,
                                        rotation: value,
                                    },
                            })}
                            onCropComplete={onCropComplete}
                            onZoomChange={(value: number) => 
                                selectedFile && setSelectedFile({
                                    ...selectedFile, 
                                    config: {
                                        ...selectedFile.config,
                                        zoom: value,
                                    },
                            })}
                        />
                    </div>

                    <div className={styles.controls}>
                        <div>
                            <Typography variant="overline">Zoom</Typography>
                            <Slider
                                value={selectedFile?.config.zoom}
                                min={1}
                                max={5}
                                step={0.05}
                                aria-labelledby="Zoom"
                                onChange={(e, zoom) => selectedFile && setSelectedFile({...selectedFile, config: {...selectedFile?.config, zoom: zoom as number}})}
                            />
                        </div>
                        <div>
                            <Typography variant="overline">
                                Rotation
                            </Typography>
                            <Slider
                                value={selectedFile?.config.rotation}
                                min={0}
                                max={360}
                                step={1}
                                aria-labelledby="Rotation"
                                onChange={(e, rotation) =>
                                    selectedFile && setSelectedFile({...selectedFile, config: {...selectedFile?.config, rotation: rotation as number}})
                                }
                            />
                        </div>
                        <Button
                            onClick={() => showCroppedImage({})}
                            variant="contained"
                            color="primary"
                        >
                            Show Result
                        </Button>
                    </div>
                </div>
        </div>
    );
};

function readFile(file: any) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => resolve(reader.result), false);
        reader.readAsDataURL(file);
    });
}
export default Demo;

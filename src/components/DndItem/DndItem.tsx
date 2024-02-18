import React from 'react';

import type {DraggingStyle, NotDraggingStyle} from 'react-beautiful-dnd';
import {Draggable} from 'react-beautiful-dnd';
import type {Area} from 'react-easy-crop/types';

import {useFormatContext} from '../../contexts/formatContext';
import type {FileConfig} from '../../types/common';
import {readFile} from '../../utils/read-file';
import {Cropper} from '../Cropper/Cropper';
import {CropperPreview} from '../CropperPreview/CropperPreview';

import styles from './DndItem.module.css';

type DndItemProps = {
    item: FileConfig;
    index: number;
    ratio: number;
};

const grid = 8;

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => ({
    userSelect: 'none',
    margin: `0 ${grid}px 0 0`,

    opacity: isDragging ? 0.3 : 1,

    ...draggableStyle,
});

export const DndItem = ({item, index}: DndItemProps) => {
    const {selectedFormat} = useFormatContext();
    const height = selectedFormat.ratio < 1 ? selectedFormat.ratio * 100 : 100;
    const width = selectedFormat.ratio > 1 ? selectedFormat.ratio * 100 : 100;
    const [croppedArea, setCroppedArea] = React.useState<Area>({x: 0, y: 0, height, width});
    const {ratio} = selectedFormat;
    const [showCropper, setShowCropper] = React.useState(false);
    const [zoom, setZoom] = React.useState(1);

    const [imageSrc, setImageSrc] = React.useState<unknown>(null);

    React.useEffect(() => {
        const loadFile = async () => {
            const imgSrc = await readFile(item.data);
            setImageSrc(imgSrc);
        };

        loadFile();
    }, [item.data]);

    const onCropComplete = React.useCallback(
        (localCroppedArea: Area, _localCroppedAreaPixels: Area) => {
            setCroppedArea(localCroppedArea);
        },
        [],
    );

    return (
        <Draggable draggableId={item.id} index={index}>
            {(provided, snapshot) => {
                return (
                    <div
                        className={styles.card}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                            ...(getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                            ) as React.StyleHTMLAttributes<{}>),
                            aspectRatio: `${ratio}`,
                            minWidth: 200,
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                position: 'relative',
                                zIndex: 1,
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <div
                                {...provided.dragHandleProps}
                                style={{
                                    backgroundColor: '#ff0f0f88',
                                    display: 'grid',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    textAlign: 'center',
                                    height: 30,
                                    zIndex: 3,
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                }}
                            >
                                drag&drop
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 2,
                                }}
                            >
                                <div>
                                    {croppedArea && (
                                        <CropperPreview
                                            croppedArea={croppedArea}
                                            img={imageSrc}
                                            scale={zoom}
                                        />
                                    )}
                                </div>
                            </div>
                            <div
                                style={{
                                    backgroundColor: '#00ff0f',
                                    display: 'grid',
                                    alignItems: 'center',
                                    alignContent: 'center',
                                    textAlign: 'center',
                                    height: 30,
                                    zIndex: 3,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',
                                }}
                            >
                                <button onClick={() => setShowCropper(true)}>edit</button>
                            </div>
                        </div>
                        {showCropper && (
                            <div
                                style={{
                                    position: 'fixed',
                                    bottom: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    // display: showCropper ? 'block' : 'none',
                                    backgroundColor: '#ffffff',
                                    zIndex: 1000,
                                    left: 0,
                                }}
                            >
                                <div>
                                    <button
                                        onClick={() => {
                                            setShowCropper(false);
                                        }}
                                    >
                                        close
                                    </button>
                                </div>
                                <Cropper
                                    selectedFormat={selectedFormat}
                                    imageSrc={imageSrc}
                                    onCropComplete={onCropComplete}
                                    zoom={zoom}
                                    setZoom={setZoom}
                                    initialCroppedAreaPercentages={croppedArea}
                                />
                            </div>
                        )}
                    </div>
                );
            }}
        </Draggable>
    );
};

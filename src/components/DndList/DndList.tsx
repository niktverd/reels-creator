import React from 'react';

import type {DraggingStyle, NotDraggingStyle} from 'react-beautiful-dnd';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';

// import styles from './DndList.module.css';

// type DndListProps = {
//     selectedFormat: FormatType;
//     selectedFile: FileConfig | null;
//     setSelectedFile: React.Dispatch<React.SetStateAction<FileConfig | null>>;
//     imageSrc: unknown;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     onCropComplete: (_croppedArea: any, localcroppedAreaPixels: any) => void;
// };

const getItems = (count: number) =>
    Array.from({length: count}, (v, k) => k).map((k) => ({
        id: `item-${k}`,
        content: `item ${k}`,
    }));

const grid = 8;

const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,

    background: isDragging ? 'lightgreen' : 'grey',

    ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: '100%',
    display: 'flex',
    overflow: 'auto',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const DndList = () => {
    const [items, setItems] = React.useState(getItems(30));
    // resetServerContext();
    React.useEffect(() => {
        // resetServerContext();
    }, []);
    const [winReady, setwinReady] = React.useState(false);
    React.useEffect(() => {
        setwinReady(true);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const newItems = reorder(items, result.source.index, result.destination.index);

        setItems(newItems);
    };

    if (!winReady) {
        return null;
    }
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
                {(drpProvided, drpSnapshot) => (
                    <div
                        {...drpProvided.droppableProps}
                        ref={drpProvided.innerRef}
                        style={getListStyle(drpSnapshot.isDraggingOver)}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={
                                                getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style,
                                                ) as React.StyleHTMLAttributes<{}>
                                            }
                                        >
                                            {item.content}
                                        </div>
                                    );
                                }}
                            </Draggable>
                        ))}
                        {drpProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export type View = 'template' | 'format' | 'files';

export type FormatType = {
    name: string;
    ratio: number;
};

export type FileConfig = {
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

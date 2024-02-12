import {resolve as pathResolve} from 'path';

import videoshow from 'videoshow';

import {templates} from '../templates';

const videoOptions = {
    fps: 60,
    transition: false,
    videoBitrate: 1024,
    videoCodec: 'libx264',
    size: '720x1280',
    outputOptions: ['-pix_fmt yuv420p'],
    format: 'mp4',
};

export const createVideo = ({
    imageFiles,
    folder,
    template = 'first',
}: {
    imageFiles: string[];
    folder: string;
    template: string;
}): Promise<string> => {
    return new Promise((resolve, reject) => {
        const images = templates[template].images.map((piece: object, index: number) => {
            return {...piece, path: imageFiles[index]};
        });

        const sound = templates[template].sound;

        videoshow(images, videoOptions)
            .audio(sound, {fade: false})
            .save(pathResolve(folder, 'output.mp4'))
            .on('start', function (command: string) {
                // eslint-disable-next-line no-console
                console.log('encoding ' + folder + ' with command ' + command);
            })
            .on('error', function (err: string) {
                reject(new Error(err));
            })
            .on('end', function (output: string) {
                resolve(output);
            });
    });
};

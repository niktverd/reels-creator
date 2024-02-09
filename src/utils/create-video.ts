import {resolve } from 'path';
import videoshow from 'videoshow';

const videoOptions = {
  fps: 24,
  transition: false,
  videoBitrate: 1024 ,
  videoCodec: 'libx264', 
  size: '720x1280',
  outputOptions: ['-pix_fmt yuv420p'],
  format: 'mp4' 
}

const templates = {
    first: {
        sound: '/Users/niktverd/code/shorts-cretor/source/sound/first.aac',
        images:[
            {path: '', loop: 0.33},
            {path: '', loop: 0.30},
            {path: '', loop: 0.30},
            {path: '', loop: 0.30},
            {path: '', loop: 0.30},
            {path: '', loop: 0.28},
            {path: '', loop: 0.62},
            {path: '', loop: 0.59},
            {path: '', loop: 0.14},
            {path: '', loop: 0.13},
            {path: '', loop: 0.35},
            {path: '', loop: 0.70},
        ],
    },
    second: {
        sound: '/Users/niktverd/code/shorts-cretor/source/sound/second.aac',
        images: [
            {path: '', loop: 0.27},
            {path: '', loop: 2.33},
            {path: '', loop: 0.20},
            {path: '', loop: 0.2},
            {path: '', loop: 0.21},
            {path: '', loop: 0.2},
            {path: '', loop: 0.84},
            {path: '', loop: 0.41},
            {path: '', loop: 0.38},
            {path: '', loop: 0.38},
            {path: '', loop: 0.41},
            {path: '', loop: 0.42},
            {path: '', loop: 0.41},
            {path: '', loop: 0.39},
            {path: '', loop: 0.8},
            {path: '', loop: 0.47},
            {path: '', loop: 0.62},
        ],
    },
    third: {
        sound: '/Users/niktverd/code/shorts-cretor/source/sound/third.aac',
        images: [
            {path: '', loop: 0.32},
            {path: '', loop: 0.5},
            {path: '', loop: 0.44},
            {path: '', loop: 0.5},
            {path: '', loop: 0.11},
            {path: '', loop: 0.24},
            {path: '', loop: 0.46},
            {path: '', loop: 0.39},
            {path: '', loop: 0.54},
            {path: '', loop: 0.21},
            {path: '', loop: 0.23},
            {path: '', loop: 0.22},
            {path: '', loop: 0.43},
            {path: '', loop: 0.21},
            {path: '', loop: 0.20},
            {path: '', loop: 0.46},
            {path: '', loop: 0.24},
            {path: '', loop: 0.22},
            {path: '', loop: 0.21},
            {path: '', loop: 0.23},
            {path: '', loop: 0.43},
            {path: '', loop: 0.11},
            {path: '', loop: 0.13},
            {path: '', loop: 0.2},
            {path: '', loop: 0.36},
        ],
    },
};

const template = templates['first'];

export const createVideo = ({imageFiles, folder} : {imageFiles: string[], folder: string}) => {
    var images = template.images.map((piece, index) => {
        return {...piece, path: imageFiles[index]};
    });
    
    videoshow(images, videoOptions)
        .audio(template.sound, {fade: false})
        .save(resolve(folder, 'output.mp4'))
        .on('start', function (command: any) { 
            console.log('encoding ' + folder + ' with command ' + command) 
        })
        .on('error', function (err: string) {
            return Promise.reject(new Error(err)) 
        })
        // .on('end', function (output) {
        // // do stuff here when done
        // })
}
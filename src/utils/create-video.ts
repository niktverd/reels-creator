import {resolve } from 'path';
import videoshow from 'videoshow';
import {templates} from '../templates';

const videoOptions = {
  fps: 60,
  transition: false,
  videoBitrate: 1024 ,
  videoCodec: 'libx264', 
  size: '720x1280',
  outputOptions: ['-pix_fmt yuv420p'],
  format: 'mp4' 
}

export const createVideo = ({imageFiles, folder, template = 'first'} : {imageFiles: string[], folder: string, template: string}) => {
    const images = templates[template].images.map((piece: any, index: number) => {
        return {...piece, path: imageFiles[index]};
    });

    const sound = templates[template].sound;
    console.log('images', images, template, templates[template], imageFiles, sound);
    
    videoshow(images, videoOptions)
        .audio(sound, {fade: false})
        .save(resolve(folder, 'output.mp4'))
        .on('start', function (command: any) { 
            console.log('encoding ' + folder + ' with command ' + command) 
        })
        .on('error', function (err: string) {
            return Promise.reject(new Error(err)) 
        })
        .on('end', function (output: any) {
            // do stuff here when done
            console.log('output', output);
        })
}
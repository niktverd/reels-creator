/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import {mkdirSync, readFileSync} from 'fs';
import {resolve} from 'path';

import {addDoc, collection} from 'firebase/firestore/lite';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import type {File} from 'formidable';
import {IncomingForm} from 'formidable';
import type {NextApiRequest, NextApiResponse} from 'next';
import sharp from 'sharp';

import db, {storage} from '../../configs/firebase';
import {templates} from '../../src/templates';
import {createVideo} from '../../src/utils/create-video';
import {obtainToken} from '../../src/utils/token';

const isDebug = false;

export function getSvg(text: string, textSize: string) {
    const svg = `
        <svg
            width="500"
            height="160"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                .title {fill:rgba(177, 24, 25, 0.85); font-size: ${textSize}; font-family: Myriad Pro; font-weight: bold;
            </style>
            <text x="0%" y="50%" text-anchor="left" class="title">${text}</text>
        </svg>
    `;

    return svg;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

const isFile = (file: File | File[]): file is File => {
    return (file as File).filepath !== undefined;
};

async function cropMain({
    imgPath,
    params,
    folderPath,
    fileName,
    index,
    time,
}: {
    imgPath: string;
    params: Record<string, string | number>;
    folderPath: string;
    fileName: string;
    index: string;
    time: string;
}) {
    const rotation = parseFloat((params.rotation as string) ?? '0');
    const cropInfo = {
        left: parseFloat((params.x as string) ?? '0'),
        top: parseFloat((params.y as string) ?? '0'),
        width: parseFloat((params.width as string) ?? '100'),
        height: parseFloat((params.height as string) ?? '100'),
    };
    const dogImage = sharp(imgPath);
    console.log('Getting meta...');
    dogImage.metadata();
    await dogImage.metadata().then((metadata) => {
        console.log(`Source image size is ${metadata.width}x${metadata.height}`);
    });

    console.log('Rotation...');
    dogImage.rotate(rotation);

    console.log('Loading image...');
    await sharp(await dogImage.toBuffer()).metadata();

    console.log('Cropping...', cropInfo);
    const dogImageCropped = dogImage.extract(cropInfo);
    const finalFilePath = resolve(folderPath, new Date().toISOString() + '-' + fileName + '.png');
    console.log('Saving image...');
    const textSvg = getSvg(fileName, '36px');
    const indexSvg = getSvg(index, '36px');
    const timeSvg = getSvg(time, '36px');
    await dogImageCropped
        .composite(
            [
                {
                    input: Buffer.from(textSvg),
                    top: 10,
                    left: 10,
                },
                {
                    input: Buffer.from(indexSvg),
                    top: 50,
                    left: 10,
                },
                {
                    input: Buffer.from(timeSvg),
                    top: 90,
                    left: 10,
                },
            ].filter((_a) => isDebug),
        )
        .resize(720, 1280)
        .png()
        .toFile(finalFilePath);

    return finalFilePath;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const requestName = new Date().toISOString().replace(/[^0-9]/g, '');
    const folderPath = resolve('./assets/output', requestName);
    mkdirSync(folderPath);
    const form = new IncomingForm({multiples: true});
    form.parse(req, async function (err, fields, files) {
        if (err) {
            res.status(500).json({error: 'Error parsing form data'});
            return;
        }

        const images = templates[req.query.template as string].images;

        const fileSaved = [];
        let index = 0;
        for (const fileName in files) {
            if (images.length <= index) {
                continue;
            }
            const f = files[fileName];
            if (isFile(f)) {
                const params: Record<string, string | number> = {};
                for (const param in req.query) {
                    if (f.originalFilename && param.includes(f.originalFilename)) {
                        const asString = req.query[param] as string;
                        const asNumber = Number(asString);
                        params[param.split(`${f.originalFilename}.`)[1]] = isNaN(asNumber)
                            ? asString
                            : asNumber;
                    }
                }
                const finalFilePath = await cropMain({
                    imgPath: f.filepath,
                    params,
                    folderPath,
                    fileName,
                    index: index.toString(),
                    time: images[index]?.loop?.toString(),
                });
                fileSaved.push(finalFilePath);
                index++;
            }
        }

        res.status(200).json({message: 'check your profile in a few minutes'});

        const outputFilePath = await createVideo({
            imageFiles: fileSaved,
            folder: folderPath,
            template: req.query.template as string,
        });

        const fileBuffer = readFileSync(outputFilePath);
        const fileRef = ref(storage, `${tokenId}/${requestName}-output.mp4`);
        await uploadBytes(fileRef, fileBuffer);
        const downloadURL = await getDownloadURL(fileRef);

        const compiledFileRef = collection(db, 'videos', tokenId, 'items');
        await addDoc(compiledFileRef, {
            url: downloadURL,
            name: requestName,
            description: '',
            template: req.query.template as string,
            externalLink: '',
        });
    });
};

const crop = (req: NextApiRequest, res: NextApiResponse) => {
    req.method === 'POST'
        ? handler(req, res)
        : req.method === 'PUT'
          ? console.log('PUT')
          : req.method === 'DELETE'
            ? console.log('DELETE')
            : req.method === 'GET'
              ? console.log('GET')
              : res.status(404).send('');
};

export default crop;

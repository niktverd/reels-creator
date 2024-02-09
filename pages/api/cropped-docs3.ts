import type { NextApiRequest, NextApiResponse } from "next";
import sharp from 'sharp';
import { File, IncomingForm } from 'formidable';
import { mkdirSync } from "fs";
import { resolve } from "path";
import { createVideo } from "../../src/utils/create-video";


export const config = {
    api: {
        bodyParser: false
    }
};

const isFile = (file: File | File[]): file is File => {
    return (file as File).filepath !== undefined;
}

async function cropMain({imgPath, params, folderPath, fileName}: {imgPath: string, params: Record<string, string | number>, folderPath: string, fileName: string}) {
    const rotation = parseFloat((params.rotation as string) ?? "0");
    const cropInfo = {
        left: parseFloat((params.x as string) ?? "0"),
        top: parseFloat((params.y as string) ?? "0"),
        width: parseFloat((params.width as string) ?? "100"),
        height: parseFloat((params.height as string) ?? "100")
    };
    const dogImage = sharp(imgPath);
    dogImage.metadata();
    await dogImage.metadata().then((metadata) => {
        console.log(`Source image size is ${metadata.width}x${metadata.height}`);
    });

    await dogImage.rotate(rotation);

    await sharp(await dogImage.toBuffer()).metadata();

    const dogImageCropped = dogImage.extract(cropInfo);
    const finalFilePath = resolve(folderPath, new Date().toISOString() + '-' + fileName + '.png');
    await dogImageCropped
        .resize(720, 1280)
        .png()
        .toFile(finalFilePath);

    return finalFilePath;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestName = new Date().toISOString().replace(/[^0-9]/g, '');
    const folderPath = resolve('./assets/output', requestName);
    mkdirSync(folderPath);
    const form = new IncomingForm({ multiples: true });
    form.parse(req, async function (err, fields, files) {
        if (err) {
            res.status(500).json({ error: 'Error parsing form data' });
            return;
        }

        const fileSaved = [];
        for (const fileName in files) {
            const f = files[fileName];
            if (isFile(f)) {
                console.log(f.originalFilename);
                const params: Record<string, string | number> = {};
                for (const param in req.query) {
                    if (f.originalFilename && param.includes(f.originalFilename)) {
                        const asString = req.query[param] as string;
                        const asNumber = Number(asString);
                        params[param.split(`${f.originalFilename}.`)[1]] = isNaN(asNumber) ? asString : asNumber;
                    }
                }
                const finalFilePath = await cropMain({imgPath: f.filepath, params, folderPath, fileName});
                fileSaved.push(finalFilePath);
            }
        }

        console.log('fileSaved', fileSaved);
        createVideo({imageFiles: fileSaved, folder: folderPath});
    });
};

const crop = (req: NextApiRequest, res: NextApiResponse) => {
    req.method === "POST"
      ? handler(req, res)
      : req.method === "PUT"
      ? console.log("PUT")
      : req.method === "DELETE"
      ? console.log("DELETE")
      : req.method === "GET"
      ? console.log("GET")
      : res.status(404).send("");
  };

  export default crop;

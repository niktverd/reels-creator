/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
import {createReadStream} from 'fs';
import {URL} from 'url';

import axios from 'axios';
import FormData from 'form-data';
import {IncomingForm} from 'formidable';
import type {NextApiRequest, NextApiResponse} from 'next';

import {obtainToken} from '../../src/utils/token';

export const config = {
    api: {
        bodyParser: false,
    },
};

const workingserverUrlPath = process.env.BACKEND_SERVER || 'http://localhost:3030/create-video';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const data = (await new Promise((resolvePromise, reject) => {
        const form = new IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            return resolvePromise({fields, files});
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })) as any;

    const formData = new FormData();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(data.files).forEach(([fileName, fileData]: any) => {
        const stream = createReadStream(fileData.filepath);
        formData.append(fileName, stream, fileData.originalFilename);
    });

    const url = new URL('/cloud-run/reels-creator', workingserverUrlPath);
    const responseFromServer = await axios.post(url.href, formData, {
        params: {...req.query, tokenId},
        headers: {
            ...formData.getHeaders(),
        },
    });

    res.status(responseFromServer.status).send(responseFromServer.statusText);
    return;
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

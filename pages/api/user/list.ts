/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import {collection, getDocs} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainToken} from '../../../src/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const videoCreatorsColRef = collection(db, 'videos', tokenId, 'items');
    const videoCreatorsSnap = await getDocs(videoCreatorsColRef);
    if (videoCreatorsSnap.empty) {
        res.status(200).json({
            ok: true,
            data: [],
        });

        return;
    }

    const videoCreators = videoCreatorsSnap.docs.map((docEnt) => {
        console.log(docEnt.data());
        return {
            ...docEnt.data(),
            id: docEnt.id,
        };
    });

    res.status(200).json({
        ok: true,
        data: videoCreators,
    });
};

const crop = (req: NextApiRequest, res: NextApiResponse) => {
    req.method === 'GET'
        ? handler(req, res)
        : req.method === 'PUT'
          ? console.log('PUT')
          : req.method === 'DELETE'
            ? console.log('DELETE')
            : req.method === 'POST'
              ? console.log('POST')
              : res.status(404).send('');
};

export default crop;

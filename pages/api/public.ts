/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
import {doc, getDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../configs/firebase';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {alreadyLoaded = []} = req.query;
    const pagesRef = doc(db, 'public', 'pages');
    const pagesSnap = await getDoc(pagesRef);
    const pages = pagesSnap.exists() ? pagesSnap.data() : {items: []};

    const array = pages.items.filter((item: {id: string; count: number}) => {
        return !alreadyLoaded.includes(item.id);
    });

    const item = array.length ? array[Math.floor(Math.random() * array.length)] : null;

    const docRef = doc(db, 'public', 'pages', 'items', item.id);
    const itemSnap = await getDoc(docRef);
    const itemData = itemSnap.exists() ? itemSnap.data() : {videos: []};

    res.status(200).json({
        ok: true,
        data: itemData,
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

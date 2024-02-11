import { addDoc, collection } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";
import db from '../../configs/firebase';

export const config = {
    api: {
        bodyParser: false
    }
};

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    const colRef = collection(db, 'test');
    await addDoc(colRef, {x: 123});
    res.status(200).json({ok: true});
};

const crop = (req: NextApiRequest, res: NextApiResponse) => {
    req.method === "POST"
        ? console.log("POST")
        : req.method === "PUT"
        ? console.log("PUT")
        : req.method === "DELETE"
        ? console.log("DELETE")
        : req.method === "GET"
        ? handler(req, res)
      : res.status(404).send("");
  };

  export default crop;

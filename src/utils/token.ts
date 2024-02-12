import type {NextApiRequest, NextApiResponse} from 'next';
import {getToken} from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export const obtainToken = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
    const token = await getToken({req, secret});
    if (!token?.sub) {
        const errorMessage = 'You must be logged in.';
        res.status(401).json({ok: false, message: errorMessage});
        throw new Error(errorMessage);
    }

    return token.sub || '';
};

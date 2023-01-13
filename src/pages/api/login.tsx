import type { NextApiRequest, NextApiResponse } from 'next'
import { ILoginedReturn } from '../../libs/server/auth';

type ResponseData = {
    message: string,
    data: ILoginedReturn | null
}

import { auth } from '../../libs/server/auth'

function login(req: NextApiRequest, resp: NextApiResponse<ResponseData>): void {
    const auth_str = req.headers.authorization;
    if (auth_str == null) {
        resp.status(401).json({ message: "please provide username and password", data: null })
        return;
    }
    const auth_data = auth_str.split(' ')[1]
    const credentials = Buffer.from(auth_data, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = auth({ username: username, password: password });
    if (user) {

        resp.status(200).json({ message: "", data: user });
        return;
    } else {
        resp.status(401).json({ message: "Invalid credentials", data: null })
    }

    return;
}

export default login;
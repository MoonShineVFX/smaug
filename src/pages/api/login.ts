// import cookie from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticate } from '../../libs/server/auth'

async function handleLogin(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  const auth_str = req.headers.authorization;
  if (auth_str == null) {
    res.status(401).json({ message: "please provide username and password", data: null })
    return;
  }
  const auth_data = auth_str.split(' ')[1]
  const credentials = Buffer.from(auth_data, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  const token = await authenticate({ username: username, password: password })
  if (token) {
    // res.setHeader('Set-Cookie', cookie.serialize('authToken', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== 'development',
    //   sameSite: 'strict',
    //   path: '/',
    //   maxAge: 3600,
    // }))
    res.setHeader('Authorization', `Bearer ${token}`)
    res.status(200).json({ message: 'welcome' });
    return;
  } else {
    res.status(401).json({ message: "invalid username or password", data: null })
  }
  return;
}

export default handleLogin;
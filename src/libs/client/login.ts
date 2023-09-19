import cookie from 'cookie';
import { UserDisplayInfo } from "../types";


export async function loginHandler(username: string, password: string): Promise<UserDisplayInfo | null> {

  const authString = `${username}:${password}`;
  const encodedAuthString = Buffer.from(authString).toString('base64');

  try {
    const resp = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuthString}`
      }
    });

    if (resp.ok) {
      const userData = await resp.json();
      return userData;
    }
    else {
      console.error("Failed to login:", await resp.json());
      return null;
    }
  }
  catch (error) {
    console.error("Failed to login:", error);
    return null;
  }
}


export function toAuthBase64(username: string, password: string): string {
  const authString = `${username}:${password}`;
  const encodedAuthString = Buffer.from(authString).toString('base64');
  return encodedAuthString;
}


export function getAuthCookie() {
  if (typeof document !== 'undefined') {
    const cookies = cookie.parse(document.cookie);
    return cookies['authToken'] ? `Bearer ${cookies['authToken']}` : null;
  }
  return null;
}
import { UserDisplayInfo } from "../types";

async function loginHandler(username: string, password: string): Promise<UserDisplayInfo | null> {

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

export { loginHandler }



// import useSWR from 'swr';
// import { UserInfo } from '../../libs/types';


// const handleLogin = async () => {
//   try {
//     const response = await fetch('/api/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         // Assuming username and password fields for simplicity
//         username: 'sampleUsername',
//         password: 'samplePassword',
//       }),
//     });

//     const userData: UserInfo = await response.json();
//     login(userData);
//   } catch (error) {
//     console.error("Failed to login:", error);
//   }
// };

// export { handleLogin }
async function loginHandler(username: string, password: string): Promise<Response | null> {
  // const username = document.getElementById('username') as HTMLInputElement;
  // const password = document.getElementById('password') as HTMLInputElement;

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
    return (resp);
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
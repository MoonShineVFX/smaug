async function loginHandler(): Promise<Response> {
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    const authString = `${username.value}:${password.value}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');

    const resp = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedAuthString}`
        }
    });
    return(resp);
}

export {loginHandler}
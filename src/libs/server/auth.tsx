interface ILoginParams {
    username: string;
    password: string;
}

interface ILoginResponse {
    id: number;
    name: string;
    email: string;
}

function auth(credential: ILoginParams): ILoginResponse {
    if (credential.username === "admin" && credential.password === "admin") {
        return {
            id: 1,
            name: "Admin",
            email: "admin@gmail.com"
        }
    }
    else {
        return null;
    }
}

export { auth };
export type { ILoginResponse };

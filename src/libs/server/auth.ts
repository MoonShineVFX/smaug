type UserInfo = {
    id: string;
    name: string;
    email: string;
    picture: string;
}
interface ILoginParams {
    username: string;
    password: string;
}

interface ILoginedReturn {
    id: number;
    name: string;
    email: string;
    picture: string;
}

function auth(credential: ILoginParams): ILoginedReturn | null {
    if (credential.username === "admin" && credential.password === "admin") {
        return {
            id: 1,
            name: "Admin",
            email: "admin@gmail.com",
            picture: "https://material-ui.com/static/images/avatar/1.jpg"
        }
    }
    else {
        return null;
    }
}

export { auth };
export type { UserInfo, ILoginedReturn };

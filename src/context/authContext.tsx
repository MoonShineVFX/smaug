import { createContext, ReactNode, useState } from 'react';
import { UserDisplayInfo } from '../libs/types';



type AuthContextType = {
    user: UserDisplayInfo | null;
    login: (userData: UserDisplayInfo | null) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserDisplayInfo | null>(null);

    const login = (userData: UserDisplayInfo| null) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
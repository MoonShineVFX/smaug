import { createContext, ReactNode, useState } from 'react';
import { UserDisplayInfo } from '../libs/types';


type AuthContextType = {
  user: UserDisplayInfo | null;
  loginUser: (userData: UserDisplayInfo | null) => void;
  logoutUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loginUser: () => { }, logoutUser: () => { } });

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDisplayInfo | null>(null);

  const loginUser = (userInfo: UserDisplayInfo | null) => {
    setUser(userInfo);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}
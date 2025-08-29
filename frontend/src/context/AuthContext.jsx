import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if(stored) {
            console.log(stored)
            setUser(JSON.parse(stored));
        }
    }, []);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = () => {
        setUser(null);
        localStorage.clear();
    }

    return (
        <AuthContext.Provider value={{user, login, logout }} >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
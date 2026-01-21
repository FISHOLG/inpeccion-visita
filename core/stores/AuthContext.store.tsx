import { Auth } from "@/infraestructure/interfaces/main.interface";
import { createContext, PropsWithChildren, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface AuthInterface {
    stateAuth: boolean;
    auth?:Auth
    logIn:(data:Auth)=>void;
    logOut:()=>void;
    loading:boolean

}


export const AuthContext = createContext({}as AuthInterface);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider=({children}:PropsWithChildren)=>
{
    const [stateAuth, setStateAuth] = useState(false);
    const [userAuth, setUserAuth] = useState<Auth>();

    const [loading, setLoading] = useState(true);

    const logIn = async (data: Auth) => {
        setLoading(true);
        await AsyncStorage.setItem("authToken", JSON.stringify(data));
        setUserAuth(data);
        setStateAuth(true);
        setLoading(false);
    };
    
    const logOut = async () => {
        await AsyncStorage.removeItem("authToken");
        setUserAuth(undefined);
        setStateAuth(false);
    };

    useEffect(() => {
        const loadAuthState = async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
                setStateAuth(true);
                setUserAuth(JSON.parse(token));
            }
            setLoading(false);
        };
        loadAuthState();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                stateAuth: stateAuth,
                auth: userAuth,
                logIn: logIn,
                logOut: logOut,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}
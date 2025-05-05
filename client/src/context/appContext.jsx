import { createContext,useContext, useState } from "react";
import {useNavigate} from "react-router-dom"


// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider =({children})=>{

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);

    const value = {navigate, user, setUser, isSeller, setIsSeller,showUserLogin,setShowUserLogin}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}


// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext =()=>{
    return useContext(AppContext)
}
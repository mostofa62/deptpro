"use client";
import React , {useCallback, useEffect, useState, createContext } from "react";
import { deleteCookie, hasCookie } from 'cookies-next';


interface AppContextType{
    debtsAccountsScreen:number;
    setDebtsAccountsScreen:(debtsAccountsScreen:number)=>void;   

}



const AppContext = createContext<AppContextType>({
    debtsAccountsScreen:1,
    setDebtsAccountsScreen:(debtsAccountsScreen:number)=>{}       

});

const removeAllFromStorage=()=>{
    if(typeof window !== 'undefined'){
        localStorage.removeItem('debtsAccountsScreen');        
    }
}


const retriveStoredToken = ()=>{
        
    const debtsAccountsScreen = typeof window !== 'undefined'?localStorage.getItem('debtsAccountsScreen'):1;
    
    return{
        debtsAccountsScreen: debtsAccountsScreen,                
    }
};

export default AppContext;



export const AppContextProvider = (props:any)=>{

    
    //const [tokenId, setTokenId] = useLocalStorage('token',tokenData?.token);
    //const [expTime, setExpTime] = useLocalStorage('expirationTime',tokenData?.duration);
    
    const tokenData = retriveStoredToken();
    
    

    let initialDebtsAccountsScreen:any;    
    
    if(tokenData){
        initialDebtsAccountsScreen = tokenData.debtsAccountsScreen;       
        
        
    }
    const [debtsAccountsScreen , setDebtsAccountsScreen] = useState(initialDebtsAccountsScreen);
    


    

    const setDebtsAccountsScreenEditHandler = (debtsAccountsScreen:number)=>{
        if(typeof window !== 'undefined'
        && typeof debtsAccountsScreen != 'undefined'             
        ){
            setDebtsAccountsScreen(debtsAccountsScreen);
            if(debtsAccountsScreen!==null){
                localStorage.setItem('debtsAccountsScreen',debtsAccountsScreen.toString());
            }

        }
    }

    

   
    

    

    
    
    /*
    useEffect(()=>{
        if(tokenData){
            console.log(tokenData.duration);
            logoutTimer =  setTimeout(logoutHandler, tokenData.duration);
        }

    },[tokenData,logoutHandler]);
    */
    const contextValue:AppContextType = {
        debtsAccountsScreen:debtsAccountsScreen,
        
        setDebtsAccountsScreen:setDebtsAccountsScreenEditHandler,
        

        
    };
    return <AppContext.Provider value={contextValue}>
    {props.children}
    </AppContext.Provider>;
}

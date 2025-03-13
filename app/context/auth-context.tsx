"use client";
import React , {useCallback, useEffect, useState, createContext } from "react";
import { deleteCookie, hasCookie } from 'cookies-next';


interface AuthContextType{
    token:string |undefined|null,
    displayName:string |undefined|null,
    isLoggedIn:boolean,
    userId:string|undefined|null,
    adminId:string|undefined|null,
    role:string|undefined|null,
    adminRole:string|undefined|null,   
    
    
    login:(token:string, expirationTime:Date, role:string,displayName:string, userId:string)=>void,
    loginAdmin:(token:string, expirationTime:Date, adminRole:string,displayName:string, adminId:string)=>void,
    logout:()=>void,
    logoutAdmin:()=>void,
    
    selectedName:(displayName:string|undefined|null)=>void,

    logAsUser:(userId:string, role:string)=>void
    

    

    

    


}


let logoutTimer:ReturnType<typeof setTimeout>;
const AuthContext = createContext<AuthContextType>({
    token :null,
    displayName:null,
    isLoggedIn: false,
    role:null,
    adminRole:null,
    userId:null,
    adminId:null,   
    
    login:(token:string, expirationTime:Date, role:string,displayName:string, userId:string)=>{},
    loginAdmin:(token:string, expirationTime:Date, adminRole:string,displayName:string, adminId:string)=>{},
    logout:()=>{},
    logoutAdmin:()=>{},
    selectedName:(displayName:string|undefined|null) =>{},
    logAsUser:(userId:string, role:string)=>{}
    
    

});
/*
const calculateRemainingTime = (expirationTime:any)=>{
    const currentTime  = new Date().getTime();
    //console.log(expirationTime)
    const adjExpirationTime  = new Date(expirationTime).getTime();
    const remaintingDuration = adjExpirationTime - currentTime;

    return remaintingDuration;
};
*/
const removeAllFromStorage=()=>{
    if(typeof window !== 'undefined'){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('userRole');
        localStorage.removeItem('DisplayName');
        localStorage.removeItem('userId');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminId');                    

    }
}

const removeAllFromStorageAdmin=()=>{
    if(typeof window !== 'undefined'){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('DisplayName');
        localStorage.removeItem('adminId'); 
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');                   

    }
}


const retriveStoredToken = ()=>{

    const storedToken  = typeof window !== 'undefined'?localStorage.getItem('token'):null;
    const storedExpirationDate = typeof window !== 'undefined'?localStorage.getItem('expirationTime'):new Date().toString()
    const role = typeof window !== 'undefined'?localStorage.getItem('userRole'):null;
    const displayName = typeof window !== 'undefined'?localStorage.getItem('DisplayName'):null;
    const userId = typeof window !== 'undefined'?localStorage.getItem('userId'):null;
              
    return{
        token: storedToken,
        //duration: remaintingTime,
        role:role,
        displayName:displayName,
        userId:userId,        
        
    }
};

const retriveStoredTokenAdmin = ()=>{

    const storedToken  = typeof window !== 'undefined'?localStorage.getItem('token'):null;
    const storedExpirationDate = typeof window !== 'undefined'?localStorage.getItem('expirationTime'):new Date().toString()
    const adminRole = typeof window !== 'undefined'?localStorage.getItem('adminRole'):null;
    const displayName = typeof window !== 'undefined'?localStorage.getItem('DisplayName'):null;
    const adminId = typeof window !== 'undefined'?localStorage.getItem('adminId'):null;
              
    return{
        token: storedToken,
        //duration: remaintingTime,
        adminRole:adminRole,
        displayName:displayName,
        adminId:adminId,        
        
    }
};

export default AuthContext;



export const AuthContextProvider = (props:any)=>{

    
    //const [tokenId, setTokenId] = useLocalStorage('token',tokenData?.token);
    //const [expTime, setExpTime] = useLocalStorage('expirationTime',tokenData?.duration);
    
    const tokenData = retriveStoredToken();
    const tokenDataAdmin = retriveStoredTokenAdmin();
    
    

    let initialToken;
    let initUserId;
    let initDisplayName;
    let initAdminId;
    
    
    
    initialToken = tokenData.token ? tokenData.token : tokenDataAdmin.token ;
    initUserId = tokenData.userId ? tokenData.userId:null;
    initDisplayName = tokenData.displayName ? tokenData.displayName:tokenDataAdmin.displayName;            
    initAdminId = tokenDataAdmin.adminId ? tokenDataAdmin.adminId:null;    
    
    const [token , setToken] = useState(initialToken);
    
    const [userId, setUserId] = useState(initUserId);
    const [adminId, setAdminId] = useState(initAdminId);
    const [displayName, setDisplayName ] = useState(initDisplayName);

   
    
    const userIsLoggedIn = !!token;
    const role = tokenData?.role;
    const adminRole = tokenDataAdmin?.adminRole
    
    

    
    
    
    const logoutHandler= useCallback(async()=>{
            setToken(null);                
            setDisplayName(null);
            setUserId(null);
            setAdminId(null);
            if(hasCookie('AUTH_DATA')){
                deleteCookie('AUTH_DATA')
            }            
            removeAllFromStorage();

            //if(logoutTimer){
            //    clearTimeout(logoutTimer);
            //}
                
    },[]);

    const logoutHandlerAdmin= useCallback(async()=>{
        setToken(null);                
        setDisplayName(null);
        setAdminId(null);
        setUserId(null);
        if(hasCookie('AUTH_DATA')){
            deleteCookie('AUTH_DATA')
        }            
        removeAllFromStorageAdmin();
        
        //if(logoutTimer){
        //    clearTimeout(logoutTimer);
        //}
            
},[]);

    const loginHandler = (
        token:string, 
        expirationTime:Date,
        role:string,
        displayName:string,
        userId:string
        )=>{
        setToken(token);
        setUserId(userId);
        setDisplayName(displayName);
        if(typeof window !== 'undefined'){
            //console.log('here');
            localStorage.setItem('token',token);
            //localStorage.setItem('expirationTime',expirationTime.toString());
            localStorage.setItem('userRole',role);
            localStorage.setItem('DisplayName',displayName);
            localStorage.setItem('userId',userId);
            
        }      
    };

    const loginHandlerAdmin = (
        token:string, 
        expirationTime:Date,
        adminRole:string,
        displayName:string,
        adminId:string
        )=>{
        setToken(token);
        setAdminId(adminId);
        setDisplayName(displayName);
        if(typeof window !== 'undefined'){
            //console.log('here');
            localStorage.setItem('token',token);
            //localStorage.setItem('expirationTime',expirationTime.toString());
            localStorage.setItem('adminRole',adminRole);
            localStorage.setItem('DisplayName',displayName);
            localStorage.setItem('adminId',adminId);
            
        }      
    };

    

    

    

    const selectedDisplayNamehandler=(display_name:string | null|undefined)=>{
        if(typeof window !== 'undefined' 
        && typeof display_name != 'undefined' 
        ){
            setDisplayName(display_name);
            if(display_name!==null){
                localStorage.setItem('DisplayName',display_name);
            }
        }
    }

  

   

    
    const logAsUserHandler = (userId:string, role:string)=>{
        //alert(userId)
        if(typeof window !== 'undefined' 
            && typeof userId != 'undefined' 
            && typeof role != 'undefined' 
            ){
                setUserId(userId)
                localStorage.setItem('userId',userId);
                localStorage.setItem('userRole',role);
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
    const contextValue:AuthContextType = {
        token:token,
        isLoggedIn:userIsLoggedIn,
        role:role,
        displayName:displayName,
        userId:userId,
        adminId:adminId,
        adminRole:adminRole,
        
        login:loginHandler,
        logout :logoutHandler,
        loginAdmin:loginHandlerAdmin,
        logoutAdmin:logoutHandlerAdmin,
        
        selectedName:selectedDisplayNamehandler,
        logAsUser:logAsUserHandler
       
    };
    return <AuthContext.Provider value={contextValue}>
    {props.children}
    </AuthContext.Provider>;
}

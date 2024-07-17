"use client";
import React , {useCallback, useEffect, useState, createContext } from "react";
import { deleteCookie, hasCookie } from 'cookies-next';


interface AuthContextType{
    token:string |undefined|null,
    displayName:string |undefined|null,
    isLoggedIn:boolean,
    userId:string|undefined|null,
    role:string|undefined|null,
    activeMobileNumber:string|undefined|null,
    activeContactId:string|undefined|null,
    
    redirect:string|undefined|null,
    focusElement:string|undefined|null,
    boundaryReached:any,
    
    
    login:(token:string, expirationTime:Date, role:string,displayName:string, userId:string)=>void,
    logout:()=>void,
    
    selectedName:(displayName:string|undefined|null)=>void,
    selectedMobile:(activeMobileNumber:string|undefined|null)=>void,
    
    selectedContactId:(activeContactId:string|undefined|null)=>void,

    setRedirect:(route:string|undefined|null)=>void,
    setFocusElement:(focus_element:string|undefined|null)=>void

    setBoundaryReached:(boundaryReached:any)=>void

    

    cleanPreviousOnloggedIn:()=>void

    


}


let logoutTimer:ReturnType<typeof setTimeout>;
const AuthContext = createContext<AuthContextType>({
    token :null,
    displayName:null,
    isLoggedIn: false,
    role:null,
    userId:null,
    activeMobileNumber:null,
    activeContactId:null,
    redirect:null,
    focusElement:null,
    boundaryReached:null,
    
    login:(token:string, expirationTime:Date, role:string,displayName:string, userId:string)=>{},
    logout:()=>{},
    selectedName:(displayName:string|undefined|null) =>{},
    selectedMobile:(activeMobileNumber:string|undefined|null)=>{},
    selectedContactId:(activeContactId:string|undefined|null)=>{},   
    
    setRedirect:(route:string|undefined|null)=>{},
    setFocusElement:(focus_element:string|undefined|null)=>{},
    setBoundaryReached:(boundaryReached:any)=>{},
    
    cleanPreviousOnloggedIn:()=>{}

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
        localStorage.removeItem('Loguser');
        localStorage.removeItem('DisplayName');
        localStorage.removeItem('userId');
        localStorage.removeItem('MobileNumber');
        localStorage.removeItem('ContactID')        
        //data previous
        localStorage.removeItem('data');
        localStorage.removeItem('redirect');
        localStorage.removeItem('focusElement');
        localStorage.removeItem('last_section');
        localStorage.removeItem('schedule_count');
        localStorage.removeItem('boundaryReached');
        
        localStorage.removeItem('snowball');
        localStorage.removeItem('snowball_count');

    }
}


const retriveStoredToken = ()=>{

    //let storedToken,storedExpirationDate,remaintingTime;
    //if(typeof window !== 'undefined'){
        const storedToken  = typeof window !== 'undefined'?localStorage.getItem('token'):null;
        const storedExpirationDate = typeof window !== 'undefined'?localStorage.getItem('expirationTime'):new Date().toString()
        const role = typeof window !== 'undefined'?localStorage.getItem('Loguser'):null;
        const displayName = typeof window !== 'undefined'?localStorage.getItem('DisplayName'):null;
        const userId = typeof window !== 'undefined'?localStorage.getItem('userId'):null;
        const activeMobileNumber = typeof window !== 'undefined'?localStorage.getItem('MobileNumber'):null;
        const activeContactId = typeof window !== 'undefined'?localStorage.getItem('ContactID'):null;

        const redirect = typeof window !== 'undefined'?localStorage.getItem('redirect'):null;
        const focusElement = typeof window !== 'undefined'?localStorage.getItem('focusElement'):null;

        const boundaryReached = typeof window !== 'undefined'?localStorage.getItem('boundaryReached'):null;
        
        //console.log(storedExpirationDate)
        //const remaintingTime = calculateRemainingTime(storedExpirationDate);
    
    //}
    
    /*
    if(remaintingTime <= 3600){
        removeAllFromStorage();
        return null;
    }
    */
    
    return{
        token: storedToken,
        //duration: remaintingTime,
        role:role,
        displayName:displayName,
        userId:userId,
        mobileNumber:activeMobileNumber,
        contactID:activeContactId,
        redirect:redirect,
        focusElement:focusElement,
        boundaryReached:boundaryReached
        
    }
};

export default AuthContext;



export const AuthContextProvider = (props:any)=>{

    
    //const [tokenId, setTokenId] = useLocalStorage('token',tokenData?.token);
    //const [expTime, setExpTime] = useLocalStorage('expirationTime',tokenData?.duration);
    
    const tokenData = retriveStoredToken();
    
    

    let initialToken;
    let initUserId;
    let initDisplayName;
    let initMobileNumber;
    let initContactID;

    let initFocusElement;
    let initRedirect;
    let initBoundaryReached;
    
    if(tokenData){
        initialToken = tokenData.token;
        initUserId = tokenData.userId;
        initDisplayName = tokenData.displayName;
        initMobileNumber = tokenData.mobileNumber;
        initContactID = tokenData.contactID;

        initRedirect = tokenData.redirect;
        initFocusElement = tokenData.focusElement;
        initBoundaryReached = tokenData.boundaryReached;
        
        
    }
    const [token , setToken] = useState(initialToken);
    
    const [userId, setUserId] = useState(initUserId);
    const [displayName, setDisplayName ] = useState(initDisplayName);

    const [mobileNumber, setMobileNumber] = useState(initMobileNumber);

    const [contactID, setContactID] = useState(initContactID);

    const [redirect, setRedirect] = useState(initRedirect);
    const [focusElement, setFocusElement] = useState(initFocusElement);

    const [boundaryReached, setBoundaryReached] = useState(initBoundaryReached);

    
    
    const userIsLoggedIn = !!token;
    const role = tokenData?.role;
    
    

    
    
    
    const logoutHandler= useCallback(async()=>{

            setToken(null);
            
        
            setDisplayName(null);
            setMobileNumber(null);
            setContactID(null);
            setRedirect(null);
            setFocusElement(null);
            setBoundaryReached(null);
            

            if(hasCookie('AUTH_DATA')){
                deleteCookie('AUTH_DATA')
            }
            
            removeAllFromStorage();
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
            localStorage.setItem('Loguser',role);
            localStorage.setItem('DisplayName',displayName);
            localStorage.setItem('userId',userId);
            
        }
        //const remaintingTime =  calculateRemainingTime(expirationTime.toString());

        //logoutTimer= setTimeout(logoutHandler, remaintingTime);
        //logoutTimer =  setTimeout(logoutHandler, 3000);
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

    const selectedMobileNumberhandler=(mobile_number:string | null|undefined)=>{
        if(typeof window !== 'undefined' 
        && typeof mobile_number != 'undefined'){
            setMobileNumber(mobile_number);
            if(mobile_number!==null){
                localStorage.setItem('MobileNumber',mobile_number);
            }
        }
    }

    const selectedContactIdhandler=(contact_id:string | null|undefined)=>{
        if(typeof window !== 'undefined' 
        && typeof contact_id != 'undefined'){
            //console.log('contact type'+typeof contact_id);
            setContactID(contact_id);
            if(contact_id !== null){
                localStorage.setItem('ContactID',contact_id);
            }
        }
    }

    const setRedirectHandler = (re_direct:string|undefined|null)=>{
        if(typeof window !== 'undefined' 
        && typeof re_direct != 'undefined' 
        ){
            setRedirect(re_direct);
            if(re_direct!==null){
                localStorage.setItem('redirect',re_direct);
            }
        }
    }

    const setFocusElementHandler = (focus_element:string|undefined|null)=>{
        if(typeof window !== 'undefined' 
        && typeof focus_element != 'undefined' 
        ){
            setFocusElement(focus_element);
            if(focus_element!==null){
                localStorage.setItem('focusElement',focus_element);
            }
        }
    }

    const setBoundaryReachedHandler = (boundaryReached:any)=>{
        if(typeof window !== 'undefined' 
        && typeof boundaryReached != 'undefined' 
        ){
            setBoundaryReached(boundaryReached);
            if(boundaryReached!==null){
                localStorage.setItem('boundaryReached',boundaryReached);
            }
        }
    }

    

    const  cleanPreviousOnloggedInHandler =()=>{
        if(typeof window !== 'undefined'){
            setMobileNumber(null);
            setContactID(null);
            setRedirect(null);
            setFocusElement(null);
            setBoundaryReached(null);
                        
            localStorage.removeItem('MobileNumber');
            localStorage.removeItem('ContactID')        
            //data previous
            localStorage.removeItem('data');
            localStorage.removeItem('redirect');
            localStorage.removeItem('focusElement');
            localStorage.removeItem('last_section');
            localStorage.removeItem('schedule_count');
            localStorage.removeItem('boundaryReached');
            
            localStorage.removeItem('snowball');
            localStorage.removeItem('snowball_count');
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
        activeMobileNumber:mobileNumber,
        activeContactId:contactID,

        redirect:redirect,
        focusElement:focusElement,
        boundaryReached:boundaryReached,
        
        login:loginHandler,
        logout :logoutHandler,
        
        selectedName:selectedDisplayNamehandler,
        selectedMobile:selectedMobileNumberhandler,
        selectedContactId:selectedContactIdhandler,
        
        setRedirect:setRedirectHandler,
        setFocusElement:setFocusElementHandler,
        setBoundaryReached:setBoundaryReachedHandler,
        

        cleanPreviousOnloggedIn:cleanPreviousOnloggedInHandler
    };
    return <AuthContext.Provider value={contextValue}>
    {props.children}
    </AuthContext.Provider>;
}

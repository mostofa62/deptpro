import React from 'react';

import ReactDOM from 'react-dom';


export function removeConfirmAlert(){

    if (typeof window !== 'undefined') {

        
        const target = document.getElementById('react-confirm-alert');    
        if(target){    
            //console.log(target)
            //ReactDOM.unmountComponentAtNode(target);
            document.body.removeChild(target)

        }
        
    }

}
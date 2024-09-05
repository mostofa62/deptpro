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

export const generateRandomColor = (): string => {
    // Generate a random number between 0 and 0xFFFFFF and convert to hex
    const randomColor: string = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    // Pad with leading zeros to ensure it's 6 digits
    return `#${randomColor.padStart(6, '0')}`;
  };

export const generateRandomMixedColor = (): string => {
    // Generate random values for red, green, and blue components
    const red: number = Math.floor(Math.random() * 256);
    const green: number = Math.floor(Math.random() * 256);
    const blue: number = Math.floor(Math.random() * 256);
  
    // Convert each component to a two-digit hexadecimal string
    const redHex: string = red.toString(16).padStart(2, '0');
    const greenHex: string = green.toString(16).padStart(2, '0');
    const blueHex: string = blue.toString(16).padStart(2, '0');
  
    // Combine the components into a single hex color string
    return `#${redHex}${greenHex}${blueHex}`;
  };


  // Function to generate a color based on the value
 export const getColorForValue = (value:number, min:number, max:number) => {
    const ratio = (value - min) / (max - min);
    const r = Math.floor(255 * (1 - ratio)); // Red decreases as value increases
    const g = Math.floor(255 * ratio);       // Green increases as value increases
    const b = 100; // Blue is constant
    return `rgb(${r},${g},${b})`;
};
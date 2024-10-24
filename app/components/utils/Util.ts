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

// Same hash function as before
export const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;  // Convert to 32-bit integer
    }
    return hash;
};

 export const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0'); // Convert to hex and pad with zeros if necessary
    };
    return `#${f(0)}${f(8)}${f(4)}`;
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
 export const getColorForValue = (value:number, min:number, max:number, getHex:number=0) => {
    const ratio = (value - min) / (max - min);
    const r = Math.floor(255 * (1 - ratio)); // Red decreases as value increases
    const g = Math.floor(255 * ratio);       // Green increases as value increases
    const b = 100; // Blue is constant

    if(getHex > 0){
        return rgbToHex(r,g,b);
    }else{
        return `rgb(${r},${g},${b})`;
    }
};

export function rgbToHex(r:number, g:number, b:number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
        .toString(16)
        .slice(1)
        .toUpperCase();
}

export function mapToInterface<T>(data: any, model: any): T {
    const keys = Object.keys(model) as Array<keyof T>;
    const filteredData = {} as T;
  
    keys.forEach((key) => {
      if (key in data) {
        filteredData[key] = data[key] as T[keyof T];
      }
    });
  
    return filteredData;
  }
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
/*
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
  
*/


export const hslToHex = (h: number, s: number, l: number) => {
  // Convert HSL to RGB
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };

  const r = f(0);
  const g = f(8);
  const b = f(4);
  
  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };
  
  const hexColor = rgbToHex(r, g, b);

  // Predefined Colors (Red, Green, Blue, Orange, Purple) in RGB
  const colors = [
    { name: 'Red', rgb: { r: 255, g: 0, b: 0 } },
    { name: 'Green', rgb: { r: 0, g: 255, b: 0 } },
    { name: 'Blue', rgb: { r: 0, g: 0, b: 255 } },
    { name: 'Orange', rgb: { r: 255, g: 165, b: 0 } },
    { name: 'Purple', rgb: { r: 128, g: 0, b: 128 } },
  ];

  // Function to calculate Euclidean distance between two RGB colors
  const colorDistance = (color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }) => {
    const rDiff = color1.r - color2.r;
    const gDiff = color1.g - color2.g;
    const bDiff = color1.b - color2.b;
    return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff); // Euclidean distance
  };

  // Find the nearest color
  /*
  let nearestColor = colors[0];
  let minDistance = colorDistance({ r, g, b }, nearestColor.rgb);

  for (let i = 1; i < colors.length; i++) {
    const distance = colorDistance({ r, g, b }, colors[i].rgb);
    if (distance < minDistance) {
      nearestColor = colors[i];
      minDistance = distance;
    }
  }
  */

  return hexColor

  // return {
  //   hex: hexColor,
  //   nearestColor: nearestColor.name,
  // };
};

// Example Usage:
//const result = hslToHex(30, 100, 50); // HSL values for testing (Orange-like color)
//console.log(`The hex color is: ${result.hex}`);
//console.log(`The nearest color is: ${result.nearestColor}`);

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
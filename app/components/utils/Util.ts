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


  export const generateUniqueColors = (ids: any[]) => {
    // Predefined Colors (Red, Green, Blue, Orange, Purple) in RGB and hex values
    const colors = [
      { name: 'Tomato', rgb: { r: 255, g: 99, b: 71 }, hex: '#FF6347' },
      { name: 'Purple', rgb: { r: 128, g: 0, b: 128 }, hex: '#800080' },
      { name: 'Orange', rgb: { r: 255, g: 165, b: 0 }, hex: '#FFA500' },
      { name: 'LimeGreen', rgb: { r: 50, g: 205, b: 50 }, hex: '#32CD32' },
      { name: 'Red', rgb: { r: 255, g: 0, b: 0 }, hex: '#FF0000' },
      { name: 'RoyalBlue', rgb: { r: 65, g: 105, b: 225 }, hex: '#4169E1' },
      { name: 'DarkOrange', rgb: { r: 255, g: 140, b: 0 }, hex: '#FF8C00' },
      { name: 'Blue', rgb: { r: 0, g: 0, b: 255 }, hex: '#0000FF' },
      { name: 'ForestGreen', rgb: { r: 34, g: 139, b: 34 }, hex: '#228B22' },
      { name: 'MediumBlue', rgb: { r: 0, g: 0, b: 205 }, hex: '#0000CD' },
      { name: 'DarkRed', rgb: { r: 139, g: 0, b: 0 }, hex: '#8B0000' },
      { name: 'LawnGreen', rgb: { r: 124, g: 252, b: 0 }, hex: '#7CFC00' },
      { name: 'DarkSlateBlue', rgb: { r: 72, g: 61, b: 139 }, hex: '#483D8B' },
      { name: 'DarkViolet', rgb: { r: 148, g: 0, b: 211 }, hex: '#9400D3' },
      { name: 'OrangeRed', rgb: { r: 255, g: 69, b: 0 }, hex: '#FF4500' },
      { name: 'LightSeaGreen', rgb: { r: 32, g: 178, b: 170 }, hex: '#20B2AA' },
    ];
    
    // Track used colors to ensure uniqueness
    const result = ids.reduce((acc: { [key: string]: string }, id: any, index: number) => {
        // Calculate the color index by using modulo operator to cycle through the colors
        const colorIndex = index % colors.length; // This will cycle through 0 to 15
        const color = colors[colorIndex];
        acc[String(id)] = color.hex; // Assign the color to the ID
        return acc;
    }, {});
  
    return result;
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


  export function formatLargeNumber(number: number): string {
    const UNITS = [
        { value: 1_000_000_000_000, suffix: 'T' },  // Trillions
        { value: 1_000_000_000, suffix: 'B' },      // Billions
        { value: 1_000_000, suffix: 'M' },          // Millions
        { value: 1_000, suffix: 'K' }               // Thousands
    ];

    // Handle numbers larger than trillions (e.g., quadrillions, quintillions)
    const MAX_VALUE = 1e15; // Above 1 quadrillion
    if (number >= MAX_VALUE) {
        return (number / MAX_VALUE).toFixed(1) + 'Q+'; // Quadrillion and beyond
    }

    // Loop through UNITS to find the matching range
    for (const unit of UNITS) {
        if (number >= unit.value) {
            return (number / unit.value).toFixed(1) + unit.suffix;
        }
    }

    // For small numbers less than 1,000, format with Intl.NumberFormat
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(number);
}

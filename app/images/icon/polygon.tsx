import React from "react";

interface PolyGonSvgProps extends React.SVGProps<SVGSVGElement> {
  title: string;
  amount: number;
}

const PolyGonSvg: React.FC<PolyGonSvgProps> = ({ title, amount, ...props }) => {
  return (
    <svg viewBox="0 0 285 145" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <clipPath id="03d8a6ef3e">
          <path d="M 963.9375 13.390625 L 1246.5 13.390625 L 1246.5 158.839844 L 963.9375 158.839844 Z M 963.9375 13.390625" clipRule="nonzero"></path>
        </clipPath>
        <clipPath id="2973e01e31">
          <path d="M 1246.449219 13.390625 L 963.9375 13.390625 L 986.292969 86.117188 L 963.9375 158.839844 L 1246.449219 158.839844 L 1224.09375 86.117188 Z M 1246.449219 13.390625" clipRule="nonzero"></path>
        </clipPath>
        <clipPath id="eb71559e63">
          <path d="M 963.9375 13.390625 L 1246.5 13.390625 L 1246.5 158.804688 L 963.9375 158.804688 Z M 963.9375 13.390625" clipRule="nonzero"></path>
        </clipPath>
        <clipPath id="4031dd9247">
          <path d="M 1246.445312 13.390625 L 963.9375 13.390625 L 986.292969 86.117188 L 963.9375 158.839844 L 1246.445312 158.839844 L 1224.089844 86.117188 Z M 1246.445312 13.390625" clipRule="nonzero"></path>
        </clipPath>
      </defs>
      <g clipPath="url(#03d8a6ef3e)" transform="matrix(1, 0, 0, 1, -963.460586, -13.009265)">
        <g clipPath="url(#2973e01e31)">
          <path
            fill="#22bf6a"
            d="M 963.9375 13.390625 L 1246.3125 13.390625 L 1246.3125 158.839844 L 963.9375 158.839844 Z M 963.9375 13.390625"
            fillOpacity="1"
            fillRule="nonzero"
          ></path>
        </g>
      </g>
      <g clipPath="url(#eb71559e63)" transform="matrix(1, 0, 0, 1, -963.460586, -13.009265)">
        <g clipPath="url(#4031dd9247)">
          <path
            strokeLinecap="butt"
            transform="matrix(0.749549, 0, 0, 0.749549, 963.937074, 13.392486)"
            fill="none"
            strokeLinejoin="miter"
            d="M 376.904196 -0.00248249 L 0.000567855 -0.00248249 L 29.825786 97.024587 L 0.000567855 194.046446 L 376.904196 194.046446 L 347.078977 97.024587 Z M 376.904196 -0.00248249"
            stroke="#fe992c"
            strokeWidth="4"
            strokeOpacity="1"
            strokeMiterlimit="4"
          ></path>
        </g>
      </g>
      {/* Dynamically aligned text */}
      <text
        x="50%" // Horizontal center
        y="40%" // Vertical center for title (adjust this based on design)
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="17" // Adjusted font size for better fit
        fill="#fff"
        fontWeight="600"
      >
        {title}
      </text>
      <text
        x="50%" // Horizontal center
        y="60%" // Vertical center for amount (adjust this as needed)
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="17" // Adjusted font size for better fit
        fill="#fff"
        fontWeight="600"
      >
        ${Intl.NumberFormat('en-US').format(amount)}
      </text>
    </svg>
  );
};

export default PolyGonSvg;

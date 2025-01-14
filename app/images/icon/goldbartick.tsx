import * as React from "react";

const GoldBarTick = ({ className, style, ...props }: any) => (
  <svg
    className={`gold-bar-tick ${className || ''}`}
    style={{ ...style }}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="114.3 142.84 398.75 423.92"
    {...props}
  >
    <defs>
      <clipPath id="gold-bar-tick-a">
        <path d="M114.3 271h65.407v295.766h-65.406Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-b">
        <path d="M114.3 253H212v19h-97.7Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-c">
        <path d="M179 253.441h32.813v313.325H179Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-d">
        <path d="M211 374h66v192.766h-66Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-e">
        <path d="M276.031 356.902H309v209.864h-32.969Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-f">
        <path d="M308.137 423h65.406v143.766h-65.406Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-g">
        <path d="M373 405h33v161.766h-33Zm0 0" />
      </clipPath>
      <clipPath id="gold-bar-tick-h">
        <path d="M149 142.848h364.055V399.71H149Zm0 0" />
      </clipPath>
    </defs>
    <g clipPath="url(#gold-bar-tick-a)">
      <path
        fill="#fbb03b"
        d="M179.152 566.766h-64.851V271.262h64.851v295.504"
      />
    </g>
    <path fill="#fbb03b" d="M211.582 549.004H146.73V253.5h64.852v295.504" />
    <g clipPath="url(#gold-bar-tick-b)">
      <path
        fill="#f09a25"
        d="M114.3 271.262h64.852l32.43-17.762H146.73l-32.43 17.762"
      />
    </g>
    <g clipPath="url(#gold-bar-tick-c)">
      <path
        fill="#f09a25"
        d="m179.152 566.766 32.43-17.762V253.5l-32.43 17.762v295.504"
      />
    </g>
    <g clipPath="url(#gold-bar-tick-d)">
      <path fill="#fbb03b" d="M276.434 566.766h-64.852V374.71h64.852v192.055" />
    </g>
    <path fill="#fbb03b" d="M308.863 549.004h-64.851V356.945h64.851v192.059" />
    <path
      fill="#f09a25"
      d="M211.582 374.71h64.852l32.43-17.765h-64.852l-32.43 17.766"
    />
    <g clipPath="url(#gold-bar-tick-e)">
      <path
        fill="#f09a25"
        d="m276.434 566.766 32.43-17.762V356.945l-32.43 17.766v192.055"
      />
    </g>
    <g clipPath="url(#gold-bar-tick-f)">
      <path fill="#fbb03b" d="M373.52 566.766h-64.856V423.203h64.856v143.563" />
    </g>
    <path fill="#fbb03b" d="M405.945 549.004h-64.851V405.437h64.851v143.567" />
    <path
      fill="#f09a25"
      d="M308.664 423.203h64.856l32.425-17.765h-64.851l-32.43 17.765"
    />
    <g clipPath="url(#gold-bar-tick-g)">
      <path
        fill="#f09a25"
        d="m373.52 566.766 32.425-17.762V405.437l-32.425 17.766v143.563"
      />
    </g>
    <path fill="#fbb03b" d="M469.785 564.176h-64.851V462.629h64.851v101.547" />
    <path fill="#fbb03b" d="M502.215 546.41h-64.852V444.871h64.852v101.54" />
    <path
      fill="#f09a25"
      d="M404.934 462.629h64.851l32.43-17.758h-64.852l-32.43 17.758"
    />
    <path
      fill="#f09a25"
      d="m469.785 564.176 32.43-17.766V444.871l-32.43 17.758v101.547"
    />
    <g clipPath="url(#gold-bar-tick-h)">
      <path
        fill="#fbb03b"
        d="m513.05 399.672-42.34-88.406-17.784 25.976-283.828-194.398-19.809 28.922L433.113 366.16l-17.793 25.98 97.73 7.532"
      />
    </g>
  </svg>
);

export default GoldBarTick;

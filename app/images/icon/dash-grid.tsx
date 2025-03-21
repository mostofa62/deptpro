import * as React from "react";
import { SVGProps } from "react";
const DashGrid = (props: SVGProps<SVGSVGElement>) => (
 

<svg
xmlns="http://www.w3.org/2000/svg"   
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
strokeWidth={2}
strokeLinecap="round"
strokeLinejoin="round"
{...props}
>
<rect x={3} y={3} width={7} height={9} />
<rect x={14} y={3} width={7} height={5} />
<rect x={14} y={12} width={7} height={9} />
<rect x={3} y={16} width={7} height={5} />
</svg>
);
export default DashGrid;

import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

interface LinkProps{
    link:string;
    title:string;
    icon?: any
}
interface HolderProps{

    title:string;
    showingText?:string;
    linkItems:LinkProps[];

}

const HolderOne = ({title, showingText, linkItems}:HolderProps)=>{

   const isMobile = useMediaQuery({ maxWidth: 768 });
   const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    if (isMobile) {
      setIsExpanded((prev) => !prev);
    }
  }; 
    return (

        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
            <div className="flex flex-col py-2 md:flex-row md:h-[50px] md:px-2">
  {/* Left section: Title (Auto width based on content) */}
  <div 
  onClick={toggleExpand}
  className="cursor-pointer lmd:cursor-auto md:cursor-auto gap-2 text-md md:text-sm font-semibold flex items-center justify-center md:justify-start md:px-2 md:flex-none">
    <p className="capitalize whitespace-nowrap" >{title}</p>
    {isMobile && (
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
  </div>

  {/* Middle section: Takes remaining space */}
  <div className="flex-grow flex items-center justify-center text-sm min-w-0">
    {showingText && <p className="capitalize text-center">{showingText}</p>}
  </div>

  {/* Right section: Link items (Show only if isExpanded on mobile or always on desktop) */}
  {(isExpanded || !isMobile) && (
          <div className="flex flex-col py-1 md:flex-row items-center md:justify-end md:flex-none">
            {linkItems.map((item: LinkProps, index: number) => (
              <Link
                key={index}
                href={item.link}
                className="text-sm capitalize group gap-1.5 relative flex items-center md:gap-1 rounded-sm md:py-2 px-3 font-semibold duration-300 ease-in-out whitespace-nowrap"
              >
                {item.icon && item.icon}
                <p className="font-semibold capitalize">{item.title}</p>
              </Link>
            ))}
          </div>
        )}
  
</div>




        </div>
    )



}

export default HolderOne;
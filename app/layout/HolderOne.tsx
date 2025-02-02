import Link from "next/link";

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


    return (

        <div className="mt-[20px] bg-[#43ACD6] text-white rounded-lg border-[#43ACD6]">
            <div className="flex flex-col py-2 md:flex-row md:h-[50px] md:px-2">
  {/* Left section: Title (Auto width based on content) */}
  <div className="text-md md:text-sm font-semibold flex items-center justify-center md:justify-start md:px-2 md:flex-none">
    <p className="capitalize whitespace-nowrap">{title}</p>
  </div>

  {/* Middle section: Takes remaining space */}
  <div className="flex-grow flex items-center justify-center text-sm min-w-0">
    {showingText && <p className="capitalize text-center">{showingText}</p>}
  </div>

  {/* Right section: Link items (Auto width based on content) */}
  <div className="flex flex-col py-1 md:flex-row items-center md:justify-end md:flex-none">
    {linkItems.map((item: LinkProps, index: number) => (
      <Link
        key={index}
        href={item.link}
        className="text-sm capitalize group gap-1.5 relative flex items-center md:gap-1 rounded-sm md:py-2 px-3 font-semibold duration-300 ease-in-out whitespace-nowrap"
      >
        {/* Render icon if it exists */}
        {item.icon && item.icon}
                            <p className="font-semibold capitalize">{item.title}</p>
      </Link>
    ))}
  </div>
</div>




        </div>
    )



}

export default HolderOne;
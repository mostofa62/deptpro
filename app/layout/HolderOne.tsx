import Link from "next/link";

interface LinkProps{
    link:string;
    title:string;
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
                <div className="text-md md:text-[15px] font-semibold w-full md:w-[20%] flex items-center justify-center md:justify-start md:px-2">                    
                    <p className="capitalize">
                    {title}
                    </p>
                    
                </div>

                <div className="flex items-center justify-center w-full md:w-[25%] text-sm">
                    <p className="capitalize text-center">{showingText}</p>
                </div>

                <div className="flex flex-col py-1 md:flex-row items-center md:justify-end w-full md:w-[55%]">
                    {linkItems.map((item:LinkProps, index:number)=>{

                        return (

                            <Link
                                key={index}
                                href={item.link}
                                className={`text-sm capitalize group gap-1 relative flex items-center md:gap-2 rounded-sm md:py-2 px-3 font-semibold duration-300 ease-in-out`}
                            >                        
                                <p className="font-semibold capitalize">
                                    {item.title}
                                </p>
                            </Link>
                            
                        )
                    })}
                    
                </div>

            </div>

        </div>
    )



}

export default HolderOne;
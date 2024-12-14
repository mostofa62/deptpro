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
            <div className="flex flex-row h-[50px] px-2">
                <div className="text-[15px] font-semibold w-[20%] flex items-center justify-start px-2">                    
                    <p className="capitalize">
                    {title}
                    </p>
                    
                </div>

                <div className="flex items-center justify-center w-[25%] text-sm">
                    <p className="capitalize text-center">{showingText}</p>
                </div>

                <div className="flex flex-row items-center justify-end w-[55%] gap-1">
                    {linkItems.map((item:LinkProps, index:number)=>{

                        return (

                            <Link
                                key={index}
                                href={item.link}
                                className={`text-sm capitalize group relative flex items-center gap-2 rounded-sm py-2 px-3 font-semibold duration-300 ease-in-out`}
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
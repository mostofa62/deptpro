import { useMediaQuery } from "react-responsive";

const InfoBox: React.FC<{ icon?: React.FC<{ width:number; height:number; className: string }>; title: string; value: string | number; isCurrency?: boolean; iconWidth?: number;
  iconHeight?: number;
  iconClassName?: string; }> = ({
    icon: Icon,
    title,
    value,
    isCurrency = false,
    iconWidth = 40,
    iconHeight = 40,
    iconClassName = 'text-white',
  }) => {

    const isMobile = useMediaQuery({ maxWidth: 768 });
    
    return(
    <div className="flex items-center space-x-4">
      {!isMobile && <>
      {Icon ? (
        <Icon width={iconWidth} height={iconHeight} className={iconClassName} />
      ) : (
        <div style={{ width: iconWidth, height: iconHeight }}></div>
      )} 
      </>}
      <div className="flex flex-col md:space-x-2 md:gap-1">
        <span className="text-[14px] text-white lg:text-[16px] font-semibold">{title}</span>
        <span className="text-[17px] text-[#C1FF72] lg:text-[25px] font-bold">
          {isCurrency && '$'}
          {value}
        </span>
      </div>
    </div>
  )
}

export default InfoBox;
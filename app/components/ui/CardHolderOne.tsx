import {ReactNode} from 'react';
import './CardHolder.css';

interface CardHolderType{

  title:string; 
  children: ReactNode;
  maxHeight?:number; 
}

const CardHolderOne = ({title, children, maxHeight}:CardHolderType)=>{


return(    
<div className="card-holder md:flex-grow" style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
  <div className="py-2 text-center font-semibold md:header-blank capitalize">{title}</div>
  <div className="md:body md:h-full">
    {children}
  </div>
</div>
);

}
export default CardHolderOne;
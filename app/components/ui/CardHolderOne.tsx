import {ReactNode} from 'react';
import './CardHolder.css';

interface CardHolderType{

  title:string; 
  children: ReactNode;
  maxHeight?:number; 
}

const CardHolderOne = ({title, children, maxHeight}:CardHolderType)=>{


return(    
<div className="card-holder flex-grow" style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
  <div className="header-blank capitalize">{title}</div>
  <div className="body h-full">
    {children}
  </div>
</div>
);

}
export default CardHolderOne;
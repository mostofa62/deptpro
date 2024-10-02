import {ReactNode} from 'react';
import './CardHolder.css';

interface CardHolderType{

  title:string; 
  children: ReactNode;
  maxHeight?:number; 
}

const CardHolder = ({title, children, maxHeight}:CardHolderType)=>{


return(    
<div className="card-holder flex-grow" style={{ height: maxHeight ? `${maxHeight}px` : 'auto' }}>
  <div className="header capitalize">{title}</div>
  <div className="body h-full">
    {children}
  </div>
</div>
);

}
export default CardHolder;
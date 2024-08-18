import {ReactNode} from 'react';
import './CardHolder.css';

interface CardHolderType{

  title:string; 
  children: ReactNode; 
}

const CardHolder = ({title, children}:CardHolderType)=>{


return(    
<div className="card-holder flex-grow">
  <div className="header">{title}</div>
  <div className="body h-full">
    {children}
  </div>
</div>
);

}
export default CardHolder;
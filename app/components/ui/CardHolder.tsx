import {ReactNode} from 'react';
import './CardHolder.css';

interface CardHolderType{

  title:string; 
  children: ReactNode; 
}

const CardHolder = ({title, children}:CardHolderType)=>{


return(    
<div className="card-holder">
  <div className="header">{title}</div>
  <div className="body">
    {children}
  </div>
</div>
);

}
export default CardHolder;
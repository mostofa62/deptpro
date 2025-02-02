interface DataProps{
    total_paid:string;
    total_interest:string;
    paid_off:string;
    max_months_to_payoff:number;
}

const DataLabel = {
    total_paid:'total paid',
    total_interest:'total interest',
    paid_off:'paid off',
    max_months_to_payoff:'months to payoff'
}

const Summary = (props:DataProps)=>{


    return(

        <div className="bg-white p-4 rounded shadow">
            <div  className="grid grid-cols-2 lmd:grid-cols-1 gap-2">

            {Object.keys(DataLabel).map((key, index) => {

                const propKey = key as keyof DataProps;

                return(
                <div key={index} className="flex flex-col gap-1">
                    <p className="uppercase text-sm font-medium text-[#a19e9e]">
                        {DataLabel[key as keyof typeof DataLabel]}
                    </p>
                    <p className=" uppercase text-base font-semibold">
                        {props[propKey]}
                    </p>
                </div>
                )
                    

                
            })}
           </div>

        </div>
    )
}

export default Summary;
import {useState, useEffect, useMemo} from 'react';
const SnowballListComponent = ()=>{    
    const d:any = {}
    const [snowballInfo, setSnowballInfo] = useState(d)

    useEffect(()=>{

        if(typeof window!='undefined'){
            let snowball:any = localStorage.getItem('snowball');
            if(snowball!=null){
                snowball = JSON.parse(snowball)
                setSnowballInfo(snowball.eligibility_timeselection);
            }
        }

    },[])
    return(
        <div className='flex justify-center'>
            {Object.keys(snowballInfo).length > 1 &&
            <table className="table-auto border-collapse border border-slate-400">
                <tr>
                    <th colSpan={3}>
                    আগে  নেয়া তথ্য সমূহ
                    </th>
                </tr>
            <tr>
                      <th>Name</th>
                      <th>District</th>
                      <th>Urban or Rural</th>                                           
                    </tr>
            <tr className="bg-[#FF0033] text-white">
                <td>{snowballInfo?.name_of_person?.text}</td>
                <td>{snowballInfo?.district?.label}</td>
                <td>{snowballInfo?.city_or_village?.label}</td>
            </tr>
            </table>
}
            
        </div>
    )

}

export default SnowballListComponent;
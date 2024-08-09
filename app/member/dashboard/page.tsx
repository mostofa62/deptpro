"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import {useEffect} from 'react';
import useAuth from '@/app/hooks/useAuth';
import CardHolder from "@/app/components/ui/CardHolder";
import DataProgress from "@/app/components/ui/DataProgress";
import Pie from "@/app/components/chart/Pie";

import dynamic from "next/dynamic";

const debt_payoff_progress = [
{
  title:'Visa',  
  progress:'60.2',
  amount:'10,753.74',
  color:'#FF0000'
}
,
{
  title:'Mortage',  
  progress:'30.5',
  amount:'137,092.83',
  color:'#37b75b'
}

]


const saving_progress = [
  {
    title:'Financial Freedom Saving',  
    progress:'20.2',
    amount:'1000,353.74',
    color:'#FF0000'
  }
  ,
  {
    title:'52 Weeks Savings',  
    progress:'50.5',
    amount:'137,092.83',
    color:'#37b75b'
  }
  
  ]


const GaugeComponentF = dynamic(() => import('@/app/components/chart/Gauge'), { ssr: false });

const GaugeData  = [
  {
  name:'Ideal',
  range:'0-30',
  color:'#009900'
  },
  {
    name:'Moderate',
    range:'50-70',
    color:'#ff9900'
  },
  {
    name:'High',
    range:'70-100',
    color:'#EA4228'
  },
];

//const ThermoMeterF = dynamic(()=>import('../components/chart/Thermometer'),{ssr:false});

//const ThermoMeterF = dynamic(() => import('../components/chart/ThermoMeter'), { ssr: false });
export default function DashBoard() {
  const authCtx = useAuth();


  //Pusher.logToConsole = true;


  

  

  
  
  

    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">

          <div className="mt-2">
          <CardHolder title="Debt Payoff Progress">
            { debt_payoff_progress.map((dp)=>{

              return (
                <>
                <DataProgress 
                title={dp.title} 
                progress={dp.progress}
                color={dp.color}
                amount={dp.amount}
                />
                </>
              )

            })


            }

          </CardHolder>
          </div>



          <div className="mt-3">
          <CardHolder title="Saving Progress">
            { saving_progress.map((dp)=>{

              return (
                <>
                <DataProgress 
                title={dp.title} 
                progress={dp.progress}
                color={dp.color}
                amount={dp.amount}
                />
                </>
              )

            })


            }

          </CardHolder>
          </div>

          <div className="mt-4">
          <div className="grid grid-cols-2 gap-1">
            <div>
            <CardHolder title="Total Allocation">
              <Pie/>
            </CardHolder>
              
            </div>
            <div>
              <CardHolder title="Credit Utilization">
                <div className="grid grid-cols-2">                  
                  <div className="w-[100%] h-[100%]"><GaugeComponentF/></div>
                  <div className="w-[100%] ml-3">
                  <div className="grid grid-flow-row mt-2 ml-3">
                    { GaugeData.map((gdata,i)=>{
                      return(

                        
                        <div key={i} className={`bg-[${gdata.color}] text-white mt-[3px] text-center`}>
                          <span>{gdata.name}</span>
                          <span className="ml-[5px]">{gdata.range}</span>
                        </div>
                      

                      )
                    })}
                    
                    </div>
                  
                  </div>
                </div>


              </CardHolder>
              <div>
                
              </div>
            </div>            

          </div>
          </div>

        </div>
        
        </DefaultLayout>
        </>

    )
}
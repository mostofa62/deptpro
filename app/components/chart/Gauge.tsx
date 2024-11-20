import dynamic from "next/dynamic";

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface GaugeProps{
  direction_value:number;
  tick_values?:[
    {value:number}
  ],
}

const Gauge = ({direction_value,tick_values}:GaugeProps)=>{

 
  return (

    <div>
    <style>
      {`
        .gauge-component-arc-tooltip {
          z-index: 9999 !important;
          position: absolute;
        }
      `}
    </style>
    
  <GaugeComponent
  type="semicircle"
  arc={{
    width: 0.2,
    padding: 0.005,
    cornerRadius: 1,
    // gradient: true,
    subArcs: [
      {
        limit: 30,
        color: '#009900',
        showTick: true,
        tooltip: {
          text: 'Perfect'
        },
        onClick: () => {
          //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        },
        onMouseMove: () =>{ 
          //console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
        },
        onMouseLeave: () =>{ 
          //console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
        },
      },

      {
        limit: 50,
        color: '#00e64d',
        showTick: true,
        
        tooltip: {
          text: 'Moderate'
        }
          
      },
      {
        limit: 70,
        color: '#ff9900',
        showTick: true,
        tooltip: {
          text: 'High'
        }
      },
      /*
      {
        limit: 28,
        color: '#5BE12C',
        showTick: true,
        tooltip: {
          text: 'OK temperature!'
        }
      },
      {
        limit: 30, color: '#F5CD19', showTick: true,
        tooltip: {
          text: 'High temperature!'
        }
      },
      */
      {
        color: '#EA4228',
        tooltip: {
          text: 'Extreme'
        }
      }
    ]
  }}
  pointer={{
    color: '#345243',
    length: 0.80,
    width: 15,
    // elastic: true,
  }}
  labels={{
    valueLabel: { formatTextValue: value => value + 'ºC', hide:true },
    tickLabels: {
      type: 'outer',
      //valueConfig: { formatTextValue: (value:any) => value + 'ºC', fontSize: 10 },
      ticks:tick_values ? tick_values:[] /*[
        { value: 13 },
        { value: 61.5 },
        //{ value: 32 }
      ],*/

    }
  }}
  value={direction_value}
  minValue={0}
  maxValue={100}
  
/>
</div>
 
)
}

export default Gauge;
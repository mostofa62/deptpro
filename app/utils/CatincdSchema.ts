import { object, array, string, number, StringSchema } from "yup";
    export default object().shape({
    introduction_permission:object().shape({
interviewer_permission:object().shape({
  value: string().required(),
  label: string().required('Interview Permission is required!')
}),
denied_reason:array().when('interviewer_permission',{
  is: (val:any)=>val && parseInt(val.value) == 3 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Denied Reason Required!!").of( 
        
              object().shape({
                value: string().required("Denied Reason is required"),
                label: string().required("Denied Reason is required")
              })
    
            )

  }
}),

        }),
        eligibility_timeselection:object().shape({
gender:object().shape({
  value: string(),
  label: string()
}).when('$interviewer_permission',{
  is: (val:any)=>val && (parseInt(val.value) < 3 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Gender is required!'),
            label: string().required('Gender is required!')
      });            
  }
  
}),
age:object().shape({
  value: string(),
  label: string()
}).when('gender',{
  is: (val:any)=>val && parseInt(val.value) > 0,
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Age is required!'),
            label: string().required('Age is required!')
      });            
  }
}),
city_or_village:object().shape({
  value: string(),
  label: string()
}).when('age',{
  is: (val:any)=>val && (parseInt(val.value) >= 18 && parseInt(val.value) <= 150),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('City Or Village is required!'),
            label: string().required('City Or Village is required!')
      });            
  }
})
,
district:object().shape({
  value: string(),
  label: string()
}).when('city_or_village',{
  is: (val:any)=>val && parseInt(val.value) <= 3,
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('District is required!'),
            label: string().required('District is required!')
      });            
  }
})
,
education:object().shape({
  value: string(),
  label: string()
}).when('city_or_village',{
  is: (val:any)=>val && parseInt(val.value) <= 3,
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Education is required!'),
            label: string().required('Education is required!')
      });            
  }
})
,

        }),
        demographic_information:object().shape({
religion:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education','$boundary_reached' ],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Religion is required!'),
            label: string().required('Religion is required!')
      });            
  }
  
}),
marital_status:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Marital status is required!'),
            label: string().required('Marital status is required!')
      });            
  }
  
}),
occupation:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Occupation is required!'),
            label: string().required('Occupation is required!')
      });            
  }
  
}),
current_location:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Current Location is required!'),
            label: string().required('Current Location is required!')
      });            
  }
  
}),
man_women_count:object().shape({
  man: number(),
  women: number()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            man: number().min(0,'at least input 0').max(50,'max 50 allowed').required('Man is required!'),
            women: number().min(0,'at least input 0').max(50,'max 50 allowed').required('Women is required!')
      });            
  }
  
}),
have_electricity:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Electricity is required!'),
            label: string().required('Electricity is required!')
      });            
  }
  
}),
have_flash_toilet:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Flash Toilet is required!'),
            label: string().required('Flash Toilet is required!')
      });            
  }
  
}),
have_landline_phone:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Landline Phone is required!'),
            label: string().required('Landline Phone is required!')
      });            
  }
  
}),
have_mobile_phone:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Mobile Phone is required!'),
            label: string().required('Mobile Phone is required!')
      });            
  }
  
}),
have_television:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Television is required!'),
            label: string().required('Television is required!')
      });            
  }
  
}),
have_refrigerator:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Refrigerator is required!'),
            label: string().required('Refrigerator is required!')
      });            
  }
  
}),
have_washing_machine:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Washing Machine is required!'),
            label: string().required('Washing Machine is required!')
      });            
  }
  
}),
have_computer_or_laptop:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Computer or Laptop is required!'),
            label: string().required('Computer or Laptop is required!')
      });            
  }
  
}),
have_bycycle:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Bycycle is required!'),
            label: string().required('Bycycle is required!')
      });            
  }
  
}),
have_rickshaw:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Rickshaw is required!'),
            label: string().required('Rickshaw is required!')
      });            
  }
  
}),
have_private_car:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Private Car is required!'),
            label: string().required('Private Car is required!')
      });            
  }
  
}),
have_moped_scooter_bike_autorickhshaw:object().shape({
  value: string(),
  label: string()
}).when('religion',{
  is: (val:any)=>val  && typeof val.value != 'undefined' && val.value != '',
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Moped Scooter Bike Autorichshaw is required!'),
            label: string().required('Moped Scooter Bike Autorichshaw is required!')
      });            
  }
  
}),

        }),
        food_habits:object().shape({
fruits_consumption:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education','$boundary_reached' ],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Fruit Consumption is required!'),
            label: string().required('Fruit Consumption is required!')
      });            
  }
  
}),
fruits_consumption_quantity:object().shape({
  value: string(),
  label: string()
}).when('fruits_consumption',{
  is: (val:any)=>val && (parseInt(val.value) > 0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('কাপ is required!'),
            label: string().required('কাপ is required!')
      });          
  }
  
}),
vegatables_consumption:object().shape({
  value: string(),
  label: string()
}).when('fruits_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Vegatables Consumption is required!'),
            label: string().required('Vegatables Consumption is required!')
      });            
  }
  
}),
vegatables_consumption_amount:object().shape({
  salad: number(),
  cooked_vegatables: number(),
  total:number(),
}).when('vegatables_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >0 ),
  then: (schema:any) =>{
           return schema.shape({
            salad: number().typeError('Amount must be a number').min(0,'at least input 0').max(50,'max 50 allowed').required('সালাদ is required!'),
            cooked_vegatables: number().typeError('Amount must be a number').min(0,'at least input 0').max(50,'max 50 allowed').required('রান্না করা শাঁক-সব্জি is required!')
      });            
  }
  
}),
salt_consumption:object().shape({
  value: string(),
  label: string()
}).when('vegatables_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >=0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Salt Consumption is required!'),
            label: string().required('Salt Consumption is required!')
      });            
  }
  
}),
salt_consumption_extra:object().shape({
  value: string(),
  label: string()
}).when('vegatables_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >=0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Salt Consumption Extra is required!'),
            label: string().required('Salt Consumption Extra is required!')
      });            
  }
  
}),
salt_consumption_mixed:object().shape({
  value: string(),
  label: string()
}).when('vegatables_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >=0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Salt Consumption Mixed is required!'),
            label: string().required('Salt Consumption Mixed is required!')
      });            
  }
  
}),
salt_consumption_frequency:object().shape({
  value: string(),
  label: string()
}).when('vegatables_consumption',{
  is: (val:any)=>val && (parseInt(val.value) >=0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Salt Consumption Frequency is required!'),
            label: string().required('Salt Consumption Frequency is required!')
      });            
  }
  
}),

        }),
        relax_information:object().shape({
relax:object().shape({
  hour: number(),
  minute: number()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education' ,'$boundary_reached'],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            hour: number().min(0,'at least 0 input').max(24,'max 24 allowed').required('Hour is required!'),
            minute: number().min(0, 'at least 0 input').max(60,'max 60 allowed').required('Minute is required!')
      });            
  }
  
}),

        }),
        physical_status:object().shape({
blood_pressure_measured:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education' ,'$boundary_reached'],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Blood Pressure Measured is required!'),
            label: string().required('Blood Pressure Measured is required!')
      });            
  }
  
}),
blood_pressure_medicare_location:array().when('blood_pressure_measured',{
  is: (val:any)=>val && parseInt(val.value) > 0 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Blood Pressure Medicare Location Required!!").of( 
        
              object().shape({
                value: string().required("Blood Pressure Medicare Location is required"),
                label: string().required("Blood Pressure Medicare Location is required")
              })
    
            )

  }
}),
blood_pressure_notify:object().shape({
  value: string(),
  label: string()
}).when('blood_pressure_measured',{
  is: (val:any)=>val && (parseInt(val.value) > 0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Blood Pressure Notify is required!'),
            label: string().required('Blood Pressure Notify is required!')
      });            
  }
  
}),
blood_pressure_medicare_taken:object().shape({
  value: string(),
  label: string()
}).when('blood_pressure_notify',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Blood Pressure Medicine Taken is required!'),
            label: string().required('Blood Pressure Medicine Taken is required!')
      });            
  }
  
}),
blood_sugar_diabetics_measured:object().shape({
  value: string(),
  label: string()
}).when('blood_pressure_measured',{
  is: (val:any)=>val && (parseInt(val.value) > 0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Blood Sugar Or Diabetics Measured is required!'),
            label: string().required('Blood Sugar Or Diabetics Measured is required!')
      });            
  }
  
}),
diabetic_medicare_location:array().when('blood_sugar_diabetics_measured',{
  is: (val:any)=>val && parseInt(val.value) > 0 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Diabetics Medicare Location Required!!").of( 
        
              object().shape({
                value: string().required("Diabetics Medicare Location is required"),
                label: string().required("Diabetics Medicare Location is required")
              })
    
            )

  }
}),
blood_sugar_diabetics_notify:object().shape({
  value: string(),
  label: string()
}).when('blood_sugar_diabetics_measured',{
  is: (val:any)=>val && (parseInt(val.value) > 0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Blood Sugar Or Diabetics Notify is required!'),
            label: string().required('Blood Sugar Or Diabetics Notify is required!')
      });            
  }
  
}),
diabetic_medicine_taken:object().shape({
  value: string(),
  label: string()
}).when('blood_sugar_diabetics_notify',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Diabetics Medicine Taken is required!'),
            label: string().required('Diabetics Medicine Taken is required!')
      });            
  }
  
}),

        }),
        smoking_related:object().shape({
smoking_habit:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education', '$boundary_reached' ],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Smoking Habit is required!'),
            label: string().required('Smoking Habit is required!')
      });            
  }
  
}),
smoking_habit_reguler:object().shape({
  value: string(),
  label: string()
}).when('smoking_habit',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Smoking Habit Reguler is required!'),
            label: string().required('Smoking Habit Reguler is required!')
      });            
  }
  
}),
non_smoking_habit:object().shape({
  value: string(),
  label: string()
}).when('smoking_habit',{
  is: (val:any)=>val && (parseInt(val.value) > 0 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Non Smoking Habit is required!'),
            label: string().required('Non Smoking Habit is required!')
      });            
  }
  
}),
non_smoking_habit_reguler:object().shape({
  value: string(),
  label: string()
}).when('non_smoking_habit',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Non Smoking Habit Reguler is required!'),
            label: string().required('Non Smoking Habit Reguler is required!')
      });            
  }
  
}),

        }),
        drinking_related:object().shape({
alchohol_usage:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$age', '$city_or_village', '$district', '$education','$boundary_reached' ],{
  is: (i_p:any,age:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (age && (age.value > 17 && age.value < 101) && (c_o_v.value < 88 ) && (d.value !='') && (e.value < 99) && (boundary_reached == null) );
        return check
},  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Alchohol Usage is required!'),
            label: string().required('Alchohol Usage is required!')
      });            
  }
  
}),

        }),
        
    });
    
import { object, array, string, number, StringSchema } from "yup";
    export default object().shape({
    introduction_permission:object().shape({
interviewer_permission:object().shape({
  value: string().required(),
  label: string().required('Interview Permission is required!')
}),
denied_reason:array().when('interviewer_permission',{
  is: (val:any)=>val && parseInt(val.value) > 1 ,
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
age:object().shape({
  value: string(),
  label: string()
}).when('$interviewer_permission',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Age is required!'),
            label: string().required('Age is required!')
      });            
  }
  
}),
permanent_residency:object().shape({
  value: string(),
  label: string()
}).when('age',{
  is: (val:any)=>val && (parseInt(val.value) >= 18 && parseInt(val.value) <= 150),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Permanent residency is required!'),
            label: string().required('Permanent residency is required!')
      });            
  }
})
,

        }),
        demographic_information:object().shape({
gender:object().shape({
  value: string(),
  label: string()
}).when('$permanent_residency',{
  is: (val:any)=>val && (parseInt(val.value) < 2),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Gender is required!'),
            label: string().required('Gender is required!')
      });            
  }
  
}),
city_or_village:object().shape({
  value: string(),
  label: string()
}).when('gender',{
  is: (val:any)=>val && (parseInt(val.value) >0),
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
religion:object().shape({
  value: string(),
  label: string()
}).when([ '$interviewer_permission', '$permanent_residency', '$city_or_village', '$district', '$education','$boundary_reached' ],{
  is: (i_p:any,p_r:any, c_o_v:any, d:any, e:any, boundary_reached:any)=>{
        const check = (i_p && (parseInt(i_p.value) < 3 )) && (p_r && (p_r.value <2) && (c_o_v.value < 888 ) && (d.value !='') && (e.value < 888) && (boundary_reached == null) );
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

        }),
        treatment_facilities:object().shape({
name_of_facility_provider:object().shape({
  text: string().when(['$permanent_residency','reason'], ([p_r,r], schema:any) =>{
    //console.log('reason',r)
    return (p_r && parseInt(p_r.value) < 2) && (r && r.value == '')?
    schema.string().required('Name of Facility or Provider is required!'):schema;
  }),

  reason: object({
    value:string(),
    label:string()
  }).when(['$permanent_residency','text'], ([p_r,t], schema:any) =>{
    //console.log('text',t)
    return (p_r && parseInt(p_r.value) < 2) && (typeof t == 'undefined')?
    schema.shape({
      value:string().required('Name of Facility or Provider is required!'),
      label:string().required('Name of Facility or Provider is required!')
    }):schema
  }
  ),

},[['text','reason']]),
treatment_location_person_type:array().when('name_of_facility_provider',{
  is: (val:any)=>val && typeof val.text != 'undefined' && val.text != ' ' ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Treatment Location or Person Type Required!!").of( 
        
              object().shape({
                value: string().required("Treatment Location or Person Type is required"),
                label: string().required("Treatment Location or Person Type is required")
              })
    
            )

  }
}),

        }),
        treatment_facilities_last:object().shape({
treatment_location_last_year:object().shape({
  value: string(),
  label: string()
}).when('$permanent_residency',{
  is: (val:any)=>val && (parseInt(val.value) < 2),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Treatment Location Last Year is required!'),
            label: string().required('Treatment Location Last Year is required!')
      });            
  }
  
}),
treatment_for_disease:object().shape({
  text: string().when(['$treatment_location_last_year','reason'], ([p_r,r], schema:any) =>{
    console.log('reason',r)
    return (p_r && parseInt(p_r.value) < 2) && (r && r.value == '')?
    schema.string().required('Treatment for Disease is required!'):schema;
  }),

  reason: object({
    value:string(),
    label:string()
  }).when(['$treatment_location_last_year','text'], ([p_r,t], schema:any) =>{
    console.log('text',t)
    return (p_r && parseInt(p_r.value) < 2) && (typeof t == 'undefined')?
    schema.shape({
      value:string().required('Treatment for Disease is required!'),
      label:string().required('Treatment for Disease is required!')
    }):schema
  }
  ),

},[['text','reason']]),
treatment_location_type:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Treatment Location Type is required!'),
            label: string().required('Treatment Location Type is required!')
      });            
  }
  
}),
treatment_advice_understandable:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Treatment Advice Understandable is required!'),
            label: string().required('Treatment Advice Understandable is required!')
      });            
  }
  
}),
problem_explained_openly:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Problem Explained Openly is required!'),
            label: string().required('Problem Explained Openly is required!')
      });            
  }
  
}),
doctor_discussed_on_treatment:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Doctor Discussed On Treatment is required!'),
            label: string().required('Doctor Discussed On Treatment is required!')
      });            
  }
  
}),
confidence_on_doctor_location:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Cofidence On Doctor or Location is required!'),
            label: string().required('Cofidence On Doctor or Location is required!')
      });            
  }
  
}),
advice_time_person:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Advice Time Person is required!'),
            label: string().required('Advice Time Person is required!')
      });            
  }
  
}),
advice_time_person_details:object().shape({
  text: string().when(['$advice_time_person','reason'], ([p_r,r], schema:any) =>{
    console.log('reason',r)
    return (p_r && parseInt(p_r.value) < 2) && (r && r.value == '')?
    schema.string().required('Advice Time Person Details is required!'):schema;
  }),

  reason: object({
    value:string(),
    label:string()
  }).when(['$advice_time_person','text'], ([p_r,t], schema:any) =>{
    console.log('text',t)
    return (p_r && parseInt(p_r.value) < 2) && (typeof t == 'undefined')?
    schema.shape({
      value:string().required('Advice Time Person Details is required!'),
      label:string().required('Advice Time Person Details is required!')
    }):schema
  }
  ),

},[['text','reason']]),
waiting_time_meet_doctor:object().shape({
  hour: number(),
  minute: number()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
      then: (schema:any) =>{
           return schema.shape({
            hour: number().min(0,'at least 0 input').max(24,'max 24 allowed').required('Hour is required!'),
            minute: number().min(0, 'at least 0 input').max(60,'max 60 allowed').required('Minute is required!')
      });            
  }
  
}),
satisfied_for_waiting:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Satisfied For Waiting is required!'),
            label: string().required('Satisfied For Waiting is required!')
      });            
  }
  
}),
doctor_advice_duration:object().shape({
  minute: number()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
      then: (schema:any) =>{
           return schema.shape({            
            minute: number().min(0, 'at least 0 input').max(200,'max 200 allowed').required('Minute is required!')
      });            
  }
  
}),
satisfied_for_advice_duration:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Satisfied For Advice Duration is required!'),
            label: string().required('Satisfied For Advice Duration is required!')
      });            
  }
  
}),
refer_to_other_treatment_location:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Refer To Other Treatment Location is required!'),
            label: string().required('Refer To Other Treatment Location is required!')
      });            
  }
  
}),
reference_explained:object().shape({
  value: string(),
  label: string()
}).when('refer_to_other_treatment_location',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Reference Explained is required!'),
            label: string().required('Reference Explained is required!')
      });            
  }
  
}),
other_treatment_location_visited:object().shape({
  value: string(),
  label: string()
}).when('reference_explained',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Other Treatment Location Visited is required!'),
            label: string().required('Other Treatment Location Visited is required!')
      });            
  }
  
}),
not_visiting_reason:array().when('other_treatment_location_visited',{
  is: (val:any)=>val && parseInt(val.value) == 2 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of No Visiting Reason Required!!").of( 
        
              object().shape({
                value: string().required("No Visiting Reason is required"),
                label: string().required("No Visiting Reason is required")
              })
    
            )

  }
})
,
happy_quality_service:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Happy With Quality Of Service is required!'),
            label: string().required('Happy With Quality Of Service is required!')
      });            
  }
  
}),
previous_negative_reason:array().when('happy_quality_service',{
  is: (val:any)=>val && ( (parseInt(val.value) == 3 ) || (parseInt(val.value) ==4 ) ),
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Previous Negative Reason Required!!").of( 
        
              object().shape({
                value: string().required("Previous Negative Reason is required"),
                label: string().required("Previous Negative Reason is required")
              })
    
            )

  }
}),
possibility_refer_relatives:object().shape({
  value: string(),
  label: string()
}).when('treatment_location_last_year',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Possibility Refer Relatives is required!'),
            label: string().required('Possibility Refer Relatives is required!')
      });            
  }
  
}),

        }),
        treatment_facilities_not:object().shape({
treatment_required_not_taken:object().shape({
  value: string(),
  label: string()
}).when('$permanent_residency',{
  is: (val:any)=>val && (parseInt(val.value) < 2),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Treatment Required Not Taken is required!'),
            label: string().required('Treatment Required Not Taken is required!')
      });            
  }
  
}),
treatment_not_taken_reason:array().when('treatment_required_not_taken',{
  is: (val:any)=>val && parseInt(val.value) < 2 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Treatment Not Taken Reason Required!!").of( 
        
              object().shape({
                value: string().required("Treatment Not Taken Reason is required"),
                label: string().required("Treatment Not Taken Reason is required")
              })
    
            )

  }
}),
treatment_not_found:object().shape({
  value: string(),
  label: string()
}).when('treatment_required_not_taken',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Treatment Not Found is required!'),
            label: string().required('Treatment Not Found is required!')
      });            
  }
  
}),
type_health_f_phy:array().when('treatment_not_found',{
  is: (val:any)=>val && parseInt(val.value) < 2 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Type of Health facility or Physician Required!!").of( 
        
              object().shape({
                value: string().required("Type of Health facility or Physician is required"),
                label: string().required("Type of Health facility or Physician is required")
              })
    
            )

  }
}),
treatment_not_found_reason:array().when('treatment_not_found',{
  is: (val:any)=>val && parseInt(val.value) < 2 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Treatment Not Found Reason Required!!").of( 
        
              object().shape({
                value: string().required("Treatment Not Found Reason is required"),
                label: string().required("Treatment Not Found Reason is required")
              })
    
            )

  }
}),
doctor_advice_not_maintained:object().shape({
  value: string(),
  label: string()
}).when('treatment_required_not_taken',{
  is: (val:any)=>val && (parseInt(val.value) < 2 ),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Doctor Advice Not Maintained  is required!'),
            label: string().required('Doctor Advice Not Maintained  is required!')
      });            
  }
  
}),
medicine_avoid_reason:array().when('doctor_advice_not_maintained',{
  is: (val:any)=>val && parseInt(val.value) < 2 ,
  then: (schema:any) =>{
           

  			return schema.min(1, "Need at least 1 of Medicine Avoid Reason Required!!").of( 
        
              object().shape({
                value: string().required("Medicine Avoid Reason is required"),
                label: string().required("Medicine Avoid Reason is required")
              })
    
            )

  }
}),

        }),
        nearest_treatment_center:object().shape({
confidence_nearest_hospital:object().shape({
  value: string(),
  label: string()
}).when('$permanent_residency',{
  is: (val:any)=>val && (parseInt(val.value) < 2),
  then: (schema:any) =>{
           return schema.shape({
            value: string().required('Cofidence On Nearest Hospital is required!'),
            label: string().required('Cofidence On Nearest Hospital is required!')
      });            
  }
  
}),

        }),
        
    });
    
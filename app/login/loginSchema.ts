import { object, array, string, number, StringSchema } from "yup";

export default object().shape({
    user:object().shape({
            
            /*  
            email: string()
              .ensure()
              .email("Provide a Valid Email address")
              .required("Email is required"),
              */
              email: string().when("isEmail", {
                is: (val:string)=>val && parseInt(val) > 0 ,
                then: (schema) =>{
                  //console.log('coming here')
                  return schema.email("provide a valid email address")
                  .required("email is required")
                },
                otherwise:(schema)=>{
                  //console.log('coming here ..too')
                  return schema.matches(/^[a-z0-9]{2,20}$/,"username can contain only alphanumeric characters, with minimum 2 length and maximum 20 length.")
                  .required("username is required")
                }
                
              }),

              password: string()
              .ensure()
              .required("Password is required")
              
             
})
});

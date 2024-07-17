import { object, array, string, number, StringSchema } from "yup";
import axios from "axios";

const url = process.env.api_url;


export default object().shape({
    user:object().shape({
            name: string()
              .ensure()
              .required("Name is required"),

              username: string()
              .ensure()
              .required("Name is required")
              .matches(/^[a-z0-9]{2,20}$/,"Username can contain only alphanumeric characters, with minimum 2 length and maximum 20 length.")
              .test(
                'username-backend-validation',  // Name
                'Username is already in use',               // Msg
                async (username,context) => {
                  // Res from backend will be flag at res.data.success, true for 
                  // username good, false otherwise
                  //console.log(context);
                  
                  const { data: { success } } = await axios.post(
                    `${url}userbyusername/${context.parent.id}`, 
                    { username: username }
                  );
        
                  return success
                }
              )
              ,

              email: string()
              .ensure()
              .email("Provide a Valid Email address")
              .required("Email is required")
              .test(
                'emal-backend-validation',  // Name
                'Email is already in use',               // Msg
                async (email,context) => {
                  // Res from backend will be flag at res.data.success, true for 
                  // username good, false otherwise
                  //console.log(context);
                  
                  const { data: { success } } = await axios.post(
                    `${url}userbyemail/${context.parent.id}`, 
                    { email: email }
                  );
        
                  return success
                }
              )
              ,

              password: string()
              /*.ensure()*/
              
              .when('$newentry', {
                is: (val:number)=>val && val > 0 ,
                //is :1,
                then: (schema) =>{
                  return schema.required("Password is required")
                }
              }),
              /*
              .when('newentry',(newentry, schema):any=>{
                
                  return  newentry. == 1 ?schema.required("Password is required"):schema;
                
                
              }),
              */
             
})
});

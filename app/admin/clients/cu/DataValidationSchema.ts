import { object, array, string, number, StringSchema } from "yup";
import axios from "axios";
const url = process.env.NEXT_PUBLIC_API_URL;
export const DataSchema = {
  name:'',
  email:'',
  phone:'',
  password:'',

};

export const DataLabel = {
  id:'ID',
  name:'Name',
  email:'Email',
  phone:'Phone',
  password:'Password',
  created_at:'Date added'
}

export const ValidationSchema =  object().shape({
  fetchdata:object().shape({
            
    name: string()
    .max(100,'Max 100 character allowed')
          .ensure()
          .required(`${DataLabel.name} is required`),

    email: string()
    .ensure()
    .max(100,'Max 100 character allowed')
    .email(`Provide a Valid ${DataLabel.email}  address`)
    .required(`${DataLabel.email} is required`)
    .test(
    'emal-backend-validation',  // Name
    `${DataLabel.email} is already in use`,               // Msg
    async (email,context) => {
        // Res from backend will be flag at res.data.success, true for 
        // username good, false otherwise
        console.log(context);
        
        const { data: { success } } = await axios.post(
        typeof context.parent.id !='undefined'?
        `${url}userbyemailpg/${context.parent.id}`:
        `${url}userbyemailpg`
        , 
        { email: email }
        );

        return success
    }
    ),

    phone: string()
    .max(30,'Max 30 character allowed')
    .matches(/[\d+]/,`allowed numbers only`)
          .ensure()
          .required(`${DataLabel.phone} is required`),

    password: string().when('$newentry', {
      is: (val:number)=>val && val > 0 ,
      //is :1,
      then: (schema) =>{
        return schema.max(40,'Max 40 character allowed')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/, 
  `8 characters minimum, including uppercase, lowercase, numbers, and special character required`)
              .ensure()
              .required(`${DataLabel.password} is required`)
      }
    }),
    
              
             
})
});



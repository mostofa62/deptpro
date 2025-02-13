import { object, array, string, number, StringSchema } from "yup";
import axios from "axios";
const url = process.env.api_url;
export const DataSchema = {
    name:'',
    email:'',
    phone:'',
    password:'',
    disclosure:{'label':'','value':''},

};

export const DataLabel = {
    name:'Name',
    email:'Email',
    phone:'Phone',
    password:'Password',
    disclosure:'Privacy Disclosure Statement',
  }

export const disclosureAck ={ 'label':'Yes','value':'yes'}


export const ValidationSchema =  object().shape({
    user:object().shape({

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
            //console.log(context);
            
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

        password: string()
        .max(40,'Max 40 character allowed')
        .matches(/[w+\d+#@]{8}/,`8 characters minimum, upper, lower case, numbers and special
            character required`)
              .ensure()
              .required(`${DataLabel.password} is required`),

        disclosure:object().shape({
            value: string().required(),
            label: string().required(`${DataLabel.disclosure} must checked`)
        }),

    })
});
import { object, array, string, number, StringSchema } from "yup";
    export default object().shape({
    name_of_person:string().ensure().required("name_of_person is required"),
gender:string().ensure().required("Select gender"),
age:number().when('gender',{
    is: (val:string)=>val && parseInt(val) < 2 ,
    then: (schema) =>{
        return  schema.required().positive().integer().moreThan(17)
    }
    
}),
food_choices:array().min(1, "at least 1 of food_choices is required!!").of( 
object().shape({
            value: string().required(),
            label: string().required()
})),
found:array().min(1, "at least 1 of found is required!!").of(string().required()),
fellings:object().shape({
            value: string().required(' required fellings '),
            label: string().required(' required fellings ')
})
,

    });
    
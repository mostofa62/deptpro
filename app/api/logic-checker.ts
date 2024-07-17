import DIS_LOGIC from '@/app/json/disablelogic.json';
import SKIP_LOGIC from '@/app/json/skiplogic.json';
import disablekey from '@/app/json/disablekey.json';

const disable_logic=(name:string,value:any, setFieldValue:any,logic_option:any):any=>{

        const dis_logic_array:any = DIS_LOGIC

        
        if(dis_logic_array.hasOwnProperty(name)){

            var ds_logic_array = dis_logic_array[name];

            for (let i = 0; i < ds_logic_array.length; i++) {
                var element = ds_logic_array[i];
                //console.log(element[logic_option]);
                var first_key = Object.keys(ds_logic_array[i])[0];

                var found_key = logic_option.find((search:string)=>{
                    return search == first_key;
                });
                

                if(found_key == "options_exclude"){
                    
                    var filter_values = element[found_key];
                    var fields = element["fields"];

                    if(typeof value!='undefined' && value.length > 0){

                        //console.log('filter optiosn',filter_values)
                        
                        
                        const filter_array = value.filter((item:any) => !filter_values.includes(parseInt(item.value)));

                        //console.log('filter arr',filter_array)
                        
                        var found:any = filter_array.length < 1 ? true:undefined; 
                        //if(){
                            //console.log(fields);
                        found_disabled(found, fields,setFieldValue, name);
                            //console.log(value,gt_lt);
                        break;
                    }
                    //}                    
                                        
                }
                

                if(found_key == "is"){
                    var not = element[found_key];
                    //console.log(value)
                         
                    var fields = element["fields"];       
                    var found = not.find((search:string)=>{
                        return search == value;
                    });
                    //console.log('found',found)
                    //console.log(found); 
                    if(typeof found =='undefined') continue;
                    found_disabled(found,fields,setFieldValue, name);
                    break;
                }

                if(found_key == "range"){
                    var gt_lt = element[found_key];
                    var fields = element["fields"];
                    if(typeof value!='undefined'){       
                        var found:any = value >= gt_lt[0] && value <=gt_lt[1] ? undefined:true; 
                        //if(){
                            //console.log(fields);
                        found_disabled(found, fields,setFieldValue, name);
                            //console.log(value,gt_lt);
                        break;
                    }
                    //}                    
                                        
                }

                if(found_key == "lt"){
                    var lt = element[found_key];
                    var fields = element["fields"];
                    if(typeof lt == 'string'){
                        lt = parseInt(lt)
                    }
                    //console.log(lt,value)
                    //if(typeof value!='undefined'){
                    var found:any = value < lt?true:undefined;
                    //console.log(found)
                        //if(){
                    found_disabled(found, fields,setFieldValue, name);
                        //}
                    break;
                    //}
                }

                if(found_key == "gt"){
                    var gt = element[found_key];
                    var fields = element["fields"];
                    if(typeof gt == 'string'){
                        gt = parseInt(gt)
                    }
                    
                    //if(typeof value!='undefined'){
                    var found:any = value > gt ? undefined:true;
                        //if(value > gt){
                    found_disabled(found, fields,setFieldValue, name);
                        //}
                    break;
                    //}
                }

            }
            
            
            
            
        }
}

function found_disabled(found:any, fields:any, setFieldValue:any, name:any){
    if( typeof found != 'undefined'){
        
        if(fields == '*'){
            var index = Object.keys(disablekey).indexOf(name);            
            var length = Object.keys(disablekey).length;
            var arr = Object.entries(disablekey).slice(index+1,length)
            //console.log(arr)
            for(const [key, value] of arr){
                setFieldValue(key,value);
            }

        }else{
            
            for(const [key, value] of Object.entries(fields)){
                //console.log(key, value);
                setFieldValue(key,value);
            }
        }
    }
}

function is_logic_template(condition_object:any, value:any){
    var is = condition_object.value;
    
    if(is[0] < 0){                
        return {"redirect":condition_object.route,"focusElement":condition_object.node}
    }
    var found = is.find((search:string)=>{                
                return search == value;
    });
    if(typeof found !='undefined'){                
        return {"redirect":condition_object.route,"focusElement":condition_object.node}                
    }

    return false;
  
}

function multi_is_logic_template(condition_object:any, value:any){
    var multi_is = condition_object.value;

    //alert(typeof value)
    //if(value.length < 1){
    //    return false
    //}
    
    if(multi_is[0] < 0){                
        return {"redirect":condition_object.route,"focusElement":condition_object.node}
    }
    
    const fields = ['value']
    const format_values =  value.map((i:any)=>(<any>Object).fromEntries(fields.map(f=>[f, i[f]])))    
    const values = format_values.map((a:any) => a.value);

    
    let isFound = multi_is.some( (ai:any) => values.includes(ai) );
    //console.log(isFound)
    if(isFound){
      return {"redirect":condition_object.route,"focusElement":condition_object.node}
    }

    return false;
  
}

function lt_logic_template(condition_object:any, value:any){
    var lt = condition_object.value;
    //console.log(lt)
    if(value < lt){
      //console.log(value)
        return {"redirect":condition_object.route,"focusElement":condition_object.node}                
    }

    return false;
  
}

const skip_logic=(name:string,value:any, type:any):any=>{
    const skip_logic_array:any = SKIP_LOGIC
    let redirect_element:any = {"redirect":"","focusElement":""}
    if(skip_logic_array.hasOwnProperty(name)){

        //console.log(sl_logic_array)
        const sl_logic_array = skip_logic_array[name][type];
        for (let i = 0; i < sl_logic_array.length; i++) {          
          
          if(sl_logic_array[i].condition == 'is'){
            const found = is_logic_template(sl_logic_array[i],value)
            //console.log(found)
            if(found){ redirect_element = found }            
          }
          
          if(sl_logic_array[i].condition == 'multi_is'){
            const found =  multi_is_logic_template(sl_logic_array[i],value)
            if(found){ redirect_element = found }
          }
          
          if(sl_logic_array[i].condition == 'lt'){            
            const found = lt_logic_template(sl_logic_array[i],value)
            if(found){ redirect_element = found }
          }
          
        }


    }

    //console.log(redirect_element)
    
    return redirect_element;
}



export {
    disable_logic,
    skip_logic
}
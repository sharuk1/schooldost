const propertyRephrase=(data)=>{
    let responseList=[];
    for(let index in data){
        let response={
            ...data[index],
            ...data[index].customProperties
        }
        delete response['customProperties']
        responseList=[
            ...responseList,
            response
        ]
    }
    
    return responseList
}

const customPropertiesQuery=(data)=>{
    const queryList=data
    const key=Object.keys(queryList);
    let query={}
    for(let index in key){
        query={
                ...query,
                [`customProperties.${key[index]}`]:queryList[key[index]]
        }
    }
    return {
        query,
        status:Object.keys(query).length!==0
    };
}

const queryParser=(field,data)=>{
    const queryList=data
    const key=Object.keys(queryList);
    let query={}
    for(let index in key){
        if(field.includes(key[index])){
            query={
                    ...query,
                    [key[index]]:queryList[key[index]]
            }
        }
        else {
            query={
                ...query,
                [`customProperties.${key[index]}`]:queryList[key[index]]
            }
        }
        
    }
    return {
        query,
        status:Object.keys(query).length!==0
    };
}


const schemaParser=(field,data)=>{
    const queryList=data
    const key=Object.keys(queryList);
    let query={}
    for(let index in key){
        if(field.includes(key[index])){
            query={
                ...query,
                [`customProperties.${key[index]}`]:queryList[key[index]]
            } 
        }
    }
    return query
}


const updateParser=(field,data)=>{
    const {customProperties,initialProperties}=field
    let output={}
    const key=Object.keys(data);
    for(let index in key){
            if(customProperties.includes(key[index])){
                output={
                    ...output,
                    [`customProperties.${key[index]}`]:data[key[index]]
                }
                continue
            }
            if(initialProperties.includes(key[index])){
                output={
                        ...output,
                        [key[index]]:data[key[index]]
                }
            }
    }
    return output
    
}

const updateSchemaParser=(field,data,item,isNested=false)=>{
    const {initialProperties}=field
    let output={}
    const key=Object.keys(data);
    let schemaKey=""
    for(let index in key){
            if(initialProperties.includes(key[index])){
                if(isNested){
                    schemaKey=`${item}.${key[index]}`
                }
                else {
                    schemaKey=`${item}.$.${key[index]}`
                }
                output={
                        ...output,
                        [schemaKey]:data[key[index]]
                }
            }
            
    }
    return output
    
}



const payloadParser=(field,data)=>{
    const queryList=data
    const key=Object.keys(queryList);
    let query={}
    for(let index in key){
        if(field.includes(key[index])){
            query={
                ...query,
                [`customProperties.${key[index]}`]:queryList[key[index]]
            } 
        }
        else {
            query={
                ...query,
                [key[index]]:queryList[key[index]]
            }
        }
    }
    return {
        query,
        status:Object.keys(query).length!==0
    };
}


module.exports={
    propertyRephrase,
    customPropertiesQuery,
    queryParser,
    schemaParser,
    payloadParser,
    updateParser,
    updateSchemaParser
}


 function middleWareRBAC(url){
   return function(req,res,next){
            console.log("middleWareRBAC",url);
            next()
   }    
}

module.exports=middleWareRBAC
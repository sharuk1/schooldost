const redis = require('redis');

const client = redis.createClient();


const connectRediServer=async()=>{
    client.on('error', (err) => console.log('Redis Client Error', err));
    
    client.on("connect",()=>{
        console.log("Redis Server Connected");
    })
    
    await client.connect();
}  
module.exports={
    connectRediServer,
    redisClient:client
}
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_PORT)

redis.ping()
.then(res => console.log('Redis has connected successfully. Response to PING: ',res))
.catch(err => console.log(`couldn't connect to redis due to ${err}`))

module.exports =  redis
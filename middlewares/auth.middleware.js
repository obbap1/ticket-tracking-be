const {V4} = require('paseto')
const k = require('../utils/key')
const {getConnection} = require('typeorm')
const User = require('../entities/user')

async function Verify(req,res,next) {
    try{
        const token = req.headers["token"] || req.body.token
        if(!token){
            return res.status(422).json({messge: 'Invalid request'})
        } 

        const pubKey =  k.keys().publicKey
        const verifiedToken = await V4.verify(token, pubKey)
        if(!verifiedToken) {
            return res.status(422).json({messge: 'Invalid request'})
        }

        res.locals.userID = verifiedToken.sub
        const connection =  getConnection()
        const userRepo = connection.getRepository(User)
        const user = await userRepo.findOne(res.locals.userID)
        if(!user){
            return res.status(422).json({messge: 'Invalid request'})
        }
        res.locals.userType = user.userType
        return next()
    }catch(error){
        return res.status(500).json({messge: 'Invalid request'})
    }
}

module.exports = {
    Verify
}
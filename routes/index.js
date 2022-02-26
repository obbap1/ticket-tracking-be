const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const User = require('../entities/user')
const Ticket = require('../entities/ticket')
const {getConnection} = require('typeorm')
const {V4} = require('paseto')
const cache = require('../utils/redisconfig')
const k = require('../utils/key')

const maximumDescriptionSize = 28
const allowedTicketStates = ['TODO', 'DONE']
const saltValue = 10


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/health', function(req, res, next) {
  return res.status(200).send('OK')
});

router.post('/signup', async function(req, res, next) {
  try{
   const {firstName, lastName, type, email, password} = req.body
   if (!firstName || !lastName || !type || !email || !password) {
     return res.status(422).json({message: 'Incomplete credentials'})
   }
   // hash the password 
   const hashedPassword = await bcrypt.hash(password, saltValue)
   const userData = {
     firstName,
     lastName,
     userType: type,
     email,
     password: hashedPassword
   }
   // store the result in the database 
   const connection = getConnection()
   const userRepo = connection.getRepository(User)
   await userRepo.save(userData)
   // return a valid response
   return res.status(200).json({message: 'signup successful!'})
  }catch(error){
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
});

router.post('/login', async function(req, res, next) {
  try{
    const {email, password} = req.body 
    if (!email || !password) {
      return res.status(422).json({message: 'Incomplete credentials'})
    }

    const connection = getConnection()
    const userRepo = connection.getRepository(User) 
    const user = await userRepo.findOne({email})
    if(!user || !bcrypt.compareSync(password, user.password)){
      return res.status(400).json({message: 'User doesnt exist'})
    }

    const pKey = (await k.keys()).secretKey
    const token = await V4.sign({sub: user.id}, pKey)
    cache.set(user.id, token)

    return res.status(200).json({message: 'Login successful'})

  }catch(error){
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

router.post('/ticket', async function(req, res, next) {
  const {userID, description, assigneeID, status} = req.body
  if (!userID || !description || !assigneeID || !status ) {
    return res.status(422).json({message: 'Incomplete credentials'})
  }
  
  if(description.trim().length > maximumDescriptionSize) {
    return res.status(400).json({message: 'Invalid description'})
  }

  if(!allowedTicketStates.includes(status.toUpperCase())) {
    return res.status(400).json({message: 'Invalid ticket state'})
  }

  const ticketData = {
    userID,
    description,
    assigneeID,
    status
  }

  const connection = getConnection()
  const ticketRepo = connection.getRepository(Ticket)
  ticketRepo.save(ticketData)

  return res.status(200).json({message: 'Ticket created successfully'})
});

// TODO: use the actual database
// edit / delete tickets
// fetch tickets for a user 
// resolve tickets 
// JWT authentication with Redis to complete sign in 
// Email notification for users 





module.exports = router;

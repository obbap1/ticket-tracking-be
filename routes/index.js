const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt')
const User = require('../entities/user')
const Ticket = require('../entities/ticket')
const {getConnection} = require('typeorm')
const {V4} = require('paseto')
const cache = require('../utils/redisconfig')
const k = require('../utils/key')
const AuthMiddleware = require('../middlewares/auth.middleware');
const { query } = require('express');

const maximumDescriptionSize = 280
const allowedTicketStates = ['TODO', 'DONE']
const saltValue = 10


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
}); 

router.post('/health', function(req, res) {
  return res.status(200).send('OK')
});

router.post('/signup', async function(req, res) {
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

router.post('/login', async function(req, res) {
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

    const pKey =  k.keys().secretKey
    const token = await V4.sign({sub: user.id}, pKey)
    await cache.set(user.id, token, "EX", 86400)

    return res.status(200).json({message: 'Login successful', token})

  }catch(error){
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

router.post('/logout',AuthMiddleware.Verify, async function(req, res) {
  try{
    await cache.del(res.locals.userID)
    return res.status(200).json({message: 'Logout successful'})
  }catch(error){
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

router.post('/ticket', AuthMiddleware.Verify, async function(req, res) {
  try{
  const {description, assigneeID, status} = req.body
  if (!description || !assigneeID || !status ) {
    return res.status(422).json({message: 'Incomplete credentials'})
  }
  
  if(description.trim().length > maximumDescriptionSize) {
    return res.status(400).json({message: 'Invalid description'})
  }

  if(!allowedTicketStates.includes(status.toUpperCase())) {
    return res.status(400).json({message: 'Invalid ticket state'})
  }

  if(res.locals.userType !== "customer") {
    return res.status(400).json({message: 'Invalid request'})
  }

  const ticketData = {
    description,
    creatorID: res.locals.userID,
    assigneeID,
    status
  }

  const connection = getConnection()
  const ticketRepo = connection.getRepository(Ticket)
  ticketRepo.save(ticketData)

  return res.status(200).json({message: 'Ticket created successfully'})
  }catch(error) {
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
});

router.get('/ticket', AuthMiddleware.Verify, async function(req, res) {
  try{
  const {ticketID} = req.query
  const connection = getConnection()
  const ticketRepo = connection.getRepository(Ticket)
  const queryObj = {}
  if (res.locals.userType === "customer"){
    queryObj.creatorID = res.locals.userID
  }else if (res.locals.userType === "developer"){
    queryObj.assigneeID = res.locals.userID
  }
  const ticket = ticketID ? await ticketRepo.find({id: ticketID,...queryObj }) : await ticketRepo.find(queryObj)
  if(!ticket.length) {
    return res.status(400).json({message: 'Invalid ticket'})
  }
  return res.status(200).json({message: 'ticket find successful', data: ticket})
  }catch(error) {
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

router.put('/ticket/:ticketID', AuthMiddleware.Verify, async function(req, res) {
  try{
    const {ticketID} = req.params
    if(!ticketID) {
      return res.status(400).json({message: 'Invalid ticket'})
    }
    const {description, assigneeID, status} = req.body
    const queryObj = {}
    if(res.locals.userType === "customer") {
      if(!description && !assigneeID) {
        return res.status(400).json({message: 'Invalid request'})
      }
      if(description) {
        queryObj.description = description
      }
      if(assigneeID) {
        queryObj.assigneeID = assigneeID
      }
      queryObj.creatorID = res.locals.userID
    }else if(res.locals.userType === "developer") {
      if(!status) {
        return res.status(400).json({message: 'Invalid request'})
      }
      queryObj.status = status   
      queryObj.assigneeID = res.locals.userID
    }

    const connection = getConnection()
    const ticketRepo = connection.getRepository(Ticket)
    await ticketRepo.update(ticketID, queryObj)

    return res.status(200).json({message: 'Update successful'})

  }catch(error) {
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

router.delete('/ticket/:ticketID', AuthMiddleware.Verify, async function(req, res) {
  try{
    const {ticketID} = req.params
    if(!ticketID || res.locals.userType !== "customer") {
      return res.status(400).json({message: 'Invalid ticket'})
    }
    const connection = getConnection()
    const ticketRepo = connection.getRepository(Ticket)
    await ticketRepo.delete({id: ticketID, creatorID: res.locals.userID})

    return res.status(200).json({message: 'ticket deleted successfully'})
  }catch(error){
    return res.status(500).json({message: error.message || 'Invalid request'})
  }
})

module.exports = router;

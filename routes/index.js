var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const userDatabase = require('../mocks/user')
const ticketDatabase = require('../mocks/ticket')
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
   const {firstName, lastName, type, email, password} = req.body
   if (!firstName || !lastName || !type || !email || !password) {
     return res.status(422).json({message: 'Incomplete credentials'})
   }
   // hash the password 
   const hashedPassword = await bcrypt.hash(password, saltValue)

   const userData = {
     firstName,
     lastName,
     type,
     email,
     password: hashedPassword
   }
   // store the result in the database 
   // TODO: use actual database 
   userDatabase.push(userData)
   // return a valid response
   return res.status(200).json({message: 'signup successful!'})
});

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

  ticketDatabase.push(ticketData)

  return res.status(200).json({message: 'Ticket created successfully'})
});

// TODO: use the actual database
// edit / delete tickets
// fetch tickets for a user 
// resolve tickets 
// JWT authentication with Redis to complete sign in 
// Email notification for users 





module.exports = router;

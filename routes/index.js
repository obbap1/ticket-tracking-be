var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')

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
   const hashedPassword = await bcrypt.hash(password)

   const userData = {
     firstName,
     lastName,
     type,
     email,
     password: hashedPassword
   }


   // store the result in the database 

   // return a valid response
});



module.exports = router;

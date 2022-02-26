const {createConnection} = require("typeorm")
const config = require("./ormconfig")
let dbConnection

if (!dbConnection) {
  // database connection
  createConnection(config)
  .then(connection => {
     connection.isConnected ? console.log('database has connected successfully') : console.log('failed database connection')
     dbConnection = connection 
  })
  .catch(e => console.log(`failed database connection due to ${e.message}`))
}
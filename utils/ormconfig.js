
const {createConnection} = require('typeorm')
const config = {
  type: 'postgres',
  synchronize: false,
  migrationsRun: true,
  logging: true,
  logger: 'advanced-console',
  host: process.env.DATABASE_URL,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  name: process.env.DATABASE_NAME,
  entities: [require('../entities/ticket'), require('../entities/user')],

  migrations: [
    process.env.DATABASE_MIGRATIONS_FILES || 'migrations/tracker_db/*.js'
  ],
  cli: {
    migrationsDir:
      process.env.DATABASE_MIGRATIONS_DIR || 'migrations/tracker_db'
  }
}

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

module.exports = dbConnection


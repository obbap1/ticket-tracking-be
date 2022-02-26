
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
  // name: process.env.DATABASE_NAME,
  entities: [require('../entities/ticket'), require('../entities/user')],

  migrations: [
    process.env.DATABASE_MIGRATIONS_FILES || 'migrations/tracker_db/*.ts'
  ],
  cli: {
    migrationsDir:
      process.env.DATABASE_MIGRATIONS_DIR || 'migrations/tracker_db'
  }
}

module.exports = config


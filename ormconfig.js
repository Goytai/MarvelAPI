const ssl = process.env.NODE_ENV.trimEnd() === 'production' ? {"rejectUnauthorized": false} : false
const entities = process.env.NODE_ENV.trimEnd() === 'production' ? "./dist/**/entities/*.js" : "./src/**/entities/*.ts"
const migrations = process.env.NODE_ENV.trimEnd() === 'production' ? "./dist/shared/typeorm/migrations/*.js" :"./src/shared/typeorm/migrations/*.ts"
const migrationsDir = process.env.NODE_ENV.trimEnd() === 'production' ? "./dist/shared/typeorm/migrations" : "./src/shared/typeorm/migrations"

module.exports = [
  {
    "name": "test",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "root",
    "password": "root",
    "database": "stone-marvel-test",
    "entities": [
      "./src/**/entities/*.ts"
    ],
    "migrations":  [
      "./src/shared/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/typeorm/migrations"
    }
  },
  {
    "name": "default",
    "type": process.env.DATABASE_TYPE || "postgres",
    "url": process.env.DATABASE_DATABASE,
    "host": process.env.DATABASE_HOST || "localhost",
    "port": process.env.DATABASE_PORT || 5432,
    "username": process.env.DATABASE_USERNAME || "root",
    "password": process.env.DATABASE_PASS || "root",
    "database": process.env.DATABASE_DB || "stone-marvel",
    "ssl": ssl,
    "entities": [
      entities
    ],
    "migrations":  [
      migrations
    ],
    "cli": {
      "migrationsDir": migrationsDir
    }
  }
]

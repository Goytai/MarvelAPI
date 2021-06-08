module.exports = [
  {
    "name": "test",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "root",
    "password": "root",
    "database": "stone-marvel-test",
    "entities": ["./src/**/entities/*.ts"],
    "migrations":  ["./src/shared/typeorm/migrations/*.ts"],
    "cli": {
      "migrationsDir": "./src/shared/typeorm/migrations"
    }
  },
  {
    "name": "default",
    "type": process.env.DATABASE_TYPE || "postgres",
    "host": process.env.DATABASE_URL || "localhost",
    "port": process.env.DATABASE_PORT || 5432,
    "username": process.env.DATABASE_USERNAME || "root",
    "password": process.env.DATABASE_PASS || "root",
    "database": process.env.DATABASE_DATABASE || "stone-marvel",
    "entities": ["./src/**/entities/*.ts"],
    "migrations":  ["./src/shared/typeorm/migrations/*.ts"],
    "cli": {
      "migrationsDir": "./src/shared/typeorm/migrations"
    }
  }
]

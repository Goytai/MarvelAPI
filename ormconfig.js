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
    "type": process.env.DB_TYPE || "postgres",
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 5432,
    "username": process.env.DB_USERNAME || "root",
    "password": process.env.DB_PASS || "root",
    "database": process.env.DB_DATABASE || "stone-marvel",
    "entities": ["./src/**/entities/*.ts"],
    "migrations":  ["./src/shared/typeorm/migrations/*.ts"],
    "cli": {
      "migrationsDir": "./src/shared/typeorm/migrations"
    }
  }
]

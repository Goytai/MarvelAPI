module.exports = {
  "type": process.env.DB_TYPE || "postgres",
  "host": process.env.DB_HOST,
  "port": Number(process.env.DB_HOST),
  "username": process.env.DB_USER,
  "password": process.env.DB_PASS,
  "database": process.env.DB_NAME
}

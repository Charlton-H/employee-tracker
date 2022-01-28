const mysql2 = require("mysql2");
require("dotenv").config();

const db = mysql2.createConnection({
  host: "localhost",
  user: process.env.DB_User,
  password: process.env.DB_PW,
  database: process.env.DB_Name,
});

module.exports = db;

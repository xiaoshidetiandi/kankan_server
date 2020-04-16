const mysql = require("mysql"); //mysql模块
module.exports = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "my_pro",
  port: 3306,
  // host: process.env.MYSQL_HOST,
  // port: process.env.MYSQL_PORT,
  // user: process.env.ACCESSKEY,
  // password: process.env.SECRETKEY,
  // database: "app_" + process.env.APPNAME,
  // connectionLimit: 15,
});

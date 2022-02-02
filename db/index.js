const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findAllDepartments() {
    return this.connection.promise().query("SELECT * FROM departments;");
  }
}

module.exports = new DB(connection);

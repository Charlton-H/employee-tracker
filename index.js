const inquirer = require("inquirer");
const figlet = require("figlet");
const db = require("./db/connection");
const data = require("./db");
const cTable = require("console.table");

const asciiArt = () => {
  let wordArt = ["Employee", "Manager"];
  for (const str of wordArt) {
    console.log(
      figlet.textSync(str, {
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    );
  }
};

const mainMenu = () => {
  const employeePrompt = [
    {
      type: "list",
      name: "employeePrompt",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role & Manager",
        "Delete Employee",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View All Departments",
        "Add Department",
        "Delete Department",
        "Quit",
      ],
    },
  ];
  return inquirer.prompt(employeePrompt).then((selection) => {
    switch (selection.employeePrompt) {
      case "View All Employees":
        viewEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role & Manager":
        updateEmployee();
        break;
      case "Delete Employee":
        deleteEmployee();
        break;
      case "View All Roles":
        viewRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "Delete Role":
        deleteRole();
        break;
      case "View All Departments":
        viewDepartments();
        break;
      case "Add Department":
        addDepartment();
        break;
      case "Delete Department":
        deleteDepartment();
        break;
      case "Quit":
        break;
    }
  });
};

// case "View All Employees":
viewEmployees = () => {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS departments, roles.salary, 
  CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
  FROM employees 
  LEFT JOIN roles on employees.role_id = roles.id 
  LEFT JOIN departments on roles.department_id = departments.id 
  LEFT JOIN employees manager on manager.id = employees.manager_id
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;

    console.table(result);
    mainMenu();
  });
};

// case "Add Employee":
addEmployee = () => {
  const roleSql = `SELECT roles.title, roles.id 
  FROM roles`;

  db.query(roleSql, (err, result) => {
    if (err) throw err;

    const roles = result.map(({ title, id }) => ({
      name: title,
      value: id,
    }));

    const managerSql = `SELECT employees.first_name, employees.last_name, employees.id FROM employees`;

    db.query(managerSql, (err, result) => {
      const managers = result.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
      managers.unshift({ name: "None", value: null });

      const addEmployeePrompt = [
        {
          type: "input",
          name: "employeeFirst",
          message: "What is the employee's first name?",
          validate: (firstName) => {
            if (firstName) {
              return true;
            } else {
              console.log("**FIELD REQUIRED** Please provide a first name.");
              return false;
            }
          },
        },
        {
          type: "input",
          name: "employeeLast",
          message: "What is the employee's last name?",
          validate: (lastName) => {
            if (lastName) {
              return true;
            } else {
              console.log("**FIELD REQUIRED** Please provide a last name.");
              return false;
            }
          },
        },
        {
          type: "list",
          name: "employeeRole",
          message: "What is the employee's role?",
          choices: roles,
        },
        {
          type: "list",
          name: "employeeManager",
          message: `Who is the employee's manager?`,
          choices: managers,
        },
      ];

      return inquirer.prompt(addEmployeePrompt).then((output) => {
        const params = [
          output.employeeFirst,
          output.employeeLast,
          output.employeeRole,
          output.employeeManager,
        ];

        // console.log(params);
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
          VALUES (?,?,?,?)
          `;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
        });

        mainMenu();
      });
    });
  });
};

// case "Update Employee Role/Manager":
updateEmployee = () => {
  const employeeSql = `SELECT employees.* FROM employees`;

  db.query(employeeSql, (err, results) => {
    if (err) throw err;

    const employees = results.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    const roleSql = `SELECT title, id FROM roles`;

    db.query(roleSql, (err, result) => {
      if (err) throw err;

      const roles = result.map(({ title, id }) => ({
        name: title,
        value: id,
      }));

      const updateEmployeePrompt = [
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employees,
        },
        {
          type: "list",
          name: "employeeRole",
          message: "What is the employee's role?",
          choices: roles,
        },
        {
          type: "list",
          name: "employeeManager",
          message: `Who is the employee's manager?`,
          choices: employees,
        },
      ];

      return inquirer.prompt(updateEmployeePrompt).then((output) => {
        const params = [
          output.employeeRole,
          output.employeeManager,
          output.employee,
        ];

        // console.log(params);
        const sql = `UPDATE employees
          SET
            role_id = ?,
            manager_id = ?
          WHERE
            id = ?
          `;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
        });

        mainMenu();
      });
    });
  });
};

deleteEmployee = () => {
  const employeeSql = `SELECT * FROM employees`;

  db.query(employeeSql, (err, result) => {
    if (err) throw err;

    const employees = result.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    const deleteEmployeePrompt = [
      {
        type: "list",
        name: "deleteEmployee",
        message: "What is the name of the employee, you would like to delete?",
        choices: employees,
      },
    ];

    return inquirer.prompt(deleteEmployeePrompt).then((output) => {
      const params = [output.deleteEmployee];
      // console.log(params);
      const sql = `DELETE FROM employees WHERE id = ?`;
      db.query(sql, params, (err, result) => {
        if (err) throw err;
      });
      mainMenu();
    });
  });
};

// case "View All Roles":
viewRoles = () => {
  const sql = `SELECT roles.title, roles.id, roles.salary, departments.name AS department_name
  FROM roles
  LEFT JOIN departments on roles.department_id = departments.id
  `;

  db.query(sql, (err, result) => {
    if (err) throw err;

    console.table(result);
    mainMenu();
  });
};

// case "Add Role":
addRole = () => {
  const departmentSql = `SELECT * FROM departments`;

  db.query(departmentSql, (err, result) => {
    if (err) throw err;

    const departments = result.map(({ name, id }) => ({
      name: name,
      value: id,
    }));

    const addRolePrompt = [
      {
        type: "input",
        name: "roleName",
        message: "What is the name of the role, you would like to create?",
        validate: (roleName) => {
          if (roleName) {
            return true;
          } else {
            console.log("**FIELD REQUIRED** Please provide a role name.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary for this role?",
        validate: (roleSalary) => {
          if (roleSalary) {
            return true;
          } else {
            console.log("**FIELD REQUIRED** Please provide a role salary.");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "roleDepartment",
        message: "What is the department which this role belongs to?",
        choices: departments,
      },
    ];
    return inquirer.prompt(addRolePrompt).then((output) => {
      const params = [
        output.roleName,
        output.roleSalary,
        output.roleDepartment,
      ];

      // console.log(params);
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;

      db.query(sql, params, (err, result) => {
        if (err) throw err;
      });

      mainMenu();
    });
  });
};

// case "Delete Role"
deleteRole = () => {
  const roleSql = `SELECT * FROM roles`;

  db.query(roleSql, (err, result) => {
    if (err) throw err;

    const roles = result.map(({ id, title, salary }) => ({
      name: title + " - " + salary,
      value: id,
    }));

    const deleteRolePrompt = [
      {
        type: "list",
        name: "deleteRole",
        message: "Which role would you like to delete?",
        choices: roles,
      },
    ];

    return inquirer.prompt(deleteRolePrompt).then((output) => {
      const params = [output.deleteRole];
      // console.log(params);
      const sql = `DELETE FROM roles WHERE id = ? `;
      db.query(sql, params, (err, result) => {
        if (err) throw err;
      });
      mainMenu();
    });
  });
};

// case "View All Departments":
viewDepartments = () => {
  // const sql = `SELECT * FROM departments`;
  // db.query(sql, (err, result) => {
  //   if (err) throw err;
  //   console.table(result);
  //   mainMenu();
  // });

  data
    .findAllDepartments()
    // depts is an arrray because SQL returns data in array of objects
    // every row is object
    .then(([depts]) => {
      console.table(depts);
    })
    .then(() => mainMenu());
};

// case "Add Department":
addDepartment = () => {
  const addDepartmentPrompt = [
    {
      type: "input",
      name: "departmentName",
      message: "What is the name of the department you would like to add?",
      validate: (departmentName) => {
        if (departmentName) {
          return true;
        } else {
          console.log("**FIELD REQUIRED** Please provide a department name.");
          return false;
        }
      },
    },
  ];

  return inquirer.prompt(addDepartmentPrompt).then((output) => {
    const params = [output.departmentName];

    const sql = `INSERT INTO departments (name) VALUES (?)`;

    db.query(sql, params, (err, result) => {
      if (err) throw err;
    });

    mainMenu();
  });
};

// case "Delete Department"
deleteDepartment = () => {
  const departmentSql = `SELECT * FROM departments`;

  db.query(departmentSql, (err, result) => {
    if (err) throw err;

    const departments = result.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    const deleteDepartmentPrompt = [
      {
        type: "list",
        name: "deleteDepartment",
        message: "Which role would you like to delete?",
        choices: departments,
      },
    ];

    return inquirer.prompt(deleteDepartmentPrompt).then((output) => {
      const params = [output.deleteDepartment];
      // console.log(params);
      const sql = `DELETE FROM departments WHERE id = ? `;
      db.query(sql, params, (err, result) => {
        if (err) throw err;
      });
      mainMenu();
    });
  });
};

const run = async () => {
  asciiArt();
  const userSelection = await mainMenu(); // await is a promise

  // console.log(db);
};

run();

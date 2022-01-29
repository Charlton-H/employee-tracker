const inquirer = require("inquirer");
const figlet = require("figlet");
const db = require("./db/connection");
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
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    },
  ];
  return inquirer.prompt(employeePrompt).then((selection) => {
    switch (selection.employeePrompt) {
      case "View All Employees":
        allEmployees();
        break;
      case "Add Employee":
        addEmployee();
        break;
      case "Update Employee Role":
        console.log("c");
        break;
      case "View All Roles":
        console.log("d");
        break;
      case "Add Role":
        console.log("e");
        break;
      case "View All Departments":
        console.log("f");
        break;
      case "Add Department":
        console.log("g");
        break;
      case "Quit":
        break;
    }
  });
};

// case "View All Employees":
allEmployees = () => {
  const sql = `SELECT id AS 'Employee ID', first_name AS 'First Name', last_name AS 'Last Name' FROM employees
  `;
  // LEFT JOIN roles ON employees.role_id = roles.id
  // LEFT JOIN departments ON roles.department_id = departments.id

  db.query(sql, (err, results) => {
    console.table(results);
    mainMenu();
  });
};

// case "Add Employee":
addEmployee = () => {
  const sql = `SELECT roles.title, roles.id 
  FROM roles`;

  db.query(sql, (err, data) => {
    if (err) throw err;

    const roles = data.map(({ title, id }) => ({
      name: title,
      value: id,
    }));
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
        type: "input",
        name: "employeeManager",
        message: `Using the table provided above, please enter the employee's manager ID?`,
      },
    ];
    return inquirer.prompt(addEmployeePrompt).then((input) => {
      const params = [
        input.employeeFirst,
        input.employeeLast,
        input.employeeRole,
        input.employeeManager,
      ];

      const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES (?,?,?,?)
        `;

      db.query(sql, (err, result) => {
        if (err) {
          throw err;
        }
      });

      mainMenu();
    });
  });
};

// case "Update Employee Role":

// case "View All Roles":

// case "Add Role":

// case "View All Departments":

// case "Add Department":

const run = async () => {
  asciiArt();
  const userSelection = await mainMenu();

  // console.log(db);
};

run();

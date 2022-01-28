const inquirer = require("inquirer");
const figlet = require("figlet");
const db = require("./db/connection");

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
        return console.log("a");
      case "Add Employee":
        return console.log("b");
      case "Update Employee Role":
        return console.log("c");
      case "View All Roles":
        return console.log("d");
      case "Add Role":
        return console.log("e");
      case "View All Departments":
        return console.log("f");
      case "Add Department":
        return console.log("g");
      case "Quit":
        break;
    }
  });
};

const run = async () => {
  asciiArt();
  // const userSelection = await mainMenu();

  // console.log(db);
};

run();

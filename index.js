const inquirer = require('inquirer');
const db = require('./db');

function displayMainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    })
        .then(answer => {
            if (answer.action === 'View all departments') {
                viewDepartments();
            } else if (answer.action === 'View all roles') {
                viewRoles();
            } else if (answer.action === 'View all employees') {
                viewEmployees();
            } else if (answer.action === 'Add a department') {
                addDepartment();
            } else if (answer.action === 'Add a role') {
                addRole();
            } else if (answer.action === 'Add an employee') {
                addEmployee();
            } else if (answer.action === 'Update an employee role') {
                updateEmployeeRole();
            } else if (answer.action === 'Exit') {
                db.end();
            }
        });
}

function viewDepartments() {
    console.log("Viewing all departments...");
    db.query('SELECT * FROM department')
    .then(result => {
        console.table(result.rows);
        displayMainMenu();
    })
    .catch(err => {
        console.error(err);
        displayMainMenu();
    });
}

function viewRoles() {
    console.log("Viewing all roles...");
    displayMainMenu();
}

function viewEmployees() {
    console.log("Viewing all employees...");
    displayMainMenu();
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
    })
        .then(answer => {
            console.log(`Adding department: ${answer.departmentName}`);
            displayMainMenu();
        });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter the department ID for this role:'
        }
    ])
        .then(answer => {
            console.log(`Adding role: ${answer.roleTitle}`);
            displayMainMenu();
        });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'Enter the role ID for this employee:'
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'Enter the manager ID for this employee (leave blank if none):'
        }
    ])
    .then(answer => {
        console.log(`Adding employee: ${answer.firstName} ${answer.lastName}`);
        displayMainMenu();
    });
}

function updateEmployeeRole() {
    console.log("Updating employee role...");
    displayMainMenu();
}

displayMainMenu();

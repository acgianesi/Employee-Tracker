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
    db.query('SELECT * FROM role')
        .then(result => {
            console.table(result.rows);
            displayMainMenu();
        })
        .catch(err => {
            console.error(err);
            displayMainMenu();
        });
}


function viewEmployees() {
    console.log("Viewing all employees...");
    db.query('SELECT * FROM employee')
        .then(result => {
            console.table(result.rows);
            displayMainMenu();
        })
        .catch(err => {
            console.error(err);
            displayMainMenu();
        });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
    })
        .then(answer => {
            console.log(`Adding department: ${answer.departmentName}`);
            db.query('INSERT INTO department (name) VALUES ($1)', [answer.departmentName])
                .then(() => {
                    console.log(`Department ${answer.departmentName} added!`);
                    displayMainMenu();
                })
                .catch(err => {
                    console.error(err);
                    displayMainMenu();
                });
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
            db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
                [answer.roleTitle, answer.roleSalary, answer.departmentId])
                .then(() => {
                    console.log(`Role ${answer.roleTitle} added!`);
                    displayMainMenu();
                })
                .catch(err => {
                    console.error(err);
                    displayMainMenu();
                });
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
            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                [answer.firstName, answer.lastName, answer.roleId, answer.managerId || null])
                .then(() => {
                    console.log(`Employee ${answer.firstName} ${answer.lastName} added!`);
                    displayMainMenu();
                })
                .catch(err => {
                    console.error(err);
                    displayMainMenu();
                });
        });
}

function updateEmployeeRole() {
    db.query('SELECT * FROM employee')
        .then(result => {
            const employees = result.rows;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select an employee to update their role:',
                    choices: employees.map(emp => `${emp.first_name} ${emp.last_name} (ID: ${emp.id})`)
                },
                {
                    type: 'input',
                    name: 'newRoleId',
                    message: 'Enter the new role ID for this employee:'
                }
            ])
            .then(answer => {
                const employeeId = employees.find(emp => `${emp.first_name} ${emp.last_name} (ID: ${emp.id})` === answer.employee).id;
                const newRoleId = answer.newRoleId;
                db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId])
                    .then(() => {
                        console.log(`Employee's role updated successfully!`);
                        displayMainMenu();
                    })
                    .catch(err => {
                        console.error(err);
                        displayMainMenu();
                    });
            });
        })
        .catch(err => {
            console.error(err);
            displayMainMenu();
        });
}

displayMainMenu();

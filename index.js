const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

const getEmployeeTrackerQuestionare = () => {

  inquirer
    .prompt([
      {
        type: 'list',
        message: '\nWhat would you like to do?',
        name: 'employee_option',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
      }
    ])
    .then((data) => {
      switch (data.employee_option) {
        case 'View All Employees':
          getAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployeeRole();
          break;
        case 'View All Roles':
          getAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          getAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Quit':
          console.log("Exiting from application");
          process.exit()
          break;
      }
    });
};

const getAllEmployees = () => {

  console.log("Get all Employee Data");

  // Query database
  db.query('select e1.first_name, e1.last_name, role.title, DEPARTment.name as dept_name, role.salary, CONCAT(e2.first_name, " ", e2.last_name) as manager from EMPLOYEE as e1 LEFT JOIN ROLE ON e1.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee as e2 on e1.manager_id = e2.id;', function (err, results) {

    console.log("\n");
    const table = cTable.getTable(results);
    console.log(table);
    getEmployeeTrackerQuestionare();
  });
};

const getAllDepartments = () => {

  console.log("Get all Employee Data");

  // Query database
  db.query('SELECT * FROM department', function (err, results) {

    console.log("\n");
    const table = cTable.getTable(results);
    console.log(table);
    getEmployeeTrackerQuestionare();
  });
};

const getAllRoles = () => {

  // Query database
  db.query('SELECT title, department.name as department_name, salary FROM role LEFT JOIN department on role.department_id = department.id'
    , function (err, results) {

      console.log("\n");
      const table = cTable.getTable(results);
      console.log(table);
      getEmployeeTrackerQuestionare();
    });
};
const addDepartment = () => {

  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'dept_name'
      }
    ])
    .then((data) => {
      // Query database
      let dept_name = data.dept_name;

      db.query(`INSERT INTO department (name) VALUES (?)`, dept_name, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`Added department ${dept_name} to database`);
        getEmployeeTrackerQuestionare();
      });
    });
};

const addRole = () => {


  db.query(`Select name from department`, (err, result) => {

    //console.log(result)

    var allDepNames = result.map(obj =>
      obj.name);

    if (err) {
      console.log(err);

    }

    inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is the name of the role?',
          name: 'role_name'
        },
        {
          type: 'input',
          message: 'What is the salary of the role?',
          name: 'role_salary'
        },
        {
          type: 'list',
          message: 'What department does the role belong to?',
          name: 'dep_reference',
          choices: allDepNames
        }
      ])
      .then((data) => {
        // Query database
        let role_name = data.role_name;
        let role_salary = data.role_salary;
        let dept_ref = data.dep_reference;


        db.query(`
        Select ID from department where name = (?)`, dept_ref, (err, result) => {


          var allDepIds = result.map(obj => obj.ID);
          let depId = allDepIds[0];

          if (err) {
            console.log(err);
          } else {


            db.query(`
        INSERT INTO role (title,salary,department_id) VALUES (?, ?, ?)`, [role_name, role_salary, depId], (err, result) => {
              //console.log(result);
              if (err) {
                console.log(err);
              } else {
                console.log(`Added role with name ${role_name} to database`);
                getEmployeeTrackerQuestionare();
              }
            });
          }

        });

      });
  });

}


const addEmployee = () => {


  db.query(`Select title from role`, (err, result) => {

    var allTitles = result.map(obj =>
      obj.title);

    if (err) {
      console.log(err);
    }


    db.query(`Select CONCAT(first_name," ",last_name) as name from employee`, (err, result) => {

      var allEmpNames = result.map(obj =>
        obj.name);
      allEmpNames.push("None");

      if (err) {
        console.log(err);
      }
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'What is the employee\'s first name?',
            name: 'first_name'
          },
          {
            type: 'input',
            message: 'What is the employee\'s last name?',
            name: 'last_name'
          },
          {
            type: 'list',
            message: 'What is the employee\'s role?',
            name: 'role',
            choices: allTitles
          },
          {
            type: 'list',
            message: 'Who is the employee\'s manager?',
            name: 'manager',
            choices: allEmpNames
          }
        ])
        .then((data) => {
          // Query database
          let first_name = data.first_name;
          let second_name = data.last_name;
          let manager = data.manager;
          let role = data.role;
          let full_name = "";
          let empId = null;


          if (!(manager == "None")) {
            full_name = manager.split(/(\s+)/);
            db.query(`
            Select ID from employee where first_name = ? and last_name =? `, [full_name[0], full_name[2]], (err, result) => {


              var allEmpIds = result.map(obj => obj.ID);
              empId = allEmpIds[0];

              if (err) {
                console.log(err);
              }

            }
            )
          };

          db.query(`
          Select ID from role where title = ?`, role, (err, res) => {


            var roleIds = res.map(obj => obj.ID);
            let roleId = roleIds[0];

            if (err) {
              console.log(err);
            }
            db.query(`
        INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?, ?, ?, ?)`, [first_name, second_name, roleId, empId], (err, result) => {

              if (err) {
                console.log(err);
              } else {
                console.log(`Added Employee with name ${first_name} ${second_name} to database`);
                getEmployeeTrackerQuestionare();
              }
            });


          });
        });
    });
  });
}

const updateEmployeeRole = () => {


  db.query(`Select CONCAT(first_name," ",last_name) as name from employee`, (err, result) => {

    var allEmpNames = result.map(obj =>
      obj.name);

    if (err) {
      console.log(err);
    }



    db.query(`Select title from role`, (err, result) => {

      var allTitles = result.map(obj =>
        obj.title);

      if (err) {
        console.log(err);
      }


      inquirer
        .prompt([
          {
            type: 'list',
            message: 'What employee\'s role do u want to update?',
            name: 'emp_name',
            choices: allEmpNames
          },
          {
            type: 'list',
            message: 'What role do u want to assign the selected employee?',
            name: 'role',
            choices: allTitles
          }
        ])
        .then((data) => {
          // Query database
          let emp_name = data.emp_name;
          let updated_role = data.role;

          full_name = emp_name.split(/(\s+)/);
          var roleId = "";
          db.query(`
      Select ID from role where title =? `, updated_role, (err, result) => {



            var role_ids = result.map(obj => obj.ID);
            roleId = role_ids[0];

            if (err) {
              console.log(err);
            }
            db.query(`
        update employee set role_id = ? where first_name = ? and last_name = ?`, [roleId, full_name[0], full_name[2]], (err, result) => {

              if (err) {
                console.log(err);
              }
              console.log("Updated employee's role");
              getEmployeeTrackerQuestionare();
            });

          });



        });
    });
  });
}


getEmployeeTrackerQuestionare();
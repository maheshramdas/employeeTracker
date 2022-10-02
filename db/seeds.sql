INSERT INTO department (name)
VALUES ("Engineering"),("Finance"), ("Legal") ,("Sales");

INSERT INTO role (title,salary,department_id)
VALUES ("Tech Lead", "20000", 1),
    ("Accountant", "10000", 2),
       ("Legal Team Lead", "18000", 3),
       ("Lawyer", "21000", 3),
       ("Sales Lead","25000",4),
       ("Sales Person", "8000",4 );


INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Gatsby", "Great", 1 ,null),
    ("Mahesh", "Ramdas", 2 ,1),
       ("Huckleberry", "Finn", 2, 1),
       ("Lincy", "Rajan", 3 ,2),
       ("Yuvan", "Mahesh",3,2 );

       
       

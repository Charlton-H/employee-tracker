INSERT INTO departments (name)
VALUES
  ('Human Resources'),
  ('IT'),
  ('R&D'),
  ('Marketing'),
  ('Finance');

  INSERT INTO roles (title, salary, department_id)
VALUES
  ('HR Staff', 75000, 1),
  ('IT Staff', 75000, 2),
  ('R&D Staff', 75000, 3),
  ('Marketing Staff', 75000, 4),
  ('Finance Staff', 75000, 5),
  ('HR Manager', 110000, 1),
  ('IT Manager', 110000, 2),
  ('R&D Manager', 180000, 3),
  ('Marketing Manager', 110000, 4),
  ('Finance Manager', 110000, 5),
  ('Analyst', 90000, 4),
  ('Accountant', 85000, 5);

  INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES

-- Leads
  ('Dora', 'Carrington', 6, NULL),
  ('Edward', 'Bellamy', 7, NULL),
  ('Joanne', 'Stinnet', 8, NULL),
  ('Montague', 'Summers', 9, NULL),
  ('Larry', 'Antony', 10, NULL),

-- Staff
  ('Ronald', 'Firbank', 1, 1),
  ('Virginia', 'Woolf', 2, 1),
  ('Piers', 'Gaveston', 3, 1),
  ('Charles', 'LeRoi', 4, 1),
  ('Katherine', 'Mansfield', 5, 1),


  -- Specialists
  ('Bill', 'Patterson', 11, 9),
  ('Luke', 'Cary', 12, 10);
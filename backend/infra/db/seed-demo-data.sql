-- ─── lms_user_db ──────────────────────────────────────────────────────────
\c lms_user_db

INSERT INTO departments (name, code, description, email, phone, location, established_year, total_seats) VALUES
  ('Computer Science & Engineering', 'CSE',   'Software, algorithms, AI/ML',     'cse@sample.edu',   '+91-9000000001', 'Block A', 1985, 240),
  ('Electronics & Communication',    'ECE',   'Embedded systems, signal processing', 'ece@sample.edu', '+91-9000000002', 'Block B', 1990, 180),
  ('Mechanical Engineering',         'MECH',  'Thermo, manufacturing',          'mech@sample.edu',  '+91-9000000003', 'Block C', 1980, 180),
  ('Civil Engineering',              'CIVIL', 'Structural, geotech',            'civil@sample.edu', '+91-9000000004', 'Block D', 1980, 120),
  ('Information Technology',         'IT',    'Networking, web, cloud',         'it@sample.edu',    '+91-9000000005', 'Block A', 2000, 120)
ON CONFLICT DO NOTHING;

INSERT INTO students (user_id, roll_number, department_id, program, semester, section, batch, admission_year, status, gender, date_of_birth)
SELECT v.user_id::uuid, v.roll, d.id, v.program, v.sem, v.section, v.batch, v.year, 'ACTIVE', v.gender, v.dob::date
FROM (VALUES
  ('e2c41c92-16a1-4d6f-ac34-815e1d6340c0', 'CS21001', 'CSE',   'B.Tech', 6, 'A', '2021-25', 2021, 'MALE',   '2003-04-15'),
  ('6cf49094-61e2-4839-8a29-2dca4148a95f', 'CS21002', 'CSE',   'B.Tech', 6, 'A', '2021-25', 2021, 'FEMALE', '2003-07-22'),
  ('a96e57f2-dca4-4578-951a-d06595a7021f', 'EC22001', 'ECE',   'B.Tech', 4, 'B', '2022-26', 2022, 'MALE',   '2004-01-09'),
  ('0a51a82c-e620-4c09-81bd-f50e23ccd99d', 'ME23001', 'MECH',  'B.Tech', 2, 'A', '2023-27', 2023, 'MALE',   '2005-05-30'),
  ('8a7d5ef2-84e7-467f-8d39-93c6b04375f5', 'IT21001', 'IT',    'B.Tech', 6, 'A', '2021-25', 2021, 'FEMALE', '2003-11-12')
) AS v(user_id, roll, code, program, sem, section, batch, year, gender, dob)
JOIN departments d ON d.code = v.code
ON CONFLICT DO NOTHING;

INSERT INTO employees (user_id, emp_code, name, email, phone, department_id, designation, employee_type, join_date, base_salary, status, qualifications)
SELECT v.user_id::uuid, v.code, v.name, v.email, '+91-99' || lpad(v.code, 8, '0'), d.id, v.designation, 'FACULTY', '2018-07-01', v.salary, 'ACTIVE', v.qual
FROM (VALUES
  ('81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'EMP001', 'Dr. Faculty 1', 'faculty1@sample.edu', 'CSE',   'Associate Professor', 95000, 'Ph.D. CSE'),
  ('06d5261c-f007-4697-8790-5f4bc787a8a6', 'EMP002', 'Dr. Faculty 2', 'faculty2@sample.edu', 'ECE',   'Assistant Professor', 80000, 'Ph.D. ECE'),
  ('76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'EMP003', 'Dr. Faculty 3', 'faculty3@sample.edu', 'MECH',  'Professor',           120000, 'Ph.D. Mech'),
  ('dba39819-a584-4848-99d6-ead56c6c149e', 'EMP004', 'Dr. Faculty 4', 'faculty4@sample.edu', 'CIVIL', 'Assistant Professor', 78000, 'Ph.D. Civil'),
  ('c53e0612-a982-4733-91f9-6fc831fafb48', 'EMP005', 'Dr. Faculty 5', 'faculty5@sample.edu', 'IT',    'Associate Professor', 92000, 'Ph.D. IT')
) AS v(user_id, code, name, email, dept_code, designation, salary, qual)
JOIN departments d ON d.code = v.dept_code
ON CONFLICT DO NOTHING;

-- ─── lms_course_db ────────────────────────────────────────────────────────
\c lms_course_db

INSERT INTO courses (code, name, description, department_id, credits, semester, faculty_id, status) VALUES
  ('CS601', 'Distributed Systems',           'Replication, consensus, CAP theorem',          1, 4, 6, '81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'ACTIVE'),
  ('CS602', 'Machine Learning',              'Supervised, unsupervised, neural nets',        1, 4, 6, '81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'ACTIVE'),
  ('CS603', 'Database Management Systems',   'SQL, indexing, transactions',                  1, 3, 6, '81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'ACTIVE'),
  ('EC401', 'Digital Signal Processing',     'FFT, Z-transform, filters',                    2, 4, 4, '06d5261c-f007-4697-8790-5f4bc787a8a6', 'ACTIVE'),
  ('EC402', 'VLSI Design',                   'CMOS, layout, timing analysis',                2, 4, 4, '06d5261c-f007-4697-8790-5f4bc787a8a6', 'ACTIVE'),
  ('ME201', 'Engineering Thermodynamics',    'Laws, cycles, entropy',                        3, 4, 2, '76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'ACTIVE'),
  ('ME202', 'Manufacturing Processes',       'Casting, forming, machining',                  3, 3, 2, '76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'ACTIVE'),
  ('CE201', 'Structural Analysis',           'Beams, frames, indeterminate structures',      4, 4, 4, 'dba39819-a584-4848-99d6-ead56c6c149e', 'ACTIVE'),
  ('IT601', 'Cloud Computing',               'AWS, containers, orchestration',               5, 3, 6, 'c53e0612-a982-4733-91f9-6fc831fafb48', 'ACTIVE'),
  ('IT602', 'Cybersecurity',                 'Crypto, network security, OWASP',              5, 3, 6, 'c53e0612-a982-4733-91f9-6fc831fafb48', 'ACTIVE')
ON CONFLICT (code) DO NOTHING;

-- ─── lms_hr_db ────────────────────────────────────────────────────────────
\c lms_hr_db

-- Leave balances per (employee_id, leave_type) per current year
INSERT INTO leave_balances (employee_id, leave_type, total_days, used_days, year)
SELECT u::uuid, lt, td, ud, 2026
FROM (VALUES
  ('81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'CL', 12, 2),
  ('81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'SL', 12, 0),
  ('81c1cedc-e9e1-4354-bab9-ab3ba69c207d', 'EL', 15, 0),
  ('06d5261c-f007-4697-8790-5f4bc787a8a6', 'CL', 12, 0),
  ('06d5261c-f007-4697-8790-5f4bc787a8a6', 'SL', 12, 1),
  ('06d5261c-f007-4697-8790-5f4bc787a8a6', 'EL', 15, 0),
  ('76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'CL', 12, 4),
  ('76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'SL', 12, 0),
  ('76b590c2-5301-4cc1-be16-7aa77f2ba7f1', 'EL', 15, 5),
  ('dba39819-a584-4848-99d6-ead56c6c149e', 'CL', 12, 0),
  ('dba39819-a584-4848-99d6-ead56c6c149e', 'SL', 12, 0),
  ('dba39819-a584-4848-99d6-ead56c6c149e', 'EL', 15, 0),
  ('c53e0612-a982-4733-91f9-6fc831fafb48', 'CL', 12, 3),
  ('c53e0612-a982-4733-91f9-6fc831fafb48', 'SL', 12, 1),
  ('c53e0612-a982-4733-91f9-6fc831fafb48', 'EL', 15, 2)
) AS v(u, lt, td, ud)
ON CONFLICT DO NOTHING;

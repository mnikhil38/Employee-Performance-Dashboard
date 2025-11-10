const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Nikhil@123',
  database: process.env.DB_NAME || 'employee_performance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Employees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        department VARCHAR(50) NOT NULL,
        position VARCHAR(100),
        hire_date DATE,
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Performance metrics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        performance_score INT NOT NULL CHECK (performance_score >= 0 AND performance_score <= 100),
        tasks_completed INT DEFAULT 0,
        avg_response_time DECIMAL(5,2),
        customer_satisfaction DECIMAL(3,2) CHECK (customer_satisfaction >= 0 AND customer_satisfaction <= 5),
        month VARCHAR(20),
        year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // Skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        skill_name VARCHAR(100) NOT NULL,
        proficiency_level INT CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        UNIQUE KEY unique_employee_skill (employee_id, skill_name)
      )
    `);

    // Attendance table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        date DATE NOT NULL,
        hours_worked DECIMAL(4,2),
        productivity_score INT CHECK (productivity_score >= 0 AND productivity_score <= 100),
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        UNIQUE KEY unique_employee_date (employee_id, date)
      )
    `);

    // NEW: Goals table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        target_value DECIMAL(10,2),
        current_value DECIMAL(10,2) DEFAULT 0,
        unit VARCHAR(50),
        status ENUM('not_started', 'in_progress', 'completed', 'overdue') DEFAULT 'not_started',
        start_date DATE,
        due_date DATE,
        completion_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // NEW: Certifications table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        certification_name VARCHAR(200) NOT NULL,
        issuing_organization VARCHAR(150),
        issue_date DATE,
        expiry_date DATE NULL,
        status ENUM('active', 'expired', 'pending') DEFAULT 'active',
        credential_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // NEW: Training programs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS training_programs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        program_name VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        duration_hours INT,
        completion_percentage INT DEFAULT 0,
        status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
        start_date DATE,
        completion_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // NEW: Collaboration metrics table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS collaboration_metrics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        employee_id INT NOT NULL,
        meetings_attended INT DEFAULT 0,
        messages_sent INT DEFAULT 0,
        documents_shared INT DEFAULT 0,
        collaboration_score INT CHECK (collaboration_score >= 0 AND collaboration_score <= 100),
        month VARCHAR(20),
        year INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      )
    `);

    // Insert sample employees
    // Insert sample employees - 20 employees
await connection.query(`
  INSERT IGNORE INTO employees (id, name, email, department, position, hire_date) VALUES
  (1, 'John Doe', 'john.doe@company.com', 'Sales', 'Sales Manager', '2022-01-15'),
  (2, 'Jane Smith', 'jane.smith@company.com', 'Marketing', 'Marketing Specialist', '2021-06-20'),
  (3, 'Mike Johnson', 'mike.johnson@company.com', 'Engineering', 'Senior Developer', '2020-03-10'),
  (4, 'Sarah Williams', 'sarah.williams@company.com', 'Sales', 'Sales Representative', '2022-08-01'),
  (5, 'David Brown', 'david.brown@company.com', 'Engineering', 'Full Stack Developer', '2021-11-15'),
  (6, 'Emily Davis', 'emily.davis@company.com', 'Marketing', 'Content Writer', '2023-02-01'),
  (7, 'Chris Wilson', 'chris.wilson@company.com', 'Sales', 'Account Executive', '2022-05-10'),
  (8, 'Lisa Anderson', 'lisa.anderson@company.com', 'Engineering', 'DevOps Engineer', '2021-09-20'),
  (9, 'Robert Martinez', 'robert.martinez@company.com', 'Sales', 'Senior Sales Rep', '2020-07-12'),
  (10, 'Amanda Garcia', 'amanda.garcia@company.com', 'Marketing', 'Social Media Manager', '2022-03-18'),
  (11, 'James Rodriguez', 'james.rodriguez@company.com', 'Engineering', 'Backend Developer', '2021-09-05'),
  (12, 'Jessica Lee', 'jessica.lee@company.com', 'Sales', 'Business Development', '2023-01-22'),
  (13, 'Daniel Kim', 'daniel.kim@company.com', 'Engineering', 'Frontend Developer', '2022-11-30'),
  (14, 'Michelle Chen', 'michelle.chen@company.com', 'Marketing', 'SEO Specialist', '2021-04-14'),
  (15, 'Ryan Thompson', 'ryan.thompson@company.com', 'Sales', 'Sales Coordinator', '2023-06-08'),
  (16, 'Laura White', 'laura.white@company.com', 'Engineering', 'QA Engineer', '2020-12-03'),
  (17, 'Kevin Park', 'kevin.park@company.com', 'Marketing', 'Brand Manager', '2022-09-25'),
  (18, 'Nicole Taylor', 'nicole.taylor@company.com', 'Sales', 'Account Manager', '2021-02-17'),
  (19, 'Brandon Moore', 'brandon.moore@company.com', 'Engineering', 'Data Engineer', '2023-04-11'),
  (20, 'Samantha Green', 'samantha.green@company.com', 'Marketing', 'Marketing Director', '2020-08-29')
`);

    // Insert performance metrics
    // Insert performance metrics for all 20 employees
await connection.query(`
  INSERT IGNORE INTO performance_metrics (employee_id, performance_score, tasks_completed, avg_response_time, customer_satisfaction, month, year) VALUES
  (1, 92, 145, 2.3, 4.7, 'June', 2025),
  (2, 88, 132, 3.1, 4.5, 'June', 2025),
  (3, 95, 168, 1.8, 4.9, 'June', 2025),
  (4, 85, 128, 2.7, 4.3, 'June', 2025),
  (5, 91, 152, 2.1, 4.6, 'June', 2025),
  (6, 87, 138, 2.9, 4.4, 'June', 2025),
  (7, 89, 141, 2.5, 4.5, 'June', 2025),
  (8, 93, 159, 1.9, 4.8, 'June', 2025),
  (9, 90, 147, 2.2, 4.6, 'June', 2025),
  (10, 86, 135, 2.8, 4.4, 'June', 2025),
  (11, 94, 162, 1.7, 4.9, 'June', 2025),
  (12, 83, 125, 3.2, 4.2, 'June', 2025),
  (13, 92, 155, 2.0, 4.7, 'June', 2025),
  (14, 88, 140, 2.6, 4.5, 'June', 2025),
  (15, 84, 130, 2.9, 4.3, 'June', 2025),
  (16, 91, 150, 2.3, 4.6, 'June', 2025),
  (17, 89, 143, 2.4, 4.5, 'June', 2025),
  (18, 87, 137, 2.7, 4.4, 'June', 2025),
  (19, 93, 158, 1.9, 4.8, 'June', 2025),
  (20, 96, 172, 1.6, 5.0, 'June', 2025)
`);

    // Insert monthly performance
    // Insert monthly performance data for all 20 employees
const months = ['January', 'February', 'March', 'April', 'May', 'June'];
for (let i = 0; i < months.length; i++) {
  for (let empId = 1; empId <= 20; empId++) {
        const baseScore = 80 + Math.floor(Math.random() * 15);
        await connection.query(`
          INSERT IGNORE INTO performance_metrics (employee_id, performance_score, tasks_completed, avg_response_time, customer_satisfaction, month, year)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [empId, baseScore, 100 + Math.floor(Math.random() * 50), 2 + Math.random(), 4 + Math.random(), months[i], 2025]);
      }
    }

    // Insert skills
    // Insert skills data for all 20 employees
const skills = [
  // Employee 1
  [1, 'Communication', 85], [1, 'Teamwork', 90], [1, 'Problem Solving', 80], [1, 'Leadership', 75], [1, 'Sales', 88], [1, 'Time Management', 82],
  // Employee 2
  [2, 'Communication', 88], [2, 'Creativity', 92], [2, 'Marketing', 90], [2, 'Teamwork', 85], [2, 'Problem Solving', 80], [2, 'Time Management', 86],
  // Employee 3
  [3, 'Technical', 95], [3, 'Problem Solving', 93], [3, 'Leadership', 85], [3, 'Communication', 82], [3, 'Teamwork', 88], [3, 'Time Management', 90],
  // Employee 4
  [4, 'Communication', 82], [4, 'Teamwork', 87], [4, 'Sales', 88], [4, 'Problem Solving', 78], [4, 'Leadership', 70], [4, 'Time Management', 80],
  // Employee 5
  [5, 'Technical', 92], [5, 'Problem Solving', 90], [5, 'Time Management', 88], [5, 'Communication', 84], [5, 'Teamwork', 86], [5, 'Leadership', 80],
  // Employee 6
  [6, 'Communication', 90], [6, 'Creativity', 88], [6, 'Writing', 94], [6, 'Marketing', 85], [6, 'Teamwork', 82], [6, 'Time Management', 84],
  // Employee 7
  [7, 'Communication', 86], [7, 'Sales', 91], [7, 'Negotiation', 87], [7, 'Teamwork', 84], [7, 'Problem Solving', 80], [7, 'Time Management', 83],
  // Employee 8
  [8, 'Technical', 94], [8, 'Problem Solving', 91], [8, 'DevOps', 96], [8, 'Communication', 85], [8, 'Teamwork', 89], [8, 'Time Management', 87],
  // Employee 9
  [9, 'Communication', 87], [9, 'Sales', 92], [9, 'Leadership', 85], [9, 'Negotiation', 89], [9, 'Teamwork', 86], [9, 'Time Management', 84],
  // Employee 10
  [10, 'Communication', 89], [10, 'Creativity', 90], [10, 'Social Media', 93], [10, 'Marketing', 88], [10, 'Teamwork', 85], [10, 'Time Management', 87],
  // Employee 11
  [11, 'Technical', 93], [11, 'Problem Solving', 91], [11, 'Backend Dev', 95], [11, 'Communication', 83], [11, 'Teamwork', 87], [11, 'Time Management', 89],
  // Employee 12
  [12, 'Communication', 84], [12, 'Sales', 86], [12, 'Business Dev', 88], [12, 'Negotiation', 82], [12, 'Teamwork', 80], [12, 'Time Management', 81],
  // Employee 13
  [13, 'Technical', 91], [13, 'Problem Solving', 89], [13, 'Frontend Dev', 94], [13, 'Communication', 86], [13, 'Teamwork', 88], [13, 'Time Management', 85],
  // Employee 14
  [14, 'Communication', 88], [14, 'SEO', 92], [14, 'Marketing', 89], [14, 'Analytics', 87], [14, 'Teamwork', 84], [14, 'Time Management', 86],
  // Employee 15
  [15, 'Communication', 81], [15, 'Sales', 83], [15, 'Organization', 85], [15, 'Teamwork', 82], [15, 'Problem Solving', 79], [15, 'Time Management', 80],
  // Employee 16
  [16, 'Technical', 90], [16, 'Problem Solving', 92], [16, 'QA Testing', 94], [16, 'Communication', 84], [16, 'Teamwork', 87], [16, 'Time Management', 88],
  // Employee 17
  [17, 'Communication', 90], [17, 'Creativity', 91], [17, 'Branding', 93], [17, 'Marketing', 89], [17, 'Teamwork', 86], [17, 'Leadership', 84],
  // Employee 18
  [18, 'Communication', 88], [18, 'Sales', 89], [18, 'Account Mgmt', 91], [18, 'Negotiation', 87], [18, 'Teamwork', 85], [18, 'Time Management', 86],
  // Employee 19
  [19, 'Technical', 95], [19, 'Problem Solving', 93], [19, 'Data Analysis', 96], [19, 'Communication', 85], [19, 'Teamwork', 88], [19, 'Time Management', 90],
  // Employee 20
  [20, 'Communication', 94], [20, 'Leadership', 96], [20, 'Marketing', 95], [20, 'Strategy', 93], [20, 'Teamwork', 92], [20, 'Time Management', 91]
];

    for (const [empId, skill, level] of skills) {
      await connection.query(
        'INSERT IGNORE INTO skills (employee_id, skill_name, proficiency_level) VALUES (?, ?, ?)',
        [empId, skill, level]
      );
    }

    // Insert attendance
    // Insert attendance data for all 20 employees
const startDate = new Date('2025-10-20');
for (let i = 0; i < 5; i++) {
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + i);
  const dateStr = currentDate.toISOString().split('T')[0];
  
  for (let empId = 1; empId <= 20; empId++) {
        await connection.query(`
          INSERT IGNORE INTO attendance (employee_id, date, hours_worked, productivity_score)
          VALUES (?, ?, ?, ?)
        `, [empId, dateStr, 7.5 + Math.random() * 1.5, 75 + Math.floor(Math.random() * 20)]);
      }
    }

    // Insert sample goals
    const goalTemplates = [
      ['Increase Sales Revenue', 'Achieve quarterly sales target', 100000, 75000, 'USD', 'in_progress'],
      ['Complete Training Program', 'Finish advanced certification', 100, 60, '%', 'in_progress'],
      ['Customer Satisfaction', 'Maintain high customer ratings', 5, 4.5, 'rating', 'in_progress'],
      ['Project Completion', 'Deliver key projects on time', 5, 3, 'projects', 'in_progress']
    ];

    for (let empId = 1; empId <= 20; empId++) {
      const [title, desc, target, current, unit, status] = goalTemplates[empId % 4];
      await connection.query(`
        INSERT IGNORE INTO goals (employee_id, title, description, target_value, current_value, unit, status, start_date, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATE_SUB(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 30 DAY))
      `, [empId, title, desc, target, current, unit, status]);
    }

    // Insert certifications
    const certifications = [
      ['AWS Solutions Architect', 'Amazon Web Services', '2024-01-15', '2027-01-15', 'active'],
      ['PMP Certification', 'PMI', '2023-06-20', '2026-06-20', 'active'],
      ['Google Analytics', 'Google', '2024-03-10', null, 'active'],
      ['Salesforce Admin', 'Salesforce', '2023-11-05', '2025-11-05', 'active']
    ];

    for (let empId = 1; empId <= 20; empId++) {
      const [name, org, issue, expiry, status] = certifications[empId % 4];
      await connection.query(`
        INSERT IGNORE INTO certifications (employee_id, certification_name, issuing_organization, issue_date, expiry_date, status, credential_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [empId, name, org, issue, expiry, status, `CERT-${1000 + empId}`]);
    }

    // Insert training programs
    const trainings = [
      ['Advanced JavaScript', 'Technical', 40, 75, 'in_progress'],
      ['Leadership Skills', 'Management', 30, 100, 'completed'],
      ['Digital Marketing', 'Marketing', 35, 50, 'in_progress'],
      ['Data Analysis', 'Analytics', 45, 30, 'in_progress']
    ];

    for (let empId = 1; empId <= 20; empId++) {
      const [name, category, duration, completion, status] = trainings[empId % 4];
      await connection.query(`
        INSERT IGNORE INTO training_programs (employee_id, program_name, category, duration_hours, completion_percentage, status, start_date)
        VALUES (?, ?, ?, ?, ?, ?, DATE_SUB(CURDATE(), INTERVAL 60 DAY))
      `, [empId, name, category, duration, completion, status]);
    }

    // Insert collaboration metrics
    for (let empId = 1; empId <= 8; empId++) {
      await connection.query(`
        INSERT IGNORE INTO collaboration_metrics (employee_id, meetings_attended, messages_sent, documents_shared, collaboration_score, month, year)
        VALUES (?, ?, ?, ?, ?, 'June', 2025)
      `, [empId, 15 + Math.floor(Math.random() * 15), 50 + Math.floor(Math.random() * 100), 10 + Math.floor(Math.random() * 20), 75 + Math.floor(Math.random() * 20)]);
    }

    connection.release();
    console.log('✅ Database initialized with all features!');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

// ========== EXISTING API ROUTES ==========

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.*, 
             pm.performance_score, 
             pm.tasks_completed, 
             pm.avg_response_time, 
             pm.customer_satisfaction
      FROM employees e
      LEFT JOIN performance_metrics pm ON e.id = pm.employee_id AND pm.month = 'June'
      WHERE e.status = 'active'
      ORDER BY e.name
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/performance/monthly', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        SUBSTRING(month, 1, 3) as month,
        ROUND(AVG(CASE WHEN e.department = 'Sales' THEN pm.performance_score END), 0) as sales,
        ROUND(AVG(CASE WHEN e.department = 'Marketing' THEN pm.performance_score END), 0) as marketing,
        ROUND(AVG(CASE WHEN e.department = 'Engineering' THEN pm.performance_score END), 0) as engineering
      FROM performance_metrics pm
      JOIN employees e ON pm.employee_id = e.id
      WHERE pm.year = 2025
      GROUP BY month, pm.month
      ORDER BY 
        FIELD(pm.month, 'January', 'February', 'March', 'April', 'May', 'June')
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/departments/distribution', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT department as name, COUNT(*) as value
      FROM employees
      WHERE status = 'active'
      GROUP BY department
    `);
    const colors = { Sales: '#3b82f6', Marketing: '#10b981', Engineering: '#f59e0b' };
    const result = rows.map(row => ({ ...row, fill: colors[row.name] }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT skill_name as skill, ROUND(AVG(proficiency_level), 0) as value
      FROM skills
      GROUP BY skill_name
      ORDER BY value DESC
      LIMIT 6
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/attendance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(date, '%a') as day,
        ROUND(AVG(hours_worked), 1) as hours,
        ROUND(AVG(productivity_score), 0) as productivity
      FROM attendance
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY date, day
      ORDER BY date
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [employeeCount] = await pool.query(
      'SELECT COUNT(*) as count FROM employees WHERE status = "active"'
    );
    
    const [avgPerformance] = await pool.query(
      'SELECT ROUND(AVG(performance_score), 0) as avg FROM performance_metrics WHERE month = "June"'
    );
    
    const [totalTasks] = await pool.query(
      'SELECT SUM(tasks_completed) as total FROM performance_metrics WHERE month = "June"'
    );
    
    const [avgSatisfaction] = await pool.query(
      'SELECT ROUND(AVG(customer_satisfaction), 1) as avg FROM performance_metrics WHERE month = "June"'
    );

    res.json({
      totalEmployees: employeeCount[0].count,
      avgPerformance: avgPerformance[0].avg,
      totalTasks: totalTasks[0].total,
      avgSatisfaction: avgSatisfaction[0].avg
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/performance-tasks', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        SUBSTRING_INDEX(e.name, ' ', 1) as name,
        pm.performance_score as performance,
        pm.tasks_completed as tasks
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE pm.month = 'June'
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/project-funnel', async (req, res) => {
  try {
    const funnel = [
      { stage: 'Planning', employees: 8 },
      { stage: 'Design', employees: 7 },
      { stage: 'Development', employees: 6 },
      { stage: 'Testing', employees: 4 },
      { stage: 'Deployment', employees: 2 }
    ];
    res.json(funnel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/performance-ranges', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        CASE 
          WHEN performance_score >= 90 THEN '90-100'
          WHEN performance_score >= 80 THEN '80-89'
          ELSE '70-79'
        END as \`range\`,
        COUNT(*) as count
      FROM performance_metrics
      WHERE month = 'June'
      GROUP BY \`range\`
      ORDER BY \`range\` DESC
    `);
    
    const colors = { '90-100': '#10b981', '80-89': '#3b82f6', '70-79': '#f59e0b' };
    const result = rows.map(row => ({ ...row, fill: colors[row.range] }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/satisfaction-trend', async (req, res) => {
  try {
    const trend = [
      { quarter: 'Q1', satisfaction: 4.2 },
      { quarter: 'Q2', satisfaction: 4.4 },
      { quarter: 'Q3', satisfaction: 4.5 },
      { quarter: 'Q4', satisfaction: 4.6 }
    ];
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/response-time', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        SUBSTRING_INDEX(e.name, ' ', 1) as name,
        pm.avg_response_time as time,
        CASE 
          WHEN pm.avg_response_time < 2.5 THEN '#10b981'
          ELSE '#f59e0b'
        END as fill
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE pm.month = 'June'
      ORDER BY pm.avg_response_time
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== NEW FEATURE 1: EMPLOYEE COMPARISON ==========

app.post('/api/analytics/compare-employees', async (req, res) => {
  try {
    const { employeeIds } = req.body;
    if (!employeeIds || employeeIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 employees required for comparison' });
    }

    const placeholders = employeeIds.map(() => '?').join(',');
    
    const [comparison] = await pool.query(`
      SELECT 
        e.id,
        e.name,
        e.department,
        pm.performance_score,
        pm.tasks_completed,
        pm.avg_response_time,
        pm.customer_satisfaction,
        (SELECT ROUND(AVG(proficiency_level), 0) FROM skills WHERE employee_id = e.id) as avg_skill_level,
        (SELECT COUNT(*) FROM goals WHERE employee_id = e.id AND status = 'completed') as goals_completed
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE e.id IN (${placeholders}) AND pm.month = 'June'
    `, employeeIds);

    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== NEW FEATURE 2: GOALS TRACKING ==========

app.get('/api/goals', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, e.name as employee_name, e.department,
             ROUND((g.current_value / g.target_value * 100), 0) as progress_percentage
      FROM goals g
      JOIN employees e ON g.employee_id = e.id
      ORDER BY g.due_date ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/goals/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *, ROUND((current_value / target_value * 100), 0) as progress_percentage
      FROM goals
      WHERE employee_id = ?
      ORDER BY due_date ASC
    `, [req.params.employeeId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goals', async (req, res) => {
  const { employee_id, title, description, target_value, unit, start_date, due_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO goals (employee_id, title, description, target_value, unit, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [employee_id, title, description, target_value, unit, start_date, due_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Goal created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/goals/:id', async (req, res) => {
  const { current_value, status } = req.body;
  try {
    await pool.query(
      'UPDATE goals SET current_value = ?, status = ? WHERE id = ?',
      [current_value, status, req.params.id]
    );
    res.json({ message: 'Goal updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/goals-overview', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM goals
      GROUP BY status
    `);
    
    const colors = {
      'not_started': '#6b7280',
      'in_progress': '#3b82f6',
      'completed': '#10b981',
      'overdue': '#ef4444'
    };
    
    const result = rows.map(row => ({ 
      name: row.status.replace('_', ' ').toUpperCase(), 
      value: row.count,
      fill: colors[row.status]
    }));
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== NEW FEATURE 3: TRAINING & CERTIFICATIONS ==========

app.get('/api/certifications', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, e.name as employee_name, e.department
      FROM certifications c
      JOIN employees e ON c.employee_id = e.id
      ORDER BY c.issue_date DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/certifications/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM certifications WHERE employee_id = ? ORDER BY issue_date DESC',
      [req.params.employeeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/training', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, e.name as employee_name, e.department
      FROM training_programs t
      JOIN employees e ON t.employee_id = e.id
      ORDER BY t.completion_percentage DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/training/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM training_programs WHERE employee_id = ? ORDER BY start_date DESC',
      [req.params.employeeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/training-progress', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        category,
        ROUND(AVG(completion_percentage), 0) as avg_completion
      FROM training_programs
      GROUP BY category
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== NEW FEATURE 4: TEAM COLLABORATION ==========

app.get('/api/collaboration', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, e.name as employee_name, e.department
      FROM collaboration_metrics c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.month = 'June' AND c.year = 2025
      ORDER BY c.collaboration_score DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/collaboration-overview', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.name,
        c.collaboration_score,
        c.meetings_attended,
        c.messages_sent,
        c.documents_shared
      FROM collaboration_metrics c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.month = 'June'
      ORDER BY c.collaboration_score DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/department-collaboration', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.department,
        ROUND(AVG(c.collaboration_score), 0) as avg_score,
        SUM(c.meetings_attended) as total_meetings,
        SUM(c.messages_sent) as total_messages
      FROM collaboration_metrics c
      JOIN employees e ON c.employee_id = e.id
      WHERE c.month = 'June'
      GROUP BY e.department
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== NEW FEATURE 5: PREDICTIVE ANALYTICS ==========

app.get('/api/analytics/performance-prediction', async (req, res) => {
  try {
    const [historical] = await pool.query(`
      SELECT 
        month,
        ROUND(AVG(performance_score), 0) as avg_score
      FROM performance_metrics
      WHERE year = 2025
      GROUP BY month
      ORDER BY FIELD(month, 'January', 'February', 'March', 'April', 'May', 'June')
    `);

    // Simple linear regression prediction for next 3 months
    const scores = historical.map(h => h.avg_score);
    const avgGrowth = scores.length > 1 ? 
      (scores[scores.length - 1] - scores[0]) / (scores.length - 1) : 2;

    const predictions = [
      { month: 'Jul', actual: null, predicted: Math.min(100, Math.round(scores[scores.length - 1] + avgGrowth)) },
      { month: 'Aug', actual: null, predicted: Math.min(100, Math.round(scores[scores.length - 1] + avgGrowth * 2)) },
      { month: 'Sep', actual: null, predicted: Math.min(100, Math.round(scores[scores.length - 1] + avgGrowth * 3)) }
    ];

    const result = [
      ...historical.map(h => ({ 
        month: h.month.substring(0, 3), 
        actual: h.avg_score, 
        predicted: null 
      })),
      ...predictions
    ];

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/employee-risk-analysis', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id,
        e.name,
        e.department,
        pm.performance_score,
        CASE 
          WHEN pm.performance_score < 80 THEN 'High Risk'
          WHEN pm.performance_score < 85 THEN 'Medium Risk'
          ELSE 'Low Risk'
        END as risk_level,
        pm.customer_satisfaction,
        (SELECT COUNT(*) FROM goals WHERE employee_id = e.id AND status = 'overdue') as overdue_goals
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE pm.month = 'June'
      ORDER BY pm.performance_score ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/growth-potential', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        e.id,
        e.name,
        e.department,
        pm.performance_score,
        (SELECT COUNT(*) FROM training_programs WHERE employee_id = e.id AND status = 'completed') as completed_trainings,
        (SELECT COUNT(*) FROM certifications WHERE employee_id = e.id AND status = 'active') as active_certifications,
        (SELECT ROUND(AVG(proficiency_level), 0) FROM skills WHERE employee_id = e.id) as avg_skill_level,
        ROUND((pm.performance_score * 0.4 + 
               (SELECT COUNT(*) FROM training_programs WHERE employee_id = e.id AND status = 'completed') * 5 +
               (SELECT COUNT(*) FROM certifications WHERE employee_id = e.id AND status = 'active') * 3), 0) as growth_score
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE pm.month = 'June'
      ORDER BY growth_score DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ADDITIONAL CRUD ENDPOINTS ==========

// Get employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM employees WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new employee
app.post('/api/employees', async (req, res) => {
  const { name, email, department, position, hire_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO employees (name, email, department, position, hire_date) VALUES (?, ?, ?, ?, ?)',
      [name, email, department, position, hire_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  const { name, email, department, position, status } = req.body;
  try {
    await pool.query(
      'UPDATE employees SET name = ?, email = ?, department = ?, position = ?, status = ? WHERE id = ?',
      [name, email, department, position, status, req.params.id]
    );
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new certification
app.post('/api/certifications', async (req, res) => {
  const { employee_id, certification_name, issuing_organization, issue_date, expiry_date, credential_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO certifications (employee_id, certification_name, issuing_organization, issue_date, expiry_date, credential_id) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, certification_name, issuing_organization, issue_date, expiry_date, credential_id]
    );
    res.status(201).json({ id: result.insertId, message: 'Certification added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update certification
app.put('/api/certifications/:id', async (req, res) => {
  const { status, expiry_date } = req.body;
  try {
    await pool.query(
      'UPDATE certifications SET status = ?, expiry_date = ? WHERE id = ?',
      [status, expiry_date, req.params.id]
    );
    res.json({ message: 'Certification updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new training program
app.post('/api/training', async (req, res) => {
  const { employee_id, program_name, category, duration_hours, start_date } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO training_programs (employee_id, program_name, category, duration_hours, start_date) VALUES (?, ?, ?, ?, ?)',
      [employee_id, program_name, category, duration_hours, start_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Training program added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update training program
app.put('/api/training/:id', async (req, res) => {
  const { completion_percentage, status } = req.body;
  try {
    const completion_date = status === 'completed' ? new Date() : null;
    await pool.query(
      'UPDATE training_programs SET completion_percentage = ?, status = ?, completion_date = ? WHERE id = ?',
      [completion_percentage, status, completion_date, req.params.id]
    );
    res.json({ message: 'Training program updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get skills by employee
app.get('/api/skills/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT skill_name as skill, proficiency_level as value FROM skills WHERE employee_id = ?',
      [req.params.employeeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new skill
app.post('/api/skills', async (req, res) => {
  const { employee_id, skill_name, proficiency_level } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO skills (employee_id, skill_name, proficiency_level) VALUES (?, ?, ?)',
      [employee_id, skill_name, proficiency_level]
    );
    res.status(201).json({ id: result.insertId, message: 'Skill added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update skill
app.put('/api/skills/:id', async (req, res) => {
  const { proficiency_level } = req.body;
  try {
    await pool.query(
      'UPDATE skills SET proficiency_level = ? WHERE id = ?',
      [proficiency_level, req.params.id]
    );
    res.json({ message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add collaboration metric
app.post('/api/collaboration', async (req, res) => {
  const { employee_id, meetings_attended, messages_sent, documents_shared, collaboration_score, month, year } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO collaboration_metrics (employee_id, meetings_attended, messages_sent, documents_shared, collaboration_score, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [employee_id, meetings_attended, messages_sent, documents_shared, collaboration_score, month, year]
    );
    res.status(201).json({ id: result.insertId, message: 'Collaboration metric added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete goal
app.delete('/api/goals/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM goals WHERE id = ?', [req.params.id]);
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete certification
app.delete('/api/certifications/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM certifications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete training program
app.delete('/api/training/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM training_programs WHERE id = ?', [req.params.id]);
    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance metrics by employee
app.get('/api/performance/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM performance_metrics WHERE employee_id = ? ORDER BY year DESC, FIELD(month, "June", "May", "April", "March", "February", "January") DESC',
      [req.params.employeeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add performance metric
app.post('/api/performance', async (req, res) => {
  const { employee_id, performance_score, tasks_completed, avg_response_time, customer_satisfaction, month, year } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO performance_metrics (employee_id, performance_score, tasks_completed, avg_response_time, customer_satisfaction, month, year) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [employee_id, performance_score, tasks_completed, avg_response_time, customer_satisfaction, month, year]
    );
    res.status(201).json({ id: result.insertId, message: 'Performance metric added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by employee
app.get('/api/attendance/:employeeId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30',
      [req.params.employeeId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add attendance record
app.post('/api/attendance', async (req, res) => {
  const { employee_id, date, hours_worked, productivity_score } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO attendance (employee_id, date, hours_worked, productivity_score) VALUES (?, ?, ?, ?)',
      [employee_id, date, hours_worked, productivity_score]
    );
    res.status(201).json({ id: result.insertId, message: 'Attendance record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all performance metrics
app.get('/api/performance', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.name, e.department,
             pm.performance_score,
             pm.tasks_completed,
             pm.avg_response_time,
             pm.customer_satisfaction,
             pm.month,
             pm.year
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      WHERE pm.month = 'June'
      ORDER BY pm.performance_score DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export analytics report
app.get('/api/analytics/report', async (req, res) => {
  try {
    const [employeeStats] = await pool.query(`
      SELECT 
        e.name,
        e.department,
        pm.performance_score,
        pm.tasks_completed,
        (SELECT COUNT(*) FROM goals WHERE employee_id = e.id AND status = 'completed') as completed_goals,
        (SELECT COUNT(*) FROM certifications WHERE employee_id = e.id AND status = 'active') as active_certs,
        (SELECT ROUND(AVG(proficiency_level), 0) FROM skills WHERE employee_id = e.id) as avg_skill,
        c.collaboration_score
      FROM employees e
      JOIN performance_metrics pm ON e.id = pm.employee_id
      LEFT JOIN collaboration_metrics c ON e.id = c.employee_id AND c.month = 'June'
      WHERE pm.month = 'June'
      ORDER BY pm.performance_score DESC
    `);
    
    res.json({
      report_date: new Date().toISOString(),
      total_employees: employeeStats.length,
      employee_details: employeeStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`\n✨ New Features Available:`);
  console.log(`   1️⃣  Employee Comparison Tool - /api/analytics/compare-employees`);
  console.log(`   2️⃣  Goals Tracking System - /api/goals`);
  console.log(`   3️⃣  Training & Certifications - /api/training, /api/certifications`);
  console.log(`   4️⃣  Team Collaboration Metrics - /api/collaboration`);
  console.log(`   5️⃣  Predictive Performance Analytics - /api/analytics/performance-prediction`);
  console.log(`\n📚 Total API Endpoints: 40+`);
  await initializeDatabase();
});
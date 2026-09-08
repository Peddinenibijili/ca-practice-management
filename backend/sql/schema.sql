CREATE TABLE IF NOT EXISTS organizations(
 id SERIAL PRIMARY KEY, name VARCHAR(200) NOT NULL, status VARCHAR(30) DEFAULT 'active', created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS users(
 id SERIAL PRIMARY KEY, organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(150) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, password_hash TEXT NOT NULL,
 role VARCHAR(50) DEFAULT 'employee', created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS clients(
 id SERIAL PRIMARY KEY, organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(200) NOT NULL, email VARCHAR(255), phone VARCHAR(40), client_type VARCHAR(40) DEFAULT 'business',
 address TEXT, pan VARCHAR(20), gstin VARCHAR(30), status VARCHAR(30) DEFAULT 'active', created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tasks(
 id SERIAL PRIMARY KEY, organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 client_id INT REFERENCES clients(id) ON DELETE SET NULL, title VARCHAR(250) NOT NULL, description TEXT,
 service_type VARCHAR(80) DEFAULT 'general', priority VARCHAR(20) DEFAULT 'medium',
 status VARCHAR(30) DEFAULT 'pending', due_date DATE, created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE IF NOT EXISTS employees(
 id SERIAL PRIMARY KEY, organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 name VARCHAR(150) NOT NULL, email VARCHAR(255), role VARCHAR(80), status VARCHAR(30) DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS attendance(
 id SERIAL PRIMARY KEY, employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
 work_date DATE DEFAULT CURRENT_DATE, login_at TIMESTAMP, logout_at TIMESTAMP, break_minutes INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS documents(
 id SERIAL PRIMARY KEY, organization_id INT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
 client_id INT REFERENCES clients(id) ON DELETE CASCADE, file_name VARCHAR(255), storage_key TEXT,
 category VARCHAR(100), uploaded_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_clients_org ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);

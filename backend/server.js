require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const sign = (u) => jwt.sign(
  { id: u.id, email: u.email, role: u.role, organizationId: u.organization_id },
  process.env.JWT_SECRET || 'dev-secret',
  { expiresIn: '8h' }
);

function auth(req,res,next){
  try {
    const token = (req.headers.authorization || '').replace('Bearer ','');
    if(!token) return res.status(401).json({message:'Authentication required'});
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    next();
  } catch(e) { return res.status(401).json({message:'Invalid or expired token'}); }
}

app.get('/api/health', async (req,res) => {
  try { await pool.query('SELECT 1'); res.json({ok:true, service:'ca-practice-management-api'}); }
  catch(e){ res.status(503).json({ok:false,message:e.message}); }
});

app.post('/api/auth/register', async (req,res)=>{
  const { organizationName, name, email, password } = req.body;
  if(!organizationName || !name || !email || !password) return res.status(400).json({message:'All fields are required'});
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const org = await client.query('INSERT INTO organizations(name) VALUES($1) RETURNING *',[organizationName]);
    const hash = await bcrypt.hash(password,10);
    const u = await client.query(
      'INSERT INTO users(organization_id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,organization_id,name,email,role',
      [org.rows[0].id,name,email.toLowerCase(),hash,'admin']
    );
    await client.query('COMMIT');
    res.status(201).json({token:sign(u.rows[0]),user:u.rows[0]});
  } catch(e){ await client.query('ROLLBACK'); res.status(400).json({message:e.detail || e.message}); }
  finally{ client.release(); }
});

app.post('/api/auth/login', async (req,res)=>{
  const {email,password}=req.body;
  const r=await pool.query('SELECT * FROM users WHERE email=$1',[String(email||'').toLowerCase()]);
  if(!r.rows[0] || !(await bcrypt.compare(password||'',r.rows[0].password_hash))) return res.status(401).json({message:'Invalid email or password'});
  res.json({token:sign(r.rows[0]),user:{id:r.rows[0].id,name:r.rows[0].name,email:r.rows[0].email,role:r.rows[0].role,organizationId:r.rows[0].organization_id}});
});

app.use('/api',auth);

app.get('/api/dashboard', async(req,res)=>{
  const o=req.user.organizationId;
  const q=await pool.query(`SELECT
    (SELECT count(*) FROM clients WHERE organization_id=$1) clients,
    (SELECT count(*) FROM tasks WHERE organization_id=$1 AND status<>'completed') pending_tasks,
    (SELECT count(*) FROM employees WHERE organization_id=$1 AND status='active') employees`,[o]);
  res.json(q.rows[0]);
});

app.get('/api/clients', async(req,res)=>{
  const q=await pool.query('SELECT * FROM clients WHERE organization_id=$1 ORDER BY id DESC',[req.user.organizationId]);
  res.json(q.rows);
});
app.post('/api/clients', async(req,res)=>{
  const {name,email,phone,client_type,address,pan,gstin}=req.body;
  const q=await pool.query(`INSERT INTO clients(organization_id,name,email,phone,client_type,address,pan,gstin)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.organizationId,name,email||null,phone||null,client_type||'business',address||null,pan||null,gstin||null]);
  res.status(201).json(q.rows[0]);
});
app.put('/api/clients/:id', async(req,res)=>{
  const {name,email,phone,client_type,address,pan,gstin,status}=req.body;
  const q=await pool.query(`UPDATE clients SET name=$1,email=$2,phone=$3,client_type=$4,address=$5,pan=$6,gstin=$7,status=$8
    WHERE id=$9 AND organization_id=$10 RETURNING *`,
    [name,email||null,phone||null,client_type,address||null,pan||null,gstin||null,status||'active',req.params.id,req.user.organizationId]);
  if(!q.rows[0]) return res.status(404).json({message:'Client not found'});
  res.json(q.rows[0]);
});
app.delete('/api/clients/:id', async(req,res)=>{
  const q=await pool.query('DELETE FROM clients WHERE id=$1 AND organization_id=$2 RETURNING id',[req.params.id,req.user.organizationId]);
  if(!q.rows[0]) return res.status(404).json({message:'Client not found'});
  res.json({message:'Client deleted'});
});

app.get('/api/tasks', async(req,res)=>{
  const q=await pool.query(`SELECT t.*,c.name client_name FROM tasks t LEFT JOIN clients c ON c.id=t.client_id
    WHERE t.organization_id=$1 ORDER BY t.due_date NULLS LAST,t.id DESC`,[req.user.organizationId]);
  res.json(q.rows);
});
app.post('/api/tasks', async(req,res)=>{
  const {title,description,client_id,due_date,priority,service_type}=req.body;
  const q=await pool.query(`INSERT INTO tasks(organization_id,title,description,client_id,due_date,priority,service_type)
    VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [req.user.organizationId,title,description||null,client_id||null,due_date||null,priority||'medium',service_type||'general']);
  res.status(201).json(q.rows[0]);
});

app.get('/api/employees', async(req,res)=>{
  const q=await pool.query('SELECT id,name,email,role,status FROM employees WHERE organization_id=$1 ORDER BY id DESC',[req.user.organizationId]);
  res.json(q.rows);
});

app.listen(process.env.PORT||5000,()=>console.log(`API running on ${process.env.PORT||5000}`));

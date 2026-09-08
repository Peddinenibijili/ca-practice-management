import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import './styles.css';

const api=axios.create({baseURL:'http://localhost:5000/api'});
function App(){
 const [token,setToken]=useState(localStorage.getItem('token'));
 const [view,setView]=useState('dashboard');
 const [data,setData]=useState({clients:0,pending_tasks:0,employees:0});
 const [clients,setClients]=useState([]);
 const [tasks,setTasks]=useState([]);
 const [form,setForm]=useState({name:'',email:'',phone:'',client_type:'business',address:'',pan:'',gstin:''});
 const [login,setLogin]=useState({email:'admin@example.com',password:'Admin@123'});
 useEffect(()=>{if(token){api.defaults.headers.common.Authorization=`Bearer ${token}`;load();}},[token,view]);
 async function load(){
   if(view==='dashboard'){const r=await api.get('/dashboard');setData(r.data);}
   if(view==='clients'){const r=await api.get('/clients');setClients(r.data);}
   if(view==='tasks'){const r=await api.get('/tasks');setTasks(r.data);}
 }
 async function doLogin(e){e.preventDefault();try{const r=await api.post('/auth/login',login);localStorage.setItem('token',r.data.token);setToken(r.data.token);}catch(e){alert(e.response?.data?.message||e.message)}}
 async function addClient(e){e.preventDefault();await api.post('/clients',form);setForm({name:'',email:'',phone:'',client_type:'business',address:'',pan:'',gstin:''});load();}
 if(!token)return <div className="login"><div className="login-card"><h1>CA Practice</h1><p>Practice management platform</p><form onSubmit={doLogin}><input placeholder="Email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/><input type="password" placeholder="Password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/><button>Sign in</button></form></div></div>;
 return <div className="app"><aside><h2>CA Practice</h2>{['dashboard','clients','tasks','employees'].map(x=><button className={view===x?'active':''} onClick={()=>setView(x)} key={x}>{x[0].toUpperCase()+x.slice(1)}</button>)}<button onClick={()=>{localStorage.removeItem('token');setToken(null)}}>Logout</button></aside><main><header><div><h1>{view[0].toUpperCase()+view.slice(1)}</h1><span>Professional practice management</span></div></header>
 {view==='dashboard'&&<section className="cards">{[['Clients',data.clients],['Pending Tasks',data.pending_tasks],['Employees',data.employees]].map(a=><div className="card" key={a[0]}><span>{a[0]}</span><strong>{a[1]}</strong></div>)}</section>}
 {view==='clients'&&<section><div className="panel"><h3>Add Client</h3><form className="grid" onSubmit={addClient}>{['name','email','phone','client_type','address','pan','gstin'].map(k=><input key={k} placeholder={k.replace('_',' ')} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>) }<button>Add client</button></form></div><div className="panel"><h3>Clients</h3><table><thead><tr><th>Name</th><th>Type</th><th>PAN</th><th>GSTIN</th><th>Status</th></tr></thead><tbody>{clients.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.client_type}</td><td>{c.pan||'-'}</td><td>{c.gstin||'-'}</td><td>{c.status}</td></tr>)}</tbody></table></div></section>}
 {view==='tasks'&&<div className="panel"><h3>Tasks</h3><table><thead><tr><th>Task</th><th>Service</th><th>Priority</th><th>Due</th><th>Status</th></tr></thead><tbody>{tasks.map(t=><tr key={t.id}><td>{t.title}</td><td>{t.service_type}</td><td>{t.priority}</td><td>{t.due_date||'-'}</td><td>{t.status}</td></tr>)}</tbody></table></div>}
 {view==='employees'&&<div className="panel"><h3>Employee management</h3><p>Employee, attendance, break tracking and timesheet APIs are included in the backend foundation.</p></div>}
 </main></div>
}
createRoot(document.getElementById('root')).render(<App/>);

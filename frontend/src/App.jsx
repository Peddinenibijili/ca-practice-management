import "./App.css";

function App() {
  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          CA Practice
        </div>

        <nav>

          <div className="nav-item active">
            Dashboard
          </div>

          <div className="nav-item">
            Clients
          </div>

          <div className="nav-item">
            Leads
          </div>

          <div className="nav-item">
            Tasks
          </div>

          <div className="nav-item">
            Compliance
          </div>

          <div className="nav-item">
            Invoices
          </div>

          <div className="nav-item">
            Payments
          </div>

          <div className="nav-item">
            Documents
          </div>

          <div className="nav-item">
            Team
          </div>

          <div className="nav-item">
            Reports
          </div>

          <div className="nav-item">
            Settings
          </div>

        </nav>

      </aside>

      <main className="main">

        <header className="header">

          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your CA Practice Management System</p>
          </div>

          <div className="profile">
            Admin
          </div>

        </header>

        <section className="cards">

          <div className="card">
            <h3>Total Clients</h3>
            <strong>0</strong>
          </div>

          <div className="card">
            <h3>Pending Tasks</h3>
            <strong>0</strong>
          </div>

          <div className="card">
            <h3>Outstanding</h3>
            <strong>₹0</strong>
          </div>

          <div className="card">
            <h3>Invoices</h3>
            <strong>0</strong>
          </div>

        </section>

        <section className="welcome">

          <h2>CA Practice Management</h2>

          <p>
            Manage clients, tasks, compliance, billing,
            payments and documents from one platform.
          </p>

        </section>

      </main>

    </div>
  );
}

export default App;
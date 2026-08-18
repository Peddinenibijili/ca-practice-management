import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import AddClient from "./pages/AddClient";
import EditClient from "./pages/EditClient";
import ClientDetails from "./pages/ClientDetails";

import "./App.css";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate to="/login" />
                    }
                />


                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                <Route
                    path="/clients"
                    element={<Clients />}
                />
                <Route
                    path="/clients/new"
                    element={<AddClient />}
                />
                <Route
                    path="/clients/:id/edit"
                    element={<EditClient />}
                />
                <Route
                    path="/clients/:id"
                    element={<ClientDetails />}
                />

            </Routes>

        </BrowserRouter>

    );

}


export default App;
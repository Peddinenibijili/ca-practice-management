import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Clients.css";


function Clients() {

    const navigate = useNavigate();


    // =================================================
    // STATE
    // =================================================

    const [clients, setClients] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [typeFilter, setTypeFilter] = useState("all");

    const [statusFilter, setStatusFilter] = useState("all");

    // =================================================
    // LOAD CLIENTS
    // =================================================

    const loadClients = async () => {

        try {

            setLoading(true);

            setError("");

            const response =
                await api.get("/clients");

            setClients(
                response.data.clients || []
            );

        } catch (error) {

            console.error(
                "CLIENT LOAD ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load clients"
            );

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (client) => {

        const confirmed =
            window.confirm(
            `Are you sure you want to delete ${client.client_name}?`
            );


        if (!confirmed) {

            return;

        }

        try {

            await api.delete(
                `/clients/${client.id}`
            );


            setClients((currentClients) =>
                currentClients.filter(
                    (item) =>
                        item.id !== client.id
                )
            );

            alert(
                "Client deleted successfully."
            );

        } catch (error) {

            console.error(
                "DELETE CLIENT ERROR:",
                error
          );


            alert(
                error.response?.data?.message ||
                "Failed to delete client."
           );

        }

    };
    

    // =================================================
    // LOAD ON PAGE OPEN
    // =================================================

    useEffect(() => {

        loadClients();

    }, []);


    // =================================================
    // SEARCH
    // =================================================

    const filteredClients =
        clients.filter((client) => {

            const searchText =
                search.toLowerCase();


            const matchesSearch =

                client.client_name
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                client.email
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                client.phone
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                client.gst_number
                    ?.toLowerCase()
                    .includes(searchText);


            const matchesType =

                typeFilter === "all" ||

                client.client_type === typeFilter;


            const matchesStatus =

                statusFilter === "all" ||

                client.status === statusFilter;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );
        });

    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="clients-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="clients-header">

                <div>

                    <h1>
                        Clients
                    </h1>

                    <p>
                        Manage your practice clients
                    </p>

                </div>


                <button
                    className="add-client-button"
                    onClick={() =>
                        navigate("/clients/new")
                    }
                >
                    + Add Client
                </button>

            </div>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="clients-toolbar">

                <input
                    type="text"
                    placeholder="Search clients..."
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                />
                <select
                    value={typeFilter}
                    onChange={(event) =>
                        setTypeFilter(event.target.value)
                    }
               >

                <option value="all">
                    All Types
                </option>

                <option value="Business">
                    Business
                </option>

                <option value="Individual">
                    Individual
                </option>

                <option value="Company">
                    Company
                </option>

                <option value="Partnership">
                    Partnership
                </option>

                <option value="LLP">
                    LLP
                </option>

                <option value="Trust">
                    Trust
                </option>

                </select>
                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                   }
                >

                <option value="all">
                    All Status
                </option>

                <option value="active">
                    Active
                </option>

                <option value="inactive">
                    Inactive
                </option>

                <option value="pending">
                    Pending
                </option>

                <option value="suspended">
                    Suspended
                </option>

                <option value="closed">
                    Closed
                </option>

                <option value="completed">
                    Completed
                </option>

                </select>

                <span>
                    {filteredClients.length} clients
                </span>

            </div>


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="error-message">

                    {error}

                    <button
                        onClick={loadClients}
                    >
                        Retry
                    </button>

                </div>

            )}


            {/* =========================================
                LOADING
            ========================================= */}

            {loading && (

                <div className="loading">

                    Loading clients...

                </div>

            )}


            {/* =========================================
                EMPTY STATE
            ========================================= */}

            {!loading &&
             !error &&
             filteredClients.length === 0 && (

                <div className="empty-state">

                    <h2>
                        No clients found
                    </h2>

                    <p>
                        Add your first client
                        to get started.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/clients/new")
                        }
                    >
                        + Add Client
                    </button>

                </div>

            )}


            {
            /* =========================================
                CLIENT TABLE
            ========================================= */}

            {!loading &&
             filteredClients.length > 0 && (

                <div className="clients-table-container">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Client
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Phone
                                </th>

                                <th>
                                    GST
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredClients.map(
                                (client) => (

                                    <tr
                                        key={client.id}
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    client.client_name
                                                }
                                            </strong>

                                        </td>

                                        <td>
                                            {
                                                client.client_type ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                client.email ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                client.phone ||
                                                "-"
                                            }
                                        </td>

                                        <td>
                                            {
                                                client.gst_number ||
                                                "-"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    client.status ===
                                                    "active"
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {
                                                    client.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/clients/${client.id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/clients/${client.id}/edit`
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(client)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}


export default Clients;
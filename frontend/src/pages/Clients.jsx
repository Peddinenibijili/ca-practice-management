import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Clients() {

    // =====================================================
    // CLIENT LIST STATE
    // =====================================================

    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);


    // =====================================================
    // ADD CLIENT MODAL STATE
    // =====================================================

    const [showAddClient, setShowAddClient] = useState(false);


    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        client_name: "",
        email: "",
        phone: "",
        pan_number: "",
        gst_number: "",
        client_type: "Business",
        address: "",
        status: "active"
    });


    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState("");


    // =====================================================
    // LOAD CLIENTS WHEN PAGE LOADS
    // =====================================================

    useEffect(() => {

        loadClients();

    }, []);


    // =====================================================
    // GET CLIENTS
    // =====================================================

    const loadClients = async () => {

        try {

            setLoading(true);

            const response = await api.get("/clients");

            console.log("CLIENTS RESPONSE:", response.data);

            setClients(
                response.data.clients || []
            );

        } catch (error) {

            console.error(
                "CLIENT LOAD ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // HANDLE FORM INPUT
    // =====================================================

    const handleFormChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            client_name: "",
            email: "",
            phone: "",
            pan_number: "",
            gst_number: "",
            client_type: "Business",
            address: "",
            status: "active"
        });

        setFormError("");

    };


    // =====================================================
    // OPEN ADD CLIENT MODAL
    // =====================================================

    const openAddClientModal = () => {

        resetForm();

        setShowAddClient(true);

    };


    // =====================================================
    // CLOSE ADD CLIENT MODAL
    // =====================================================

    const closeAddClientModal = () => {

        if (formLoading) {
            return;
        }

        setShowAddClient(false);

        resetForm();

    };


    // =====================================================
    // ADD CLIENT
    // POST /api/clients
    // =====================================================

    const handleAddClient = async (e) => {

        e.preventDefault();

        setFormError("");


        // ---------------------------------------------
        // Validate Client Name
        // ---------------------------------------------

        if (!formData.client_name.trim()) {

            setFormError(
                "Client name is required"
            );

            return;

        }


        try {

            setFormLoading(true);

            console.log(
                "ADDING CLIENT:",
                formData
            );


            // -----------------------------------------
            // POST REQUEST
            // -----------------------------------------

            const response = await api.post(
                "/clients",
                formData
            );


            console.log(
                "CLIENT CREATED:",
                response.data
            );


            // -----------------------------------------
            // CLOSE MODAL
            // -----------------------------------------

            setShowAddClient(false);


            // -----------------------------------------
            // RESET FORM
            // -----------------------------------------

            resetForm();


            // -----------------------------------------
            // REFRESH CLIENT LIST
            // -----------------------------------------

            await loadClients();


        } catch (error) {

            console.error(
                "ADD CLIENT ERROR:",
                error
            );


            // -----------------------------------------
            // SHOW BACKEND ERROR
            // -----------------------------------------

            setFormError(
                error.response?.data?.message ||
                "Failed to create client"
            );


        } finally {

            setFormLoading(false);

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="clients-page">


            {/* ================================================= */}
            {/* PAGE HEADER */}
            {/* ================================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Clients
                    </h1>

                    <p>
                        Manage and view all your clients
                    </p>

                </div>


                {/* ============================================= */}
                {/* ADD CLIENT BUTTON */}
                {/* ============================================= */}

                <button
                    className="primary-button"
                    type="button"
                    onClick={openAddClientModal}
                >

                    <span>＋</span>

                    Add Client

                </button>

            </div>



            {/* ================================================= */}
            {/* FILTER BAR */}
            {/* ================================================= */}

            <div className="clients-toolbar">


                {/* SEARCH */}
                <div className="client-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search clients by name, email, phone, PAN, GST..."
                    />

                </div>


                {/* TYPE FILTER */}
                <select className="filter-select">

                    <option value="">
                        All Types
                    </option>

                    <option value="Individual">
                        Individual
                    </option>

                    <option value="Business">
                        Business
                    </option>

                </select>


                {/* STATUS FILTER */}
                <select className="filter-select">

                    <option value="">
                        All Status
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>


                {/* CLIENT COUNT */}
                <div className="client-count">

                    {clients.length} clients

                </div>


                {/* REFRESH */}
                <button
                    className="refresh-button"
                    onClick={loadClients}
                    type="button"
                    disabled={loading}
                >

                    ↻

                </button>

            </div>



            {/* ================================================= */}
            {/* CLIENT TABLE */}
            {/* ================================================= */}

            <div className="clients-card">

                <div className="table-wrapper">

                    <table className="clients-table">


                        {/* TABLE HEADER */}

                        <thead>

                            <tr>

                                <th>
                                    CLIENT
                                </th>

                                <th>
                                    TYPE
                                </th>

                                <th>
                                    EMAIL
                                </th>

                                <th>
                                    PHONE
                                </th>

                                <th>
                                    GST
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    ADDED ON
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>



                        {/* TABLE BODY */}

                        <tbody>


                            {/* LOADING */}

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="table-message"
                                    >

                                        Loading clients...

                                    </td>

                                </tr>


                            ) : clients.length === 0 ? (


                                /* NO CLIENTS */

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="table-message"
                                    >

                                        No clients found

                                    </td>

                                </tr>


                            ) : (


                                /* CLIENT LIST */

                                clients.map((client) => (

                                    <tr
                                        key={client.id}
                                    >


                                        {/* CLIENT */}

                                        <td>

                                            <div className="client-name client-name-clickable"
                                                onClick={() => navigate(`/clients/${client.id}`)}
                                            >

                                                <div className="client-avatar">

                                                    {client.client_name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>


                                                <div>

                                                    <strong>
                                                        {client.client_name}
                                                    </strong>

                                                    <small>
                                                        ID: {client.id}
                                                    </small>

                                                </div>

                                            </div>                                               
                                    
                                            <div>
                                            </div>

                                        </td>


                                        {/* TYPE */}

                                        <td>
                                            {client.client_type || "-"}
                                        </td>


                                        {/* EMAIL */}

                                        <td>
                                            {client.email || "-"}
                                        </td>


                                        {/* PHONE */}

                                        <td>
                                            {client.phone || "-"}
                                        </td>


                                        {/* GST */}

                                        <td>
                                            {client.gst_number || "-"}
                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={
                                                    client.status === "active"
                                                        ? "status-badge active"
                                                        : "status-badge inactive"
                                                }
                                            >

                                                {client.status || "active"}

                                            </span>

                                        </td>


                                        {/* CREATED DATE */}

                                        <td>

                                            {client.created_at
                                                ? new Date(
                                                    client.created_at
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )
                                                : "-"
                                            }

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                className="action-button"
                                                type="button"
                                            >

                                                ⋮

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>



                {/* ================================================= */}
                {/* TABLE FOOTER */}
                {/* ================================================= */}

                <div className="clients-footer">

                    <span>

                        Showing 1 to {clients.length} of{" "}

                        {clients.length} clients

                    </span>


                    <div className="pagination">

                        <button
                            type="button"
                            disabled
                        >
                            ‹
                        </button>


                        <button
                            type="button"
                            className="current-page"
                        >
                            1
                        </button>


                        <button
                            type="button"
                            disabled
                        >
                            ›
                        </button>

                    </div>

                </div>

            </div>



            {/* ================================================= */}
            {/* ADD CLIENT MODAL */}
            {/* ================================================= */}

            {showAddClient && (

                <div className="modal-overlay">


                    <div className="add-client-modal">


                        {/* ========================================= */}
                        {/* MODAL HEADER */}
                        {/* ========================================= */}

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add Client
                                </h2>

                                <p>
                                    Add a new client to your practice
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeAddClientModal}
                                disabled={formLoading}
                            >

                                ×

                            </button>

                        </div>



                        {/* ========================================= */}
                        {/* FORM */}
                        {/* ========================================= */}

                        <form
                            onSubmit={handleAddClient}
                        >


                            {/* FORM ERROR */}

                            {formError && (

                                <div className="form-error">

                                    {formError}

                                </div>

                            )}



                            {/* CLIENT NAME */}

                            <div className="form-group">

                                <label>
                                    Client Name *
                                </label>

                                <input
                                    type="text"
                                    name="client_name"
                                    value={formData.client_name}
                                    onChange={handleFormChange}
                                    placeholder="Enter client name"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* CLIENT TYPE */}

                            <div className="form-group">

                                <label>
                                    Client Type
                                </label>

                                <select
                                    name="client_type"
                                    value={formData.client_type}
                                    onChange={handleFormChange}
                                    disabled={formLoading}
                                >

                                    <option value="Business">
                                        Business
                                    </option>

                                    <option value="Individual">
                                        Individual
                                    </option>

                                </select>

                            </div>



                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    placeholder="client@example.com"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleFormChange}
                                    placeholder="Enter phone number"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* PAN */}

                            <div className="form-group">

                                <label>
                                    PAN Number
                                </label>

                                <input
                                    type="text"
                                    name="pan_number"
                                    value={formData.pan_number}
                                    onChange={handleFormChange}
                                    placeholder="ABCDE1234F"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* GST */}

                            <div className="form-group">

                                <label>
                                    GST Number
                                </label>

                                <input
                                    type="text"
                                    name="gst_number"
                                    value={formData.gst_number}
                                    onChange={handleFormChange}
                                    placeholder="37ABCDE1234F1Z5"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* ADDRESS */}

                            <div className="form-group">

                                <label>
                                    Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    placeholder="Enter client address"
                                    rows="3"
                                    disabled={formLoading}
                                />

                            </div>



                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleFormChange}
                                    disabled={formLoading}
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>



                            {/* ========================================= */}
                            {/* MODAL ACTIONS */}
                            {/* ========================================= */}

                            <div className="modal-actions">


                                {/* CANCEL */}

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeAddClientModal}
                                    disabled={formLoading}
                                >

                                    Cancel

                                </button>


                                {/* SAVE */}

                                <button
                                    type="submit"
                                    className="save-client-btn"
                                    disabled={formLoading}
                                >

                                    {formLoading
                                        ? "Saving..."
                                        : "Save Client"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Clients;
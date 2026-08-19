import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ClientProfile() {

    // =====================================================
    // GET CLIENT ID FROM URL
    // =====================================================

    const { id } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [client, setClient] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // LOAD CLIENT
    // =====================================================

    useEffect(() => {

        loadClient();

    }, [id]);


    // =====================================================
    // GET CLIENT BY ID
    // GET /api/clients/:id
    // =====================================================

    const loadClient = async () => {

        try {

            setLoading(true);

            setError("");

            console.log(
                "LOADING CLIENT:",
                id
            );


            const response = await api.get(
                `/clients/${id}`
            );


            console.log(
                "CLIENT PROFILE RESPONSE:",
                response.data
            );


            setClient(
                response.data.client
            );


        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load client profile"
            );


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="client-profile-page">

                <div className="profile-loading">

                    Loading client profile...

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="client-profile-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/clients")}
                >
                    ← Back to Clients
                </button>


                <div className="profile-error">

                    {error}

                </div>

            </div>

        );

    }


    // =====================================================
    // CLIENT NOT FOUND
    // =====================================================

    if (!client) {

        return (

            <div className="client-profile-page">

                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/clients")}
                >
                    ← Back to Clients
                </button>


                <div className="profile-error">

                    Client not found

                </div>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="client-profile-page">


            {/* ================================================= */}
            {/* BACK BUTTON */}
            {/* ================================================= */}

            <button
                type="button"
                className="back-button"
                onClick={() => navigate("/clients")}
            >

                ← Back to Clients

            </button>



            {/* ================================================= */}
            {/* PROFILE HEADER */}
            {/* ================================================= */}

            <div className="profile-header">


                <div className="profile-header-left">


                    {/* AVATAR */}

                    <div className="profile-avatar">

                        {client.client_name
                            ?.charAt(0)
                            ?.toUpperCase()
                        }

                    </div>


                    {/* CLIENT NAME */}

                    <div>

                        <h1>
                            {client.client_name}
                        </h1>


                        <div className="profile-meta">

                            <span>
                                Client ID: {client.id}
                            </span>


                            <span>
                                {client.client_type || "-"}
                            </span>


                            <span
                                className={
                                    client.status === "active"
                                        ? "status-badge active"
                                        : "status-badge inactive"
                                }
                            >

                                {client.status || "active"}

                            </span>

                        </div>

                    </div>

                </div>


                {/* EDIT BUTTON */}

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        console.log(
                            "EDIT CLIENT:",
                            client.id
                        );
                    }}
                >

                    Edit Client

                </button>

            </div>



            {/* ================================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================================= */}

            <div className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <h2>
                            Basic Information
                        </h2>

                        <p>
                            Client contact and business details
                        </p>

                    </div>

                </div>


                <div className="profile-grid">


                    {/* EMAIL */}

                    <div className="profile-field">

                        <label>
                            Email
                        </label>

                        <div>
                            {client.email || "-"}
                        </div>

                    </div>


                    {/* PHONE */}

                    <div className="profile-field">

                        <label>
                            Phone
                        </label>

                        <div>
                            {client.phone || "-"}
                        </div>

                    </div>


                    {/* CLIENT TYPE */}

                    <div className="profile-field">

                        <label>
                            Client Type
                        </label>

                        <div>
                            {client.client_type || "-"}
                        </div>

                    </div>


                    {/* ADDRESS */}

                    <div className="profile-field">

                        <label>
                            Address
                        </label>

                        <div>
                            {client.address || "-"}
                        </div>

                    </div>

                </div>

            </div>



            {/* ================================================= */}
            {/* TAX INFORMATION */}
            {/* ================================================= */}

            <div className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <h2>
                            Tax Information
                        </h2>

                        <p>
                            PAN and GST information
                        </p>

                    </div>

                </div>


                <div className="profile-grid">


                    {/* PAN */}

                    <div className="profile-field">

                        <label>
                            PAN Number
                        </label>

                        <div>
                            {client.pan_number || "-"}
                        </div>

                    </div>


                    {/* GST */}

                    <div className="profile-field">

                        <label>
                            GST Number
                        </label>

                        <div>
                            {client.gst_number || "-"}
                        </div>

                    </div>

                </div>

            </div>



            {/* ================================================= */}
            {/* CLIENT INFORMATION */}
            {/* ================================================= */}

            <div className="profile-section">

                <div className="profile-section-header">

                    <div>

                        <h2>
                            Client Information
                        </h2>

                        <p>
                            Account information
                        </p>

                    </div>

                </div>


                <div className="profile-grid">


                    {/* CLIENT ID */}

                    <div className="profile-field">

                        <label>
                            Client ID
                        </label>

                        <div>
                            {client.id}
                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="profile-field">

                        <label>
                            Status
                        </label>

                        <div>

                            <span
                                className={
                                    client.status === "active"
                                        ? "status-badge active"
                                        : "status-badge inactive"
                                }
                            >

                                {client.status || "active"}

                            </span>

                        </div>

                    </div>


                    {/* CREATED */}

                    <div className="profile-field">

                        <label>
                            Created On
                        </label>

                        <div>

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

                        </div>

                    </div>


                    {/* UPDATED */}

                    <div className="profile-field">

                        <label>
                            Last Updated
                        </label>

                        <div>

                            {client.updated_at
                                ? new Date(
                                    client.updated_at
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

                        </div>

                    </div>

                </div>

            </div>


        </div>

    );

}


export default ClientProfile;
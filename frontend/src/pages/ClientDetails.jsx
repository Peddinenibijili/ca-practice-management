import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";


function ClientDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [client, setClient] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadClient = async () => {

            try {

                const response =
                    await api.get(
                        `/clients/${id}`
                    );


                setClient(
                    response.data.client
                );

            } catch (error) {

                console.error(
                    "CLIENT DETAILS ERROR:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Failed to load client."
                );

            } finally {

                setLoading(false);

            }

        };


        loadClient();

    }, [id]);


    if (loading) {

        return (
            <div className="loading">
                Loading client...
            </div>
        );

    }


    if (error) {

        return (
            <div className="form-error">
                {error}
            </div>
        );

    }


    if (!client) {

        return (
            <div>
                Client not found.
            </div>
        );

    }


    return (

        <div className="add-client-page">


            <div className="add-client-header">

                <div>

                    <h1>
                        {client.client_name}
                    </h1>

                    <p>
                        Client Details
                    </p>

                </div>


                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/clients")
                    }
                >
                    ← Back to Clients
                </button>

            </div>


            <div className="add-client-card">


                <h2>
                    Basic Information
                </h2>


                <p>
                    <strong>
                        Client Name:
                    </strong>{" "}
                    {client.client_name}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>{" "}
                    {client.email || "-"}
                </p>


                <p>
                    <strong>
                        Phone:
                    </strong>{" "}
                    {client.phone || "-"}
                </p>


                <p>
                    <strong>
                        PAN:
                    </strong>{" "}
                    {client.pan_number || "-"}
                </p>


                <p>
                    <strong>
                        GST:
                    </strong>{" "}
                    {client.gst_number || "-"}
                </p>


                <p>
                    <strong>
                        Client Type:
                    </strong>{" "}
                    {client.client_type || "-"}
                </p>


                <p>
                    <strong>
                        Address:
                    </strong>{" "}
                    {client.address || "-"}
                </p>


                <p>
                    <strong>
                        Status:
                    </strong>{" "}
                    {client.status}
                </p>


                <p>
                    <strong>
                        Created:
                    </strong>{" "}
                    {client.created_at
                        ? new Date(
                            client.created_at
                        ).toLocaleString()
                        : "-"
                    }
                </p>


                <p>
                    <strong>
                        Last Updated:
                    </strong>{" "}
                    {client.updated_at
                        ? new Date(
                            client.updated_at
                        ).toLocaleString()
                        : "-"
                    }
                </p>


                <div className="form-actions">

                    <button
                        className="save-button"
                        onClick={() =>
                            navigate(
                                `/clients/${client.id}/edit`
                            )
                        }
                    >
                        Edit Client
                    </button>

                </div>


            </div>

        </div>

    );

}


export default ClientDetails;
import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";


function ClientProfile() {

    const {
        id
    } = useParams();


    const navigate =
        useNavigate();


    const [client, setClient] =
        useState(null);


    const [taxInformation, setTaxInformation] =
        useState(null);


    const [documents, setDocuments] =
        useState([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadProfile =
            async () => {

                try {

                    setLoading(true);


                    const response =
                        await api.get(
                            `/clients/${id}/profile`
                        );


                    console.log(
                        "CLIENT PROFILE:",
                        response.data
                    );


                    setClient(
                        response.data.client
                    );


                    setTaxInformation(
                        response.data.taxInformation
                    );


                    setDocuments(
                        response.data.documents || []
                    );


                } catch (error) {

                    console.error(
                        "PROFILE ERROR:",
                        error
                    );


                    setError(
                        "Unable to load client profile."
                    );


                } finally {

                    setLoading(false);

                }

            };


        loadProfile();

    }, [id]);


    if (loading) {

        return (
            <h2>
                Loading client profile...
            </h2>
        );

    }


    if (error) {

        return (
            <div>

                <h3>
                    {error}
                </h3>

                <button
                    onClick={() =>
                        navigate("/clients")
                    }
                >
                    Back to Clients
                </button>

            </div>
        );

    }


    if (!client) {

        return (
            <h3>
                Client not found
            </h3>
        );

    }


    return (

        <div className="client-profile">

            <button
                onClick={() =>
                    navigate("/clients")
                }
            >
                ← Back to Clients
            </button>


            <h1>
                {client.client_name}
            </h1>


            <p>
                Status:
                {" "}
                {client.status}
            </p>


            {/* ============================ */}
            {/* BASIC INFORMATION */}
            {/* ============================ */}

            <div className="profile-card">

                <h2>
                    Basic Information
                </h2>


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

            </div>


            {/* ============================ */}
            {/* TAX INFORMATION */}
            {/* ============================ */}

            <div className="profile-card">

                <h2>
                    Tax Information
                </h2>


                <p>
                    <strong>
                        PAN:
                    </strong>{" "}

                    {taxInformation?.pan_number
                        || client.pan_number
                        || "-"
                    }

                </p>


                <p>
                    <strong>
                        GST:
                    </strong>{" "}

                    {taxInformation?.gst_number
                        || client.gst_number
                        || "-"
                    }

                </p>


                <p>
                    <strong>
                        GST Type:
                    </strong>{" "}

                    {taxInformation?.gst_type
                        || "-"
                    }

                </p>


                <p>
                    <strong>
                        ITR Type:
                    </strong>{" "}

                    {taxInformation?.itr_type
                        || "-"
                    }

                </p>


                <p>
                    <strong>
                        Financial Year:
                    </strong>{" "}

                    {taxInformation?.financial_year
                        || "-"
                    }

                </p>

            </div>


            {/* ============================ */}
            {/* DOCUMENTS */}
            {/* ============================ */}

            <div className="profile-card">

                <h2>
                    Documents
                </h2>


                {documents.length === 0 ? (

                    <p>
                        No documents uploaded yet.
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Document
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {documents.map(
                                (document) => (

                                    <tr
                                        key={
                                            document.id
                                        }
                                    >

                                        <td>
                                            {
                                                document.document_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                document.document_type
                                            }
                                        </td>

                                        <td>
                                            {
                                                document.document_status
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}


export default ClientProfile;
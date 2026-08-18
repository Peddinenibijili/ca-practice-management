import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";


const [selectedFile, setSelectedFile] =
    useState(null);

const [documentName, setDocumentName] =
    useState("");

const [documentType, setDocumentType] =
    useState("");

const [uploading, setUploading] =
    useState(false);

const handleFileChange = (event) => {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    setSelectedFile(file);

};

const handleUpload = async () => {

    if (!selectedFile) {

        alert(
            "Please select a file."
        );

        return;

    }


    if (!documentName.trim()) {

        alert(
            "Please enter document name."
        );

        return;

    }


    try {

        setUploading(true);


        const formData =
            new FormData();


        formData.append(
            "document",
            selectedFile
        );


        formData.append(
            "document_name",
            documentName
        );


        formData.append(
            "document_type",
            documentType
        );


        const response =
            await api.post(

                `/clients/${id}/documents`,

                formData

            );


        console.log(
            "UPLOAD RESPONSE:",
            response.data
        );


        alert(
            "Document uploaded successfully."
        );


        // Add new document to UI

        setDocuments(
            (previousDocuments) => [

                response.data.document,

                ...previousDocuments

            ]
        );


        // Reset form

        setSelectedFile(null);

        setDocumentName("");

        setDocumentType("");


        document.getElementById(
            "document-upload-input"
        ).value = "";


    } catch (error) {

        console.error(
            "UPLOAD ERROR:",
            error
        );


        alert(
            error.response?.data?.message ||
            "Failed to upload document."
        );


    } finally {

        setUploading(false);

    }

};


<div className="document-upload-box">

    <h3>
        Upload Document
    </h3>


    <div>

        <label>
            Document Name
        </label>


        <input
            type="text"
            value={documentName}
            onChange={(e) =>
                setDocumentName(
                    e.target.value
                )
            }
            placeholder="Example: PAN Card"
        />

    </div>


    <br />


    <div>

        <label>
            Document Type
        </label>


        <select
            value={documentType}
            onChange={(e) =>
                setDocumentType(
                    e.target.value
                )
            }
        >

            <option value="">
                Select Type
            </option>

            <option value="Identity">
                Identity
            </option>

            <option value="GST">
                GST
            </option>

            <option value="Income Tax">
                Income Tax
            </option>

            <option value="Bank">
                Bank
            </option>

            <option value="Company">
                Company
            </option>

            <option value="Other">
                Other
            </option>

        </select>

    </div>


    <br />


    <div>

        <label>
            File
        </label>


        <input
            id="document-upload-input"
            type="file"
            accept="
                .pdf,
                .jpg,
                .jpeg,
                .png,
                .doc,
                .docx,
                .xls,
                .xlsx
            "
            onChange={
                handleFileChange
            }
        />

    </div>


    <br />


    {selectedFile && (

        <p>

            Selected:

            {" "}

            <strong>
                {selectedFile.name}
            </strong>

        </p>

    )}


    <button
        onClick={handleUpload}
        disabled={uploading}
    >

        {uploading
            ? "Uploading..."
            : "Upload Document"
        }

    </button>

</div>

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

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}
    >

        <h2>
            Documents
        </h2>


        <button
            onClick={() =>
                document.getElementById(
                    "document-upload-input"
                ).click()
            }
        >
            + Upload Document
        </button>

    </div>


    <input
        id="document-upload-input"
        type="file"
        style={{
            display: "none"
        }}
    />


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
                        File
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Action
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
                                    document.file_name
                                }
                            </td>


                            <td>
                                {
                                    document.document_status
                                }
                            </td>


                            <td>

                                <button>
                                    View
                                </button>


                                <button>
                                    Delete
                                </button>

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
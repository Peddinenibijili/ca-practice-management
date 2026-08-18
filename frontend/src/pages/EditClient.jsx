import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import "./AddClient.css";


function EditClient() {

    const { id } = useParams();

    const navigate = useNavigate();


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


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD CLIENT
    // ==========================================

    useEffect(() => {

        const loadClient = async () => {

            try {

                const response =
                    await api.get(`/clients/${id}`);

                const client =
                    response.data.client;

                setFormData({

                    client_name:
                        client.client_name || "",

                    email:
                        client.email || "",

                    phone:
                        client.phone || "",

                    pan_number:
                        client.pan_number || "",

                    gst_number:
                        client.gst_number || "",

                    client_type:
                        client.client_type || "Business",

                    address:
                        client.address || "",

                    status:
                        client.status || "active"

                });

            } catch (error) {

                console.error(
                    "LOAD CLIENT ERROR:",
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


    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({

            ...formData,

            [name]: value

        });

    };


    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {

        if (!formData.client_name.trim()) {

            return "Client name is required.";

        }


        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(formData.phone)
        ) {

            return "Phone number must contain exactly 10 digits.";

        }


        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {

            return "Please enter a valid email address.";

        }


        if (
            formData.pan_number &&
            !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(
                formData.pan_number.toUpperCase()
            )
        ) {

            return "Invalid PAN number.";

        }


        if (
            formData.gst_number &&
            !/^[0-9A-Z]{15}$/.test(
                formData.gst_number.toUpperCase()
            )
        ) {

            return "GST number must contain 15 characters.";

        }


        return "";

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(validationError);

            return;

        }


        try {

            setSaving(true);


            const response =
                await api.put(
                    `/clients/${id}`,
                    {
                        ...formData,

                        pan_number:
                            formData.pan_number.toUpperCase(),

                        gst_number:
                            formData.gst_number.toUpperCase()
                    }
                );


            console.log(
                "CLIENT UPDATED:",
                response.data
            );


            setSuccess(
                "Client updated successfully!"
            );


            setTimeout(() => {

                navigate(`/clients/${id}`);

            }, 1000);


        } catch (error) {

            console.error(
                "UPDATE CLIENT ERROR:",
                error
            );


            setError(

                error.response?.data?.message ||
                "Failed to update client."

            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="loading">

                Loading client...

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="add-client-page">

            <div className="add-client-header">

                <div>

                    <h1>
                        Edit Client
                    </h1>

                    <p>
                        Update client information
                    </p>

                </div>


                <button
                    className="back-button"
                    onClick={() =>
                        navigate(`/clients/${id}`)
                    }
                >
                    ← Back
                </button>

            </div>


            <div className="add-client-card">

                {error && (

                    <div className="form-error">

                        {error}

                    </div>

                )}


                {success && (

                    <div className="form-success">

                        {success}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Client Name *
                        </label>

                        <input
                            name="client_name"
                            value={formData.client_name}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            name="phone"
                            value={formData.phone}
                            maxLength="10"
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            PAN Number
                        </label>

                        <input
                            name="pan_number"
                            value={formData.pan_number}
                            maxLength="10"
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            GST Number
                        </label>

                        <input
                            name="gst_number"
                            value={formData.gst_number}
                            maxLength="15"
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Client Type
                        </label>

                        <select
                            name="client_type"
                            value={formData.client_type}
                            onChange={handleChange}
                            disabled={saving}
                        >

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

                    </div>


                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            rows="4"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={saving}
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            disabled={saving}
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() =>
                                navigate(`/clients/${id}`)
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Updating..."
                                : "Update Client"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default EditClient;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./AddClient.css";


function AddClient() {

    const navigate = useNavigate();


    // =================================================
    // FORM STATE
    // =================================================

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


    // =================================================
    // UI STATE
    // =================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =================================================
    // HANDLE INPUT
    // =================================================

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


    // =================================================
    // SUBMIT FORM
    // =================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");

        setSuccess("");


        // ---------------------------------------------
        // CLIENT NAME VALIDATION
        // ---------------------------------------------

        if (
            !formData.client_name.trim()
        ) {

            setError(
                "Client name is required."
            );

            return;

        }


        // ---------------------------------------------
        // PHONE VALIDATION
        // ---------------------------------------------

        if (
            formData.phone &&
            !/^[0-9]{10}$/.test(
                formData.phone
            )
        ) {

            setError(
                "Phone number must contain exactly 10 digits."
            );

            return;

        }
     
        // ---------------------------------------------
        // PAN VALIDATION
        // ---------------------------------------------
        if (
            formData.pan_number &&
            !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(
            formData.pan_number.toUpperCase()
            ) 
        ) {

            setError(
            "Invalid PAN number. Example: ABCDE1234F"
            );

            return;

        }

        // ---------------------------------------------
        // GST VALIDATION
        // ---------------------------------------------
        if (
            formData.gst_number &&
            !/^[0-9A-Z]{15}$/.test(
                formData.gst_number.toUpperCase()
            )
        ) {
            setError(
                "GST number must contain exactly 15 characters."
            );
            return;
        }

        // ---------------------------------------------
        // EMAIL VALIDATION
        // ---------------------------------------------

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {

            setError(
                "Please enter a valid email address."
            );

            return;

        }


        try {

            setLoading(true);


            // -----------------------------------------
            // API REQUEST
            // -----------------------------------------

            const response =
                await api.post(
                    "/clients",
                    formData
                );


            console.log(
                "CLIENT CREATED:",
                response.data
            );


            setSuccess(
                "Client created successfully!"
            );


            // -----------------------------------------
            // REDIRECT
            // -----------------------------------------

            setTimeout(() => {

                navigate("/clients");

            }, 1000);


        } catch (error) {

            console.error(
                "CREATE CLIENT ERROR:",
                error
            );


            setError(

                error.response?.data?.message ||

                "Failed to create client. Please try again."

            );

        } finally {

            setLoading(false);

        }

    };


    // =================================================
    // CANCEL
    // =================================================

    const handleCancel = () => {

        navigate("/clients");

    };


    // =================================================
    // UI
    // =================================================

    return (

        <div className="add-client-page">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="add-client-header">

                <div>

                    <h1>
                        Add New Client
                    </h1>

                    <p>
                        Add a client to your practice
                    </p>

                </div>


                <button
                    type="button"
                    className="back-button"
                    onClick={handleCancel}
                >
                    ← Back to Clients
                </button>

            </div>


            {/* =========================================
                FORM CARD
            ========================================= */}

            <div className="add-client-card">


                {/* =====================================
                    ERROR MESSAGE
                ===================================== */}

                {error && (

                    <div className="form-error">

                        {error}

                    </div>

                )}


                {/* =====================================
                    SUCCESS MESSAGE
                ===================================== */}

                {success && (

                    <div className="form-success">

                        {success}

                    </div>

                )}


                <form
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        CLIENT NAME
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Client Name *
                        </label>

                        <input
                            type="text"
                            name="client_name"
                            value={
                                formData.client_name
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter client name"
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        EMAIL
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="client@example.com"
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        PHONE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Phone
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="10 digit phone number"
                            maxLength="10"
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        PAN
                    ================================= */}

                    <div className="form-group">

                        <label>
                            PAN Number
                        </label>

                        <input
                            type="text"
                            name="pan_number"
                            value={
                                formData.pan_number
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="ABCDE1234F"
                            maxLength="10"
                            style={{
                                textTransform:
                                    "uppercase"
                            }}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        GST
                    ================================= */}

                    <div className="form-group">

                        <label>
                            GST Number
                        </label>

                        <input
                            type="text"
                            name="gst_number"
                            value={
                                formData.gst_number
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="37ABCDE1234F1Z5"
                            maxLength="15"
                            style={{
                                textTransform:
                                    "uppercase"
                            }}
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        CLIENT TYPE
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Client Type
                        </label>

                        <select
                            name="client_type"
                            value={
                                formData.client_type
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
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


                    {/* =================================
                        ADDRESS
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter client address"
                            rows="4"
                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        STATUS
                    ================================= */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        BUTTONS
                    ================================= */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Client"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default AddClient;
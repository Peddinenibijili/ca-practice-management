const pool = require("../config/db");


// =====================================================
// GET ALL CLIENTS
// =====================================================

exports.getClients = async (req, res) => {

    try {

        const organizationId = req.user.organizationId;

        const result = await pool.query(
            `
            SELECT
                id,
                organization_id,
                client_name,
                email,
                phone,
                pan_number,
                gst_number,
                client_type,
                address,
                status,
                created_at,
                updated_at
            FROM clients
            WHERE organization_id = $1
            ORDER BY created_at DESC
            `,
            [organizationId]
        );

        res.status(200).json({
            clients: result.rows
        });

    } catch (error) {

        console.error("GET CLIENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch clients"
        });

    }
};



// =====================================================
// GET CLIENT BY ID
// =====================================================

exports.getClientById = async (req, res) => {

    try {

        const clientId = req.params.id;
        const organizationId = req.user.organizationId;

        const result = await pool.query(
            `
            SELECT
                id,
                organization_id,
                client_name,
                email,
                phone,
                pan_number,
                gst_number,
                client_type,
                address,
                status,
                created_at,
                updated_at
            FROM clients
            WHERE id = $1
            AND organization_id = $2
            `,
            [
                clientId,
                organizationId
            ]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Client not found"
            });

        }

        res.status(200).json({
            client: result.rows[0]
        });

    } catch (error) {

        console.error("GET CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch client"
        });

    }
};



// =====================================================
// CREATE CLIENT
// =====================================================

exports.createClient = async (req, res) => {

    try {

        const organizationId = req.user.organizationId;

        const {
            client_name,
            email,
            phone,
            pan_number,
            gst_number,
            client_type,
            address,
            status
        } = req.body;


        // ---------------------------------------------
        // Validate client name
        // ---------------------------------------------

        if (!client_name || client_name.trim() === "") {

            return res.status(400).json({
                message: "Client name is required"
            });

        }


        // ---------------------------------------------
        // Insert client
        // ---------------------------------------------

        const result = await pool.query(
            `
            INSERT INTO clients
            (
                organization_id,
                client_name,
                email,
                phone,
                pan_number,
                gst_number,
                client_type,
                address,
                status
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9
            )
            RETURNING
                id,
                organization_id,
                client_name,
                email,
                phone,
                pan_number,
                gst_number,
                client_type,
                address,
                status,
                created_at,
                updated_at
            `,
            [
                organizationId,
                client_name.trim(),
                email || null,
                phone || null,
                pan_number || null,
                gst_number || null,
                client_type || null,
                address || null,
                status || "active"
            ]
        );


        res.status(201).json({
            message: "Client created successfully",
            client: result.rows[0]
        });

    } catch (error) {

        console.error("CREATE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to create client"
        });

    }
};



// =====================================================
// UPDATE CLIENT
// =====================================================

exports.updateClient = async (req, res) => {

    try {

        const clientId = req.params.id;
        const organizationId = req.user.organizationId;

        const {
            client_name,
            email,
            phone,
            pan_number,
            gst_number,
            client_type,
            address,
            status
        } = req.body;


        if (!client_name || client_name.trim() === "") {

            return res.status(400).json({
                message: "Client name is required"
            });

        }


        const result = await pool.query(
            `
            UPDATE clients

            SET
                client_name = $1,
                email = $2,
                phone = $3,
                pan_number = $4,
                gst_number = $5,
                client_type = $6,
                address = $7,
                status = $8,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $9
            AND organization_id = $10

            RETURNING
                id,
                organization_id,
                client_name,
                email,
                phone,
                pan_number,
                gst_number,
                client_type,
                address,
                status,
                created_at,
                updated_at
            `,
            [
                client_name.trim(),
                email || null,
                phone || null,
                pan_number || null,
                gst_number || null,
                client_type || null,
                address || null,
                status || "active",
                clientId,
                organizationId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Client not found"
            });

        }


        res.status(200).json({
            message: "Client updated successfully",
            client: result.rows[0]
        });

    } catch (error) {

        console.error("UPDATE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to update client"
        });

    }
};



// =====================================================
// DELETE CLIENT
// =====================================================

exports.deleteClient = async (req, res) => {

    try {

        const clientId = req.params.id;
        const organizationId = req.user.organizationId;


        const result = await pool.query(
            `
            DELETE FROM clients

            WHERE id = $1
            AND organization_id = $2

            RETURNING id
            `,
            [
                clientId,
                organizationId
            ]
        );


        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Client not found"
            });

        }


        res.status(200).json({
            message: "Client deleted successfully"
        });

    } catch (error) {

        console.error("DELETE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to delete client"
        });

    }
};
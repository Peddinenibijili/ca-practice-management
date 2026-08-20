const pool = require("../config/db");

// GET ALL CLIENTS
exports.getClients = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        const result = await pool.query(
            `
            SELECT *
            FROM clients
            WHERE organization_id = $1
            ORDER BY id DESC
            `,
            [organizationId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("GET CLIENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch clients",
        });
    }
};


// GET SINGLE CLIENT
exports.getClientById = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM clients
            WHERE id = $1
            AND organization_id = $2
            `,
            [id, organizationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("GET CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch client",
        });
    }
};


// CREATE CLIENT
exports.createClient = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        const {
            name,
            email,
            phone,
            client_type,
            address,
            pan
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO clients
            (
                organization_id,
                name,
                email,
                phone,
                client_type,
                address,
                pan
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `,
            [
                organizationId,
                name,
                email,
                phone,
                client_type,
                address,
                pan
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("CREATE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to create client",
        });
    }
};


// UPDATE CLIENT
exports.updateClient = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            client_type,
            address,
            pan
        } = req.body;

        const result = await pool.query(
            `
            UPDATE clients
            SET
                name = $1,
                email = $2,
                phone = $3,
                client_type = $4,
                address = $5,
                pan = $6
            WHERE id = $7
            AND organization_id = $8
            RETURNING *
            `,
            [
                name,
                email,
                phone,
                client_type,
                address,
                pan,
                id,
                organizationId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("UPDATE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to update client",
        });
    }
};


// DELETE CLIENT
exports.deleteClient = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM clients
            WHERE id = $1
            AND organization_id = $2
            RETURNING *
            `,
            [id, organizationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        res.json({
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.error("DELETE CLIENT ERROR:", error);

        res.status(500).json({
            message: "Failed to delete client",
        });
    }
};
const pool = require("../config/db");

// ==========================================
// GET ORGANIZATION
// ==========================================
exports.getOrganization = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID not found"
            });
        }

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                created_at
            FROM organizations
            WHERE id = $1
            `,
            [organizationId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            organization: result.rows[0]
        });

    } catch (error) {
        console.error("GET ORGANIZATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch organization"
        });
    }
};


// ==========================================
// UPDATE ORGANIZATION
// ==========================================
exports.updateOrganization = async (req, res) => {
    try {
        const organizationId = req.user.organizationId;

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID not found"
            });
        }

        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;

        const result = await pool.query(
            `
            UPDATE organizations
            SET
                name = $1,
                email = $2,
                phone = $3,
                address = $4,
                city = $5,
                state = $6,
                pincode = $7
            WHERE id = $8
            RETURNING
                id,
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                created_at
            `,
            [
                name,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                organizationId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Organization not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            organization: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE ORGANIZATION ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update organization"
        });
    }
};
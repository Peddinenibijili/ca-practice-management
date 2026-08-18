const pool = require("../config/db");


// ==========================================
// GET CLIENT PROFILE
// ==========================================

exports.getClientProfile = async (req, res) => {

    try {

        const organizationId =
            req.user.organizationId;

        const clientId =
            req.params.id;


        const clientResult =
            await pool.query(
                `
                SELECT *
                FROM clients
                WHERE id = $1
                AND organization_id = $2
                `,
                [
                    clientId,
                    organizationId
                ]
            );


        if (
            clientResult.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "Client not found"

            });

        }


        const client =
            clientResult.rows[0];


        const taxResult =
            await pool.query(
                `
                SELECT *
                FROM client_tax_information
                WHERE client_id = $1
                `,
                [clientId]
            );


        const documentsResult =
            await pool.query(
                `
                SELECT *
                FROM client_documents
                WHERE client_id = $1
                AND document_status = 'active'
                ORDER BY created_at DESC
                `,
                [clientId]
            );


        res.status(200).json({

            client,

            taxInformation:
                taxResult.rows[0] || null,

            documents:
                documentsResult.rows

        });


    } catch (error) {

        console.error(
            "CLIENT PROFILE ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to load client profile"

        });

    }

};
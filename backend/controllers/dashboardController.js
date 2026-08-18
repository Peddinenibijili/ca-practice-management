const pool = require("../config/db");


exports.getDashboardStats = async (req, res) => {

    try {

        console.log(
            "DASHBOARD USER:",
            req.user
        );


        const organizationId =
            req.user.organizationId;


        const result = await pool.query(
            `
            SELECT
                COUNT(*) AS total_clients,

                COUNT(*) FILTER (
                    WHERE status = 'active'
                ) AS active_clients,

                COUNT(*) FILTER (
                    WHERE status = 'inactive'
                ) AS inactive_clients

            FROM clients

            WHERE organization_id = $1
            `,
            [organizationId]
        );


        console.log(
            "DASHBOARD DB RESULT:",
            result.rows[0]
        );


        res.status(200).json({

            clients: {

                total: Number(
                    result.rows[0].total_clients
                ),

                active: Number(
                    result.rows[0].active_clients
                ),

                inactive: Number(
                    result.rows[0].inactive_clients
                )

            }

        });


    } catch (error) {

        console.error(
            "DASHBOARD STATS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to load dashboard statistics."

        });

    }

};
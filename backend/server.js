const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const pool = require("./config/db");

const path = require("path");

const authRoutes =
    require("./routes/authRoutes");

const clientRoutes =
    require("./routes/clientRoutes");

const authenticateToken =
    require("./middleware/authMiddleware");

const dashboardRoutes =
    require("./routes/dashboardRoutes");

const documentRoutes =
    require("./routes/documentRoutes");


dotenv.config();


const app = express();

const PORT =
    process.env.PORT || 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {

    res.json({

        message:
            "CA Practice Management API is running"

    });

});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
    "/api/health",
    async (req, res) => {

        try {

            const result =
                await pool.query(
                    "SELECT NOW()"
                );


            res.json({

                status: "UP",

                message:
                    "Backend and PostgreSQL are working",

                database_time:
                    result.rows[0].now

            });


        } catch (error) {

            console.error(error);


            res.status(500).json({

                status: "DOWN",

                message:
                    "Database connection failed"

            });

        }

    }
);


// =====================================================
// AUTH ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);


// =====================================================
// CLIENT ROUTES
// =====================================================

app.use(
    "/api/clients",
    clientRoutes
);

// =====================================================
// DASHBOARD ROUTES
// =====================================================

app.use(
    "/api/dashboard",
    dashboardRoutes
);

// =====================================================
// SERVE UPLOADS
// =====================================================    

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads"
        )
    )
);


// =====================================================
// DOCUMENT ROUTES
// =====================================================    

app.use(
    "/api",
    documentRoutes
);



// =====================================================
// PROTECTED PROFILE
// =====================================================

app.get(

    "/api/profile",

    authenticateToken,

    async (req, res) => {

        try {

            const result =
                await pool.query(

                    `SELECT
                        id,
                        organization_id,
                        full_name,
                        email,
                        role,
                        created_at
                     FROM users
                     WHERE id = $1`,

                    [req.user.userId]

                );


            if (
                result.rows.length === 0
            ) {

                return res.status(404).json({

                    message:
                        "User not found"

                });

            }


            res.json({

                user:
                    result.rows[0]

            });


        } catch (error) {

            console.error(
                "PROFILE ERROR:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to load profile"

            });

        }

    }

);


// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);
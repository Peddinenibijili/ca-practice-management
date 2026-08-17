const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {

    try {

        // ---------------------------------------------
        // Get Authorization header
        // ---------------------------------------------

        const authHeader =
            req.headers.authorization;


        if (!authHeader) {

            return res.status(401).json({

                message:
                    "Authorization header is missing"

            });

        }


        // ---------------------------------------------
        // Expected:
        // Authorization: Bearer TOKEN
        // ---------------------------------------------

        const parts =
            authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                message:
                    "Invalid authorization format"

            });

        }


        const token = parts[1];


        // ---------------------------------------------
        // Verify JWT
        // ---------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ---------------------------------------------
        // Attach user to request
        // ---------------------------------------------

        req.user = decoded;


        next();


    } catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );


        return res.status(403).json({

            message:
                "Invalid or expired token"

        });

    }

};


module.exports = authenticateToken;
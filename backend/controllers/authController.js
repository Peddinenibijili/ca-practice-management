const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


// =====================================================
// REGISTER USER
// =====================================================

exports.register = async (req, res) => {

    try {

        const {
            organization_id,
            full_name,
            email,
            password,
            role
        } = req.body;


        // ---------------------------------------------
        // 1. Validate input
        // ---------------------------------------------

        if (
            !organization_id ||
            !full_name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "organization_id, full_name, email and password are required"
            });

        }


        // ---------------------------------------------
        // 2. Check organization
        // ---------------------------------------------

        const organization = await pool.query(
            `
            SELECT user_id
            FROM organizations
            WHERE user_id = $1
            `,
            [organization_id]
        );


        if (organization.rows.length === 0) {

            return res.status(400).json({
                message: "Organization not found"
            });

        }


        // ---------------------------------------------
        // 3. Check if user already exists
        // ---------------------------------------------

        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                message: "User already exists"
            });

        }


        // ---------------------------------------------
        // 4. Hash password
        // ---------------------------------------------

        const passwordHash =
            await bcrypt.hash(password, 10);


        // ---------------------------------------------
        // 5. Insert user
        // ---------------------------------------------

        const result = await pool.query(
            `
            INSERT INTO users
            (
                organization_id,
                full_name,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4, $5)

            RETURNING
                id,
                organization_id,
                full_name,
                email,
                role,
                created_at
            `,
            [
                organization_id,
                full_name,
                email,
                passwordHash,
                role || "admin"
            ]
        );


        // ---------------------------------------------
        // 6. Response
        // ---------------------------------------------

        res.status(201).json({

            message:
                "User registered successfully",

            user:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Internal server error during registration"

        });

    }

};



// =====================================================
// LOGIN USER
// =====================================================

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // ---------------------------------------------
        // 1. Validate input
        // ---------------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                message:
                    "Email and password are required"

            });

        }


        // ---------------------------------------------
        // 2. Find user
        // ---------------------------------------------

        const result = await pool.query(
            `
            SELECT
                id,
                organization_id,
                full_name,
                email,
                password_hash,
                role

            FROM users

            WHERE email = $1
            `,
            [email]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        const user = result.rows[0];


        // ---------------------------------------------
        // 3. Compare password
        // ---------------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid email or password"

            });

        }


        // ---------------------------------------------
        // 4. Generate JWT
        // ---------------------------------------------

        const token = jwt.sign(

            {
                userId: user.id,

                organizationId:
                    user.organization_id,

                email:
                    user.email,

                role:
                    user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // ---------------------------------------------
        // 5. Send response
        // ---------------------------------------------

        res.status(200).json({

            message:
                "Login successful",

            token,

            user: {

                id:
                    user.id,

                organization_id:
                    user.organization_id,

                full_name:
                    user.full_name,

                email:
                    user.email,

                role:
                    user.role

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Internal server error during login"

        });

    }

};
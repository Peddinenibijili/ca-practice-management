const pool = require("../config/db");

const fs = require("fs");

const path = require("path");


// ==========================================
// UPLOAD DOCUMENT
// ==========================================

exports.uploadDocument = async (
    req,
    res
) => {

    try {

        const organizationId =
            req.user.organizationId;

        const clientId =
            req.params.id;


        // ----------------------------------
        // CHECK FILE
        // ----------------------------------

        if (!req.file) {

            return res.status(400).json({

                message:
                    "Please select a file."

            });

        }


        // ----------------------------------
        // VERIFY CLIENT BELONGS TO ORG
        // ----------------------------------

        const clientResult =
            await pool.query(

                `
                SELECT
                    id,
                    client_name
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

            // Remove uploaded file
            // because client is invalid

            if (
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlinkSync(
                    req.file.path
                );

            }


            return res.status(404).json({

                message:
                    "Client not found."

            });

        }


        // ----------------------------------
        // DOCUMENT DETAILS
        // ----------------------------------

        const {
            document_name,
            document_type
        } = req.body;


        if (!document_name) {

            if (
                fs.existsSync(
                    req.file.path
                )
            ) {

                fs.unlinkSync(
                    req.file.path
                );

            }


            return res.status(400).json({

                message:
                    "Document name is required."

            });

        }


        // ----------------------------------
        // SAVE DOCUMENT IN DATABASE
        // ----------------------------------

        const result =
            await pool.query(

                `
                INSERT INTO client_documents (

                    client_id,
                    document_name,
                    document_type,
                    file_name,
                    file_path,
                    uploaded_by,
                    document_status,
                    mime_type,
                    file_size

                )

                VALUES (

                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    'active',
                    $7,
                    $8

                )

                RETURNING *
                `,

                [

                    clientId,

                    document_name,

                    document_type || null,

                    req.file.originalname,

                    req.file.path,

                    req.user.userId,

                    req.file.mimetype,

                    req.file.size

                ]

            );


        res.status(201).json({

            message:
                "Document uploaded successfully.",

            document:
                result.rows[0]

        });


    } catch (error) {

        console.error(
            "UPLOAD DOCUMENT ERROR:",
            error
        );


        // Remove file if database insert failed

        if (
            req.file &&
            fs.existsSync(
                req.file.path
            )
        ) {

            fs.unlinkSync(
                req.file.path
            );

        }


        res.status(500).json({

            message:
                "Failed to upload document."

        });

    }

};


// ==========================================
// GET CLIENT DOCUMENTS
// ==========================================

exports.getClientDocuments = async (
    req,
    res
) => {

    try {

        const organizationId =
            req.user.organizationId;

        const clientId =
            req.params.id;


        // Verify client

        const clientResult =
            await pool.query(

                `
                SELECT id
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
                    "Client not found."

            });

        }


        const result =
            await pool.query(

                `
                SELECT

                    id,
                    client_id,
                    document_name,
                    document_type,
                    file_name,
                    file_path,
                    document_status,
                    mime_type,
                    file_size,
                    created_at,
                    updated_at

                FROM client_documents

                WHERE client_id = $1

                AND document_status = 'active'

                ORDER BY created_at DESC
                `,

                [clientId]

            );


        res.status(200).json({

            documents:
                result.rows

        });


    } catch (error) {

        console.error(
            "GET DOCUMENTS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to load documents."

        });

    }

};


// ==========================================
// DELETE DOCUMENT
// ==========================================

exports.deleteDocument = async (
    req,
    res
) => {

    try {

        const organizationId =
            req.user.organizationId;

        const clientId =
            req.params.id;

        const documentId =
            req.params.documentId;


        // Get document + verify organization

        const result =
            await pool.query(

                `
                SELECT

                    d.*

                FROM client_documents d

                INNER JOIN clients c

                    ON c.id = d.client_id

                WHERE d.id = $1

                AND d.client_id = $2

                AND c.organization_id = $3
                `,

                [

                    documentId,

                    clientId,

                    organizationId

                ]

            );


        if (
            result.rows.length === 0
        ) {

            return res.status(404).json({

                message:
                    "Document not found."

            });

        }


        const document =
            result.rows[0];


        // ----------------------------------
        // DELETE PHYSICAL FILE
        // ----------------------------------

        if (
            document.file_path &&
            fs.existsSync(
                document.file_path
            )
        ) {

            fs.unlinkSync(
                document.file_path
            );

        }


        // ----------------------------------
        // DELETE DATABASE RECORD
        // ----------------------------------

        await pool.query(

            `
            DELETE FROM client_documents

            WHERE id = $1
            `,

            [documentId]

        );


        res.status(200).json({

            message:
                "Document deleted successfully."

        });


    } catch (error) {

        console.error(
            "DELETE DOCUMENT ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to delete document."

        });

    }

};
const multer = require("multer");
const path = require("path");
const fs = require("fs");


// ==========================================
// STORAGE CONFIGURATION
// ==========================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        const clientId =
            req.params.id;

        const uploadDirectory =
            path.join(
                __dirname,
                "..",
                "uploads",
                `client-${clientId}`
            );


        // Create directory if it doesn't exist

        fs.mkdirSync(
            uploadDirectory,
            {
                recursive: true
            }
        );


        cb(
            null,
            uploadDirectory
        );

    },


    filename: function (req, file, cb) {

        const extension =
            path.extname(
                file.originalname
            );


        const baseName =
            path.basename(
                file.originalname,
                extension
            )
            .replace(
                /[^a-zA-Z0-9_-]/g,
                "_"
            );


        const uniqueName =
            `${Date.now()}-${baseName}${extension}`;


        cb(
            null,
            uniqueName
        );

    }

});


// ==========================================
// FILE TYPE VALIDATION
// ==========================================

const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/png",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(
            null,
            true
        );

    } else {

        cb(
            new Error(
                "Only PDF, JPG, PNG, DOC, DOCX, XLS and XLSX files are allowed."
            ),
            false
        );

    }

};


// ==========================================
// MULTER INSTANCE
// ==========================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            10 * 1024 * 1024

    }

});


module.exports = upload;
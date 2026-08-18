const express = require("express");

const router = express.Router();


const authMiddleware =
    require("../middleware/authMiddleware");


const upload =
    require("../middleware/uploadMiddleware");


const documentController =
    require("../controllers/documentController");


// ==========================================
// GET DOCUMENTS
// ==========================================

router.get(

    "/clients/:id/documents",

    authMiddleware,

    documentController.getClientDocuments

);


// ==========================================
// UPLOAD DOCUMENT
// ==========================================

router.post(

    "/clients/:id/documents",

    authMiddleware,

    upload.single("document"),

    documentController.uploadDocument

);


// ==========================================
// DELETE DOCUMENT
// ==========================================

router.delete(

    "/clients/:id/documents/:documentId",

    authMiddleware,

    documentController.deleteDocument

);


module.exports = router;
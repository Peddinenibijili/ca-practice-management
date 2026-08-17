const express = require("express");

const {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} = require("../controllers/clientController");

const authenticateToken =
    require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL CLIENTS
router.get(
    "/",
    authenticateToken,
    getClients
);


// GET CLIENT BY ID
router.get(
    "/:id",
    authenticateToken,
    getClientById
);


// CREATE CLIENT
router.post(
    "/",
    authenticateToken,
    createClient
);


// UPDATE CLIENT
router.put(
    "/:id",
    authenticateToken,
    updateClient
);


// DELETE CLIENT
router.delete(
    "/:id",
    authenticateToken,
    deleteClient
);


module.exports = router;
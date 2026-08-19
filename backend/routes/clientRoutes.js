const express = require("express");

const router = express.Router();

const clientController = require("../controllers/clientController");
const authenticateToken = require("../middleware/authMiddleware");
//const authenticateToken = require("../middleware/authenticateToken");authMiddleware

// =====================================================
// AUTHENTICATION
// =====================================================

router.use(authenticateToken);


// Get all clients
router.get(
    "/",
    clientController.getClients
);

// Get single client
router.get(
    "/:id",
    clientController.getClientById
);

// Create client
router.post(
    "/",
    clientController.createClient
);

// Update client
router.put(
    "/:id",
    clientController.updateClient
);

// Delete client
router.delete(
    "/:id",
    clientController.deleteClient
);

module.exports = router;
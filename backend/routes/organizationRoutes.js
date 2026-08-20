const express = require("express");

const router = express.Router();

const organizationController = require("../controllers/organizationController");

const authMiddleware = require("../middleware/authMiddleware");

// Get logged-in user's organization
router.get(
    "/",
    authMiddleware,
    organizationController.getOrganization
);

// Update logged-in user's organization
router.put(
    "/",
    authMiddleware,
    organizationController.updateOrganization
);

module.exports = router;
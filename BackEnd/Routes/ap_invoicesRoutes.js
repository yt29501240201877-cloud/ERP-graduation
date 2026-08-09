const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addAp_invoices, getallAp_invoices, getJAPById, getJAPByStatus, getVendorAgingSummary, updatestatus, getAPSummaryByDate, getAp_invoicesById} = require("../Controllers/ap_invoicesController")
const {trainAI} = require("../Controllers/AI_Model/AP_AI_Model")

router.get("/ap", authenticate, authorize("Accountant"), getAPSummaryByDate);
router.post("/add", authenticate, authorize("Accountant"), addAp_invoices);
router.get("/", authenticate, authorize("Accountant"), getallAp_invoices);
router.get("/all/:id", authenticate, authorize("Accountant"), getJAPById);
router.get("/:id", authenticate, authorize("Accountant"), getAp_invoicesById);
router.get("/:id/aging", authenticate, authorize("Accountant"), getVendorAgingSummary);
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);

router.get("/:status", authenticate, authorize("Accountant"), getJAPByStatus);

router.post("/train", authenticate, authorize("Accountant"),trainAI);

module.exports = router;
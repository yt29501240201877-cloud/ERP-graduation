const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const { addAp_invoiceslines, getallAp_invoices, getAp_invoicesById, updateAp_invoicesline } = require("../Controllers/ap_invoice_linesController")

router.post("/add", authenticate, authorize("Accountant"), addAp_invoiceslines);
router.get("/", authenticate, authorize("Accountant"), getallAp_invoices);
router.get("/:id", authenticate, authorize("Accountant"), getAp_invoicesById);
router.put("/:id", authenticate, authorize("Accountant"), updateAp_invoicesline)

module.exports = router;
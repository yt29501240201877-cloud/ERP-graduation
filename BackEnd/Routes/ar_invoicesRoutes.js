const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addAr_invoices, getallAr_invoices, getJARById, getJARByStatus, getCustomerAging, updatestatus, deleteAR, getARSummaryByDate} = require("../Controllers/ar_invoicesController")

router.get("/ar", authenticate, authorize("Accountant"), getARSummaryByDate);
router.post("/add", authenticate, authorize("Accountant"), addAr_invoices);
router.get("/", authenticate, authorize("Accountant"), getallAr_invoices);
router.get("/all/:id", authenticate, authorize("Accountant"), getJARById);
router.get("/:id/aging", authenticate, authorize("Accountant"), getCustomerAging);
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);

router.get("/:status", authenticate, authorize("Accountant"), getJARByStatus);
router.delete("/:id", authenticate, authorize("Accountant"), deleteAR);

module.exports = router;
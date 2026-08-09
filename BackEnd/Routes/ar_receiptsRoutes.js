const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addAr_receipts, getallAr_receipts, getAr_receiptsBycustomer, getAR_invoicesById} = require("../Controllers/ar_receiptsController")

router.post("/add", authenticate, authorize("Accountant"), addAr_receipts);
router.get("/", authenticate, authorize("Accountant"), getallAr_receipts);
router.get("/all/:id", authenticate, authorize("Accountant"), getAr_receiptsBycustomer);


router.get("/:id", authenticate, authorize("Accountant"), getAR_invoicesById);

module.exports = router;
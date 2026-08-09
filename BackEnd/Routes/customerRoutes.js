const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const { addcustomer, getallCustomer, getCustomerById, updateCustomer, updatestatus } = require("../Controllers/customerController")

router.post("/add", authenticate, authorize("Accountant"), addcustomer);
router.get("/", authenticate, authorize("Accountant"), getallCustomer);
router.get("/:id", authenticate, authorize("Accountant"), getCustomerById);
router.put("/:id", authenticate, authorize("Accountant"), updateCustomer)
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);

module.exports = router;
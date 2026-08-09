const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const { addvendor, getallvendor, getvendorById, updateVendor, updatestatus } = require("../Controllers/vendorsController")

router.post("/add", authenticate, authorize("Accountant"), addvendor);
router.get("/", authenticate, authorize("Accountant"), getallvendor);
router.get("/:id", authenticate, authorize("Accountant"), getvendorById);
router.put("/:id", authenticate, authorize("Accountant"), updateVendor)
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);

module.exports = router;
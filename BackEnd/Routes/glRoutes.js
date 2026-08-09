const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addGlAccount, getallaccounts, updateAccount, deleteaccount, updatestatus} = require("../Controllers/glController")

router.post("/add", authenticate, authorize("Accountant"), addGlAccount);
router.get("/accounts", authenticate, authorize("Accountant"), getallaccounts);
router.put("/:id", authenticate, authorize("Accountant"), updateAccount)
router.delete("/:id", authenticate, authorize("Accountant"), deleteaccount);
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);

module.exports = router;
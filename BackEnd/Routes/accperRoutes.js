const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addaccperiod, getallaccperiods, updatestatus, deleteaccount} = require("../Controllers/accperiodController")

router.post("/add", authenticate, authorize("Admin"), addaccperiod);
router.get("/acc_periods", authenticate, authorize("Accountant"), getallaccperiods);
router.patch("/status/:id", authenticate, authorize("Admin"), updatestatus);
router.delete("/:id", authenticate, authorize("Admin"), deleteaccount);

module.exports = router;
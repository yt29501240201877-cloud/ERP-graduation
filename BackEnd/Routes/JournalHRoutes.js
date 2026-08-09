const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addjnh, getalljnh, getJhById, updateJH, updatestatus, deleteJH} = require("../Controllers/Journal_HeaderController")

router.post("/add", authenticate, authorize("Accountant"), addjnh);
router.get("/getalljnh", authenticate, authorize("Accountant"), getalljnh);
router.get("/:id", authenticate, authorize("Accountant"), getJhById);
router.put("/:id", authenticate, authorize("Accountant"), updateJH)
router.patch("/status/:id", authenticate, authorize("Accountant"), updatestatus);
router.delete("/:id", authenticate, authorize("Accounting Manager"), deleteJH);

module.exports = router;
const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {addjourline, getalljourl, getJlById, updateJL, deleteJL} = require("../Controllers/journal_linesController")

router.post("/add", authenticate, authorize("Accountant"), addjourline);
router.get("/", authenticate, authorize("Accountant"), getalljourl);
router.get("/:id", authenticate, authorize("Accountant"), getJlById);
router.put("/:id", authenticate, authorize("Accountant"), updateJL);
router.delete("/:id", authenticate, authorize("Accounting Manager"), deleteJL);

module.exports = router;
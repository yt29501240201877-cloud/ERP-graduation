const express = require("express")

const router = express.Router();

const authenticate = require("../Middlewares/authenticate");
const authorize = require("../Middlewares/authorize");

const {login, register, logout} = require("../Controllers/authController");
const {getallusers, updaterole, updateUser, deleteUser} = require("../Controllers/userController")
const {getMyNotifications, markAsRead, deleteNotification, markAllAsRead} = require("../Controllers/notificationController");

const {uploadprofileImage} = require("../Middlewares/UploadImage");

router.post("/register", authenticate, authorize("Admin"), uploadprofileImage, register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/my-notifications", authenticate, getMyNotifications);
router.patch("/notifications/read-all", authenticate, markAllAsRead);
router.patch("/notifications/:id/read", authenticate, markAsRead);
router.delete("/notifications/:id", authenticate, deleteNotification);

router.get("/users", authenticate, authorize("Admin"), getallusers);
router.put("/:id", authenticate, authorize("Admin"), updateUser)
router.patch("/:id/role", authenticate, authorize("Admin"), updaterole);
router.delete("/:id", authenticate, authorize("Admin"), deleteUser);

module.exports = router;
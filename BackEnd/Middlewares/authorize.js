const Users = require("../Models/Users")

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        
        if (!req.user.role) {
            return res.status(403).json({ msg: "Access Denied" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Forbidden - Insufficient Role" });
        }

        next();
    };
};

module.exports = authorize;
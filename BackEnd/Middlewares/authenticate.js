const JWT = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Unauthorized - No Token" });
        }

        const token = authHeader.split(" ")[1];

        const decoded = JWT.verify(token, process.env.Secret_Key);

        req.user = decoded;
        
        next();

    } catch (error) {
        return res.status(401).json({ msg: "Invalid or Expired Token" });
    }
};

module.exports = authenticate;
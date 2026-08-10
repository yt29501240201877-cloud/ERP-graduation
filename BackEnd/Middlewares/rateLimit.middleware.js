const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: process.env.NODE_ENV === "development" ? 100 : 3,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
});

module.exports = {authRateLimiter};
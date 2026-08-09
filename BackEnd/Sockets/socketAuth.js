const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if(!token) return next(new Error("Authentication failed"));

        const decoded = jwt.verify(token, process.env.Secret_Key);

        socket.user = decoded;
        next();
    
    } catch (error) {
        return next(new Error("Authentication failed"));
    } 
}

module.exports = {socketAuth};
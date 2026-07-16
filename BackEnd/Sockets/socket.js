const {Server} = require("socket.io");
let io;

const {socketAuth} = require("./socketAuth");

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.use(socketAuth);

    io.on("connection", (socket)=>{
        console.log(`User connected ${socket.id}`);

        socket.on("disconnect", ()=> {
            console.log(`User disconnect ${socket.id}`);
        });
    });

    return io;
}

function getIO(){
    if (!io) {
        throw new Error("Socket.io has not initialized");
    }
    return io;
}

module.exports = {initializeSocket, getIO};
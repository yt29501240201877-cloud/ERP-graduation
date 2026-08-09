const {Server} = require("socket.io");
let io;
const {addUser, removeUser, getOnlineUsers, getUserSockets} = require("./onlineUsers");
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
        addUser(socket.user.id, socket.id);
        console.log(`${socket.user.id} connected`);

        socket.on("disconnect", ()=> {
            removeUser(socket.user.id, socket.id)
            console.log(`${socket.user.id} disconnected`);
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

function sendNotificationToUser(userId, notification) {
    const sockets = getUserSockets(userId);

    sockets.forEach((socketId) => {
        io.to(socketId).emit("notification", notification);
    });
};

module.exports = {initializeSocket, getIO, sendNotificationToUser};
const onlineUsers = new Map();

function addUser(userId, socketId){

    if(!onlineUsers.has(userId)){
        onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socketId);
};

function removeUser(userId, socketId){

    const sockets = onlineUsers.get(userId);

    if(!sockets) return;

    sockets.delete(socketId);

    if(sockets.size === 0){
        onlineUsers.delete(userId);
    }

};

function getUserSockets(userId){

    return onlineUsers.get(userId) || new Set();
};

function getOnlineUsers() {
    return onlineUsers;
}

module.exports = {
    addUser,
    removeUser,
    getUserSockets,
    getOnlineUsers
}
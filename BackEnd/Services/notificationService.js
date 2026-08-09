const Notification = require("../Models/Notification");
const {sendNotificationToUser} = require("../Sockets/socket");

async function createAndSendNotification({recipient, sender, type, entityId, entityType, title, message}) {
    const notification = await Notification.create({
        recipient, 
        sender, 
        type, 
        entityId, 
        entityType, 
        title, 
        message
    });

    sendNotificationToUser(recipient.toString(), notification);

    return notification;
};

module.exports = {createAndSendNotification};
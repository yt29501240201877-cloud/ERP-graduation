const Notification = require("../Models/Notification");

const getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification
            .find({recipient: req.user.id})
            .sort({createdAt: -1})
            .limit(10);

        res.json(notifications);
    } catch(error) {
        res.status(500).json({msg: "Server error", error: error.message});
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {_id: req.params.id, recipient: req.user.id},
            {readAt: new Date()},
            {new: true}
        );

        if(!notification){
            return res.status(404).json({msg: "Notification not found"});
        }

        res.json(notification);
    } catch(error) {
        res.status(500).json({msg: "Server error", error: error.message});
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.id
        });

        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        res.json({ msg: "Notification deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, readAt: null },
            { readAt: new Date() }
        );

        res.json({ msg: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

module.exports = {getMyNotifications, markAsRead, deleteNotification, markAllAsRead};
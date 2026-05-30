import Notification from "../models/Notification.js";

const getNotifications = async (req, res) => {
  try {
    let query = { user: req.user._id };
    if (req.user && req.user.isAdmin) {
      query = {
        $or: [
          { user: req.user._id },
          { user: { $exists: false } },
          { user: null },
        ]
      };
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findById(
    req.params.id
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  notification.read = true;

  await notification.save();

  res.json(notification);
};

export {
  getNotifications,
  markNotificationAsRead,
};
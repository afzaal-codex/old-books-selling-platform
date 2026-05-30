import Notification from "../models/Notification.js";

const createNotification =
  async ({
    user,
    title,
    message,
    type = "general",
  }) => {
    return await Notification.create({
      user,
      title,
      message,
      type,
    });
  };

export default createNotification;
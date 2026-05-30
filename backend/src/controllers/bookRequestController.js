import BookRequest from "../models/BookRequest.js";
import Notification from "../models/Notification.js";

// @desc    Create a new book request
// @route   POST /api/requests
// @access  Public (Optional Auth)
const createRequest = async (req, res) => {
  try {
    const { title, author, name, email, phone, notes } = req.body;

    if (!title || !author || !name || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, author, name, and email",
      });
    }

    const requestData = {
      title,
      author,
      name,
      email,
      phone: phone || "",
      notes: notes || "",
    };

    // If user is authenticated, link their profile
    if (req.user) {
      requestData.user = req.user._id;
    }

    const bookRequest = await BookRequest.create(requestData);

    // Create notification for admin
    try {
      await Notification.create({
        title: "New Book Request",
        message: `A new book request for "${title}" by ${author} has been submitted by ${name}.`,
        type: "system"
      });
    } catch (notifErr) {
      console.error("Failed to create request notification:", notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: "Book request submitted successfully",
      data: bookRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all book requests
// @route   GET /api/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
  try {
    const requests = await BookRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update book request status
// @route   PUT /api/requests/:id
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const bookRequest = await BookRequest.findById(req.params.id);

    if (!bookRequest) {
      return res.status(404).json({
        success: false,
        message: "Book request not found",
      });
    }

    bookRequest.status = status;
    await bookRequest.save();

    res.json({
      success: true,
      message: `Request status updated to ${status}`,
      data: bookRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createRequest,
  getRequests,
  updateRequestStatus,
};

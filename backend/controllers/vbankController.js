import VBankRequest from "../models/VBankRequest.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// @desc    Worker applies for a vBank account
// @route   POST /api/v1/vbank/apply
// @access  Private (Worker only)
export const applyForVBank = async (req, res) => {
  try {
    if (req.user.accountType !== "worker") {
      return res.status(403).json({ message: "Only workers can apply for a vBank account." });
    }

    // Check if already applied
    const existing = await VBankRequest.findOne({ workerId: req.user._id });
    if (existing) {
      return res.status(400).json({
        message: "You have already submitted a vBank account request.",
        request: existing
      });
    }

    const { aadhaarNumber, panNumber, bankPreference } = req.body;

    if (!aadhaarNumber) {
      return res.status(400).json({ message: "Aadhaar number is required." });
    }

    const newRequest = await VBankRequest.create({
      workerId: req.user._id,
      workerName: req.user.name,
      workerPhone: req.user.phone || "",
      workerEmail: req.user.email || "",
      aadhaarNumber,
      panNumber: panNumber || "",
      bankPreference: bankPreference || "No Preference"
    });

    // Notify all admins and cafe owners
    const recipients = await User.find({
      accountType: { $in: ["admin", "cafe"] }
    }).select("_id");

    const notifications = recipients.map((r) => ({
      userId: r._id,
      message: `${req.user.name} has applied for a virtual bank account. Review their request.`,
      type: "INFO",
      link: "/admin-dashboard"
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);

      // Emit socket events to all recipients
      const io = req.app.get("io");
      if (io) {
        recipients.forEach((r) => {
          io.to(r._id.toString()).emit("notification", {
            message: `${req.user.name} has applied for a virtual bank account.`,
            type: "INFO"
          });
        });
      }
    }

    res.status(201).json({
      message: "Your vBank account request has been submitted. Admin and cafe owners have been notified.",
      request: newRequest
    });
  } catch (error) {
    console.error("Error applying for vBank:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Worker gets their own vBank request status
// @route   GET /api/v1/vbank/my-request
// @access  Private (Worker only)
export const getMyVBankRequest = async (req, res) => {
  try {
    const request = await VBankRequest.findOne({ workerId: req.user._id });
    if (!request) {
      return res.status(404).json({ message: "No vBank request found." });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching vBank request:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Admin / Cafe gets all vBank requests
// @route   GET /api/v1/vbank/all
// @access  Private (Admin or Cafe)
export const getAllVBankRequests = async (req, res) => {
  try {
    const { accountType } = req.user;
    if (accountType !== "admin" && accountType !== "cafe") {
      return res.status(403).json({ message: "Not authorized." });
    }
    const requests = await VBankRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching all vBank requests:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// @desc    Admin approves or rejects a vBank request
// @route   PUT /api/v1/vbank/:id/status
// @access  Private (Admin only)
export const updateVBankStatus = async (req, res) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(403).json({ message: "Not authorized as an admin." });
    }

    const { status, adminNotes } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be 'approved' or 'rejected'." });
    }

    const request = await VBankRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }

    request.status = status;
    request.adminNotes = adminNotes || "";
    await request.save();

    // Notify the worker
    await Notification.create({
      userId: request.workerId,
      message: status === "approved"
        ? "🎉 Your vBank account request has been approved! We will contact you shortly."
        : `Your vBank account request was rejected. ${adminNotes ? "Note: " + adminNotes : ""}`,
      type: status === "approved" ? "SUCCESS" : "WARNING",
      link: "/vbank-account"
    });

    const io = req.app.get("io");
    if (io) {
      io.to(request.workerId.toString()).emit("notification", {
        message: status === "approved" ? "Your vBank request was approved!" : "Your vBank request was rejected.",
        type: status === "approved" ? "SUCCESS" : "WARNING"
      });
    }

    res.status(200).json({ message: `Request ${status} successfully.`, request });
  } catch (error) {
    console.error("Error updating vBank status:", error);
    res.status(500).json({ message: "Server error." });
  }
};

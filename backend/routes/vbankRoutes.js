import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { applyForVBank, getMyVBankRequest, getAllVBankRequests, updateVBankStatus } from "../controllers/vbankController.js";

const router = express.Router();

router.post("/apply", protect, applyForVBank);
router.get("/my-request", protect, getMyVBankRequest);
router.get("/all", protect, getAllVBankRequests);
router.put("/:id/status", protect, updateVBankStatus);

export default router;

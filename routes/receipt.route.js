
import express  from "express"
const router = express.Router();
import { createReceipt,getAll,getAllReceipts, getReceiptById, printAllReceipts, printReceipt } from "../controllers/receipt.controller.js";
import { adminOnly } from "../middlewares/authMiddleware.js";



// admin only can print
router.get("/print/:id", printReceipt);
router.get("/printAll", adminOnly, printAllReceipts)


router.post("/", createReceipt);
router.get("/", adminOnly, getAllReceipts);
router.get("/receipts", adminOnly, getAll);
router.get("/:id", adminOnly, getReceiptById);
router.get("/print/:id", adminOnly, printReceipt);

export {router as receiptRouter };

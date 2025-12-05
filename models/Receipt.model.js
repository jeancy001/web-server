
import mongoose from "mongoose";

const ReceiptSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  training: String,
  amount: String,
  currency: String,
  receiptNumber: String,
  date: String,
  notes: String,
}, { timestamps: true });
export const Receipt = mongoose.model("Receipt", ReceiptSchema);

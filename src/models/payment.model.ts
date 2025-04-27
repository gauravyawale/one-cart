import mongoose, { Schema, Document, Model, Types } from "mongoose";

// 1. Create a schema for Payment Attempt
interface IPaymentAttempt {
  attemptNumber: number;
  provider: "razorpay" | "stripe" | "paypal";
  status: "pending" | "succeeded" | "failed";
  paymentId: string; // payment gateway transaction ID
  amount: number;
}

// 2. Create an interface for Payment Document
export interface IPayment extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  attempts: IPaymentAttempt[];
  currentStatus: "pending" | "succeeded" | "failed";
}

// 3. Define the schema for Payment Attempt
const PaymentAttemptSchema = new Schema<IPaymentAttempt>(
  {
    attemptNumber: { type: Number, required: true },
    provider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"],
      required: true,
    },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: false }
);

// 4. Define the schema for Payment
const PaymentSchema = new Schema<IPayment>({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  attempts: [PaymentAttemptSchema],
  currentStatus: {
    type: String,
    enum: ["pending", "succeeded", "failed"],
    default: "pending",
  },
});

// 5. Create the Payment model
const PaymentModel: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  PaymentSchema
);

// 6. Export the model
export default PaymentModel;

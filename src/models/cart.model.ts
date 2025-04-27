import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { IUser } from "./user.model";
import { IProduct } from "./product.model";

// 1. Define an interface for CartItem
interface ICartItem {
  productId: Types.ObjectId | IProduct; // reference to the Product model
  quantity: number;
}

// 2. Define an interface for Cart document
export interface ICart extends Document {
  userId: Types.ObjectId | IUser; // reference to the User model
  items: ICartItem[];
}

// 3. Define CartItem Schema (nested inside Cart)
const cartItemSchema: Schema<ICartItem> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false } // Prevents Mongoose from creating separate _id for each item
);

// 4. Define the Cart Schema
const cartSchema: Schema<ICart> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// 5. Create the Model
const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;

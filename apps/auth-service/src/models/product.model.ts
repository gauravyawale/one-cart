import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { IUser } from './user.model';

// 1. Define an interface for Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[]; // array of image URLs
  sellerId: Types.ObjectId | IUser; // reference to the User model
}

// 2. Define a schema for Product
const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // reference to the User collection
      required: true,
    },
  },
  { timestamps: true },
);

// 3. Create the model for Product
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

// 4. Export the model
export default Product;

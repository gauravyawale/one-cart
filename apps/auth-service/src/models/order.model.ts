import mongoose, { Schema, Model, Document, Types } from 'mongoose';

// 1. Define an interface for OrderItem
interface IOrderItem {
  productId: Types.ObjectId; // reference to the Product model
  quantity: number;
  name: string;
  price: number;
}

// 2. Define an interface for ShippingAddress
interface IShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
}

// 3. Define an interface for Order Document
export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

// 4. Define the OrderItem Schema (nested inside Order)
const orderItemSchema: Schema<IOrderItem> = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// 5. Define the ShippingAddress Schema
const shippingAddressSchema: Schema<IShippingAddress> = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

// 6. Define the Order Schema
const orderSchema: Schema<IOrder> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
});

// 7. Create the Order Model
const Order: Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

// 8. Export the Order Model
export default Order;

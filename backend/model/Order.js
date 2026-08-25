import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    productName: String,
    unit: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer is required'],
    },
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer is required'],
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryAddress: {
      type: String,
      default: '',
    },
    deliveryMethod: {
      type: String,
      default: 'Direct Farm Pickup / Local Delivery',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'PROCESSING',
        'READY_FOR_DELIVERY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Order', orderSchema);

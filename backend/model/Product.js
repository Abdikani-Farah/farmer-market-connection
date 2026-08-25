import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const productSchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer is required'],
    },
    farm: {
      type: Schema.Types.ObjectId,
      ref: 'Farm',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    unit: {
      type: String,
      default: 'kg',
      trim: true,
    },
    location: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    harvestDate: {
      type: Date,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Product', productSchema);

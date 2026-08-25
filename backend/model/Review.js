import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const reviewSchema = new Schema(
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
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order is required'],
      unique: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Review', reviewSchema);

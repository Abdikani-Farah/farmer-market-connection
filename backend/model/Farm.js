import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const farmSchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer reference is required'],
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    region: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: '',
    },
    farmSize: {
      type: String,
      default: '',
    },
    crops: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model('Farm', farmSchema);

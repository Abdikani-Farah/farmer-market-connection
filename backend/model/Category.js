import mongoosePkg from 'mongoose';
const { Schema, model } = mongoosePkg;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default model('Category', categorySchema);

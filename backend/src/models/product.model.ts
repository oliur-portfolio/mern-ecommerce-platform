import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  isFeatured: boolean;
  images: {
    url: string;
    publicId: string;
  }[];
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [
        {
          url: {
            type: String,
          },
          publicId: {
            type: String,
          },
        },
      ],
      default: [],
      validate: {
        validator: function (value: IProduct["images"]) {
          return value.length <= 5;
        },
        message: "You can upload maximum 5 images",
      },
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;

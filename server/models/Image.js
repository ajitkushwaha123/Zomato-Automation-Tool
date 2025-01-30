import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    dominantColors: {
      type: Array,
      required: true,
    },
    featureVector: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Image", ImageSchema);

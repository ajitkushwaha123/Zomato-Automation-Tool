import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description : {
      type: String,
    },
    image : {
        type : String,
    },
    category : {
        type : String,
    },
    subCategory : {
        type : String,
    },
    foodType : {
        type : String,
    },
    variants : [],
    itemType : {
        type : String,
    },
    base_price : {
        type : Number,
    },
  },
  { timestamps: true }
);

const product = mongoose.model('Product' , productSchema);
export default product;
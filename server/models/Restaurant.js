import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    logo: {
      type: String,
    },
    contactDetails: {
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: "India" },
      },
      website: {
        type: String,
      },
    },
    operationalHours: {
      openingTime: {
        type: String,
      },
      closingTime: {
        type: String,
      },
    },
    tableSetup: [
      {
        floor: {
          type: Number, 
        },
        section: {
          type: String, 
        },
        tables: [
          {
            tableNumber: {
              type: Number,
            },
            capacity: {
              type: Number,
            },
            isAvailable: {
              type: Boolean,
              default: true, 
            },
            reservedBy: {
              type: String, 
              default: null,
            },
          },
        ],
      },
    ],
    features: {
      isVegetarianOnly: {
        type: Boolean,
        default: false,
      },
      hasAlcohol: {
        type: Boolean,
        default: false,
      },
      hasParking: {
        type: Boolean,
        default: false,
      },
      isPetFriendly: {
        type: Boolean,
        default: false,
      },
      deliveryAvailable: {
        type: Boolean,
        default: true,
      },
      dineInAvailable: {
        type: Boolean,
        default: true,
      },
    },
    socialMedia: {
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      twitter: {
        type: String,
      },
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    gstDetails: {
      gstNumber: {
        type: String,
        unique: true,
        match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // GSTIN format
      },
      registrationDate: {
        type: Date,
      },
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const restaurant = mongoose.model('Restaurant' , restaurantSchema);
export default restaurant;
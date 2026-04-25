const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    // 🔄 PURPOSE
    purpose: {
      type: String,
      enum: ["Rent", "Sale", "Resale"],
      required: true,
      index: true,
    },

    // 🏢 CATEGORY
    propertyCategory: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "House",
        "Studio",
        "Shop",
        "Office",
        "Godown",
        "Plot",
        "Land",
        "RowHouse",
        "Bunglow",
      ],
      required: true,
      index: true,
    },

    // 🏷️ BASIC INFO
    propertyName: {
      type: String,
      required: true,
      trim: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    // 📍 LOCATION
    location: {
      type: String,
      required: true,
    },

    city: String,
    state: String,

    // 💰 PRICING
    price: {
      type: Number,
      required: true,
      index: true,
    },

    expectedPrice: Number,

    // 🏠 DETAILS
    flatType: String,
    bedrooms: Number,
    bathrooms: Number,
    floor: String,
    totalFloors: Number,

    furnishing: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
    },

    facing: {
      type: String,
      enum: ["East", "West", "North", "South"],
    },

    // 📏 AREA
    area: {
      type: Number,
      required: true,
    },

    carpetArea: Number,

    // 💧 UTILITIES
    waterSupply: {
      type: String,
      enum: ["24/7", "Borewell", "Municipal", "Limited"],
    },

    powerBackup: {
      type: Boolean,
      default: false,
    },

    loanAvailable: {
      type: Boolean,
      default: false,
    },

    // 🏢 AMENITIES
    amenities: {
      type: [String],
      default: [],
    },

    // 📞 CONTACT
    contact: {
      ownerName: String,
      phone: String,
      email: String,
    },

    // 📸 IMAGES
    images: {
      type: [String],
      default: [],
    },

    // 🏢 UNITS
    units: [
      {
        number: {
          type: String,
          trim: true,
        },
        status: {
          type: String,
          enum: ["available", "booked"],
          default: "available",
        },
      },
    ],

    // 📊 STATUS
    status: {
      type: String,
      enum: ["available", "limited", "soldout"],
      default: "available",
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    overview: {
      type: String,
      default: "",
    },

    aboutProperty: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);



// 🔥 IMPORTANT FIX (THIS WAS MISSING)
module.exports = mongoose.model("Property", propertySchema);
const Property = require("../models/Property");
const mongoose = require("mongoose");

// ===============================
// 🟢 CREATE PROPERTY (FINAL FIX)
// ===============================
exports.createProperty = async (req, res) => {
  try {
    console.log("\n🚀 CREATE PROPERTY HIT");
    console.log("📦 RAW BODY:", req.body);
    console.log("📸 FILES:", req.files);

    const {
      propertyName,
      ownerName,
      location,
      city,
      state,
      propertyCategory,
      purpose,
      price,
      expectedPrice,
      area,
      carpetArea,
      furnishing,
      waterSupply,
      powerBackup,
      loanAvailable,
      amenities,
      overview,
      aboutProperty,
      units,
      contact,
    } = req.body;

    // ===============================
    // ❌ VALIDATION
    // ===============================
    if (!propertyName || !location || !propertyCategory || !purpose || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ===============================
    // 📸 IMAGES
    // ===============================
    let images = [];
    if (req.files?.length) {
      images = req.files.map(
        (file) =>
          `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${file.filename}`
      );
    }

    // ===============================
    // 📞 CONTACT PARSE SAFE
    // ===============================
    let parsedContact = {};
    try {
      parsedContact =
        typeof contact === "string" ? JSON.parse(contact) : contact || {};
    } catch {
      parsedContact = {};
    }

    // ===============================
    // 🏢 UNITS (🔥 FINAL FIX LOGIC)
    // ===============================
    let parsedUnits = [];

    console.log("🏢 RAW UNITS:", units);

    try {
      if (!units) {
        parsedUnits = [];
      }

      // CASE 1: string → JSON
      else if (typeof units === "string") {
        parsedUnits = JSON.parse(units);
      }

      // CASE 2: already array
      else if (Array.isArray(units)) {
        parsedUnits = units;
      }

      console.log("📦 AFTER PARSE:", parsedUnits);

      // 🔥 CLEAN FORMAT
      parsedUnits = parsedUnits
        .map((u) => ({
          number: String(u.number || "").trim(),
          status: u.status === "booked" ? "booked" : "available",
        }))
        .filter((u) => u.number !== "");

    } catch (err) {
      console.log("❌ UNITS PARSE ERROR:", err.message);
      parsedUnits = [];
    }

    console.log("🏢 FINAL UNITS:", parsedUnits);

    // ===============================
    // 📊 UNIT CALCULATION
    // ===============================
    const totalUnits = parsedUnits.length;

    const availableUnits = parsedUnits.filter(
      (u) => u.status === "available"
    ).length;

    const bookedUnits = totalUnits - availableUnits;

    console.log("📊 UNIT STATS:", {
      totalUnits,
      availableUnits,
      bookedUnits,
    });

    // ===============================
    // 🔥 STATUS LOGIC
    // ===============================
    let finalStatus = "available";

    if (totalUnits > 0) {
      if (availableUnits === 0) finalStatus = "soldout";
      else if (availableUnits <= 2) finalStatus = "limited";
    }

    console.log("🔥 FINAL STATUS:", finalStatus);

    // ===============================
    // 📦 FINAL DATA
    // ===============================
    const propertyData = {
      propertyName: propertyName?.trim(),
      ownerName: ownerName || "",
      location,
      city: city || "",
      state: state || "",
      propertyCategory,
      purpose,

      price: Number(price) || 0,
      expectedPrice: Number(expectedPrice) || 0,
      area: Number(area) || 0,
      carpetArea: Number(carpetArea) || 0,

      furnishing: furnishing || "",
      waterSupply: waterSupply || "",

      powerBackup: Boolean(powerBackup),
      loanAvailable: Boolean(loanAvailable),

      amenities: Array.isArray(amenities)
        ? amenities
        : amenities
        ? [amenities]
        : [],

      overview: overview || "",
      aboutProperty: aboutProperty || "",

      units: parsedUnits,
      status: finalStatus,

      contact: parsedContact,
      images,
    };

    console.log("📦 FINAL DATA READY");

    const property = await Property.create(propertyData);

    console.log("✅ CREATED:", property._id);

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });

  } catch (err) {
    console.log("❌ CREATE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
// ===============================
// 📥 GET ALL PROPERTIES (ADVANCED SAFE FILTER)
// ===============================
exports.getProperties = async (req, res) => {
  try {
    const query = {};

    // 🔍 SEARCH
    if (req.query.search) {
      query.$or = [
        { propertyName: { $regex: req.query.search, $options: "i" } },
        { location: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // 🎯 FILTERS
    if (req.query.purpose) query.purpose = req.query.purpose;
    if (req.query.propertyCategory) query.propertyCategory = req.query.propertyCategory;
    if (req.query.city) query.city = req.query.city;

    // 💰 PRICE FILTER SAFE
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // 📏 AREA FILTER SAFE
    if (req.query.minArea || req.query.maxArea) {
      query.area = {};
      if (req.query.minArea) query.area.$gte = Number(req.query.minArea);
      if (req.query.maxArea) query.area.$lte = Number(req.query.maxArea);
    }

    // 📄 PAGINATION SAFE
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    // 🔽 SORT
    let sort = { createdAt: -1 };
    if (req.query.sort === "price_low") sort = { price: 1 };
    if (req.query.sort === "price_high") sort = { price: -1 };

    const properties = await Property.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sort);

    const total = await Property.countDocuments(query);

    return res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (err) {
    console.error("❌ GET ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// 🔍 SINGLE PROPERTY
// ===============================
// exports.getSingleProperty = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);

//     if (!property) {
//       return res.status(404).json({
//         success: false,
//         message: "Property not found",
//       });
//     }

//     return res.json({
//       success: true,
//       data: property,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };


exports.getSingleProperty = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("📌 Property ID:", id);

    // ❌ ID missing check
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    // ❌ Invalid ObjectId check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID format",
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      data: property,
    });

  } catch (err) {
    console.error("❌ GET SINGLE PROPERTY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
// ===============================
// ✏️ UPDATE PROPERTY (SAFE)
// ===============================
exports.updateProperty = async (req, res) => {
  try {
    let updateData = { ...req.body };

    // 📸 IMAGES
    if (req.files?.length) {
      updateData.images = req.files.map(
        (file) =>
          `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${file.filename}`
      );
    }

    // 🔢 SAFE CONVERSIONS
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.area) updateData.area = Number(updateData.area);
    if (updateData.totalUnits) updateData.totalUnits = Number(updateData.totalUnits);
    if (updateData.availableUnits)
      updateData.availableUnits = Number(updateData.availableUnits);

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      message: "Updated successfully",
      data: property,
    });
  } catch (err) {
    console.error("❌ UPDATE ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// ❌ DELETE PROPERTY
// ===============================
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    console.error("❌ DELETE ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



exports.bookFlat = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);

    // ❌ NOT FOUND
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // ❌ NO UNITS AVAILABLE
    if (property.availableUnits <= 0) {
      return res.status(400).json({
        success: false,
        message: "No units available to book",
      });
    }

    // 👤 USER INFO (optional future use)
    const userId = req.user?.id;

    // 🧠 UPDATE LOGIC
    property.availableUnits -= 1;
    property.bookedUnits = (property.bookedUnits || 0) + 1;

    // 📊 STATUS AUTO UPDATE
    if (property.availableUnits === 0) {
      property.status = "soldout";
    } else if (property.availableUnits <= 2) {
      property.status = "limited";
    } else {
      property.status = "available";
    }

    await property.save();

    return res.json({
      success: true,
      message: "Property booked successfully",
      data: property,
    });
  } catch (err) {
    console.error("❌ BOOK ERROR:", err.message);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
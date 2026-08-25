import Farm from '../model/Farm.js';
import User from '../model/User.js';
import Product from '../model/Product.js';
import Review from '../model/Review.js';

// @desc    Get all farms (with search & filter)
// @route   GET /api/farms
export const getFarms = async (req, res, next) => {
  try {
    const { search, region, district, isVerified } = req.query;
    const filter = {};

    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';
    if (region) filter.region = { $regex: region, $options: 'i' };
    if (district) filter.district = { $regex: district, $options: 'i' };

    if (search) {
      filter.$or = [
        { farmName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { crops: { $regex: search, $options: 'i' } },
      ];
    }

    const farms = await Farm.find(filter)
      .populate('farmer', 'name email phone location profileImage')
      .sort({ isVerified: -1, createdAt: -1 });

    // Calculate ratings and product counts for each farm
    const enrichedFarms = await Promise.all(
      farms.map(async (f) => {
        const farmObj = f.toObject();
        const productCount = await Product.countDocuments({ farmer: f.farmer?._id, status: 'PUBLISHED' });
        const reviews = await Review.find({ farmer: f.farmer?._id });
        const avgRating =
          reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 4.8; // Default initial positive rating
        return {
          ...farmObj,
          productCount,
          rating: avgRating,
          reviewCount: reviews.length,
        };
      })
    );

    res.json({
      success: true,
      count: enrichedFarms.length,
      data: enrichedFarms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single farm by id
// @route   GET /api/farms/:id
export const getFarmById = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id).populate(
      'farmer',
      'name email phone location profileImage createdAt'
    );

    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const products = await Product.find({
      farmer: farm.farmer?._id,
      status: 'PUBLISHED',
    }).populate('category');

    const reviews = await Review.find({ farmer: farm.farmer?._id })
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    res.json({
      success: true,
      data: {
        ...farm.toObject(),
        products,
        reviews,
        rating: avgRating,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current farmer's farm
// @route   GET /api/farms/me
export const getMyFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findOne({ farmer: req.user._id });
    if (!farm) {
      // Auto create if does not exist
      farm = await Farm.create({
        farmer: req.user._id,
        farmName: `${req.user.name}'s Farm`,
        location: req.user.location || 'Afgooye Agricultural Valley',
        region: 'Lower Shabelle',
        district: 'Afgooye',
      });
    }

    res.json({
      success: true,
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new Farm
// @route   POST /api/farms
export const createFarm = async (req, res, next) => {
  try {
    const existing = await Farm.findOne({ farmer: req.user._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Farmer already has a registered farm. Please update the existing profile.',
      });
    }

    const { farmName, description, location, region, district, farmSize, crops, images } = req.body;

    const farm = await Farm.create({
      farmer: req.user._id,
      farmName: farmName || `${req.user.name}'s Farm`,
      description,
      location: location || req.user.location,
      region,
      district,
      farmSize,
      crops: Array.isArray(crops) ? crops : crops ? crops.split(',').map((c) => c.trim()) : [],
      images: Array.isArray(images) ? images : images ? [images] : [],
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: 'Farm profile created successfully',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Farm
// @route   PUT /api/farms/:id
export const updateFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    // Must be owner or admin
    if (farm.farmer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this farm' });
    }

    const { farmName, description, location, region, district, farmSize, crops, images, isVerified } = req.body;

    if (farmName) farm.farmName = farmName;
    if (description !== undefined) farm.description = description;
    if (location) farm.location = location;
    if (region) farm.region = region;
    if (district) farm.district = district;
    if (farmSize) farm.farmSize = farmSize;
    if (crops !== undefined) {
      farm.crops = Array.isArray(crops) ? crops : crops.split(',').map((c) => c.trim());
    }
    if (images !== undefined) {
      farm.images = Array.isArray(images) ? images : [images];
    }

    // Only admin can toggle verification
    if (isVerified !== undefined && req.user.role === 'ADMIN') {
      farm.isVerified = isVerified;
    }

    await farm.save();

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete farm (Owner/Admin)
// @route   DELETE /api/farms/:id
export const deleteFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    if (farm.farmer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Farm profile deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Verify / Unverify farm
// @route   PUT /api/farms/:id/verify
export const toggleFarmVerification = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    farm.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !farm.isVerified;
    await farm.save();

    res.json({
      success: true,
      message: farm.isVerified ? 'Farm verified successfully' : 'Farm verification removed',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

import Order from '../model/Order.js';
import Product from '../model/Product.js';
import Farm from '../model/Farm.js';
import Review from '../model/Review.js';

export const getFarmerStats = async (req, res, next) => {
  try {
    const farmerId = req.user._id;
    const [totalProducts, totalOrders, pendingOrders, completedOrders, revenueAggregate, reviews] = await Promise.all([
      Product.countDocuments({ farmer: farmerId }),
      Order.countDocuments({ farmer: farmerId }),
      Order.countDocuments({ farmer: farmerId, status: 'PENDING' }),
      Order.countDocuments({ farmer: farmerId, status: { $in: ['COMPLETED', 'DELIVERED'] } }),
      Order.aggregate([
        { $match: { farmer: farmerId, status: { $in: ['COMPLETED', 'DELIVERED', 'PAID', 'ACCEPTED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]),
      Review.find({ farmer: farmerId }),
    ]);
    const rating = reviews.length
      ? Number((reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1))
      : 4.9;

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: revenueAggregate.length ? Number(revenueAggregate[0].totalRevenue.toFixed(2)) : 0,
        rating,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFarmerOrders = async (req, res, next) => {
  try {
    const filter = { farmer: req.user._id };
    if (req.query.status && req.query.status !== 'ALL') {
      filter.status = req.query.status.toUpperCase();
    }
    const orders = await Order.find(filter)
      .populate('buyer', 'name email phone location profileImage')
      .populate('farmer', 'name email phone location profileImage')
      .populate('items.product', 'name images unit price location')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getFarmerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ farmer: req.user._id })
      .populate('category', 'name slug icon')
      .populate('farm', 'farmName location isVerified')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getFarmerFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findOne({ farmer: req.user._id });
    if (!farm) {
      farm = await Farm.create({
        farmer: req.user._id,
        farmName: `${req.user.name}'s Farm`,
        location: req.user.location || 'Afgooye Agricultural Valley',
        region: 'Lower Shabelle',
        district: 'Afgooye',
        crops: ['Tomatoes', 'Watermelons', 'Bananas'],
        isVerified: false,
      });
    }
    res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
};

export const updateFarmerFarm = async (req, res, next) => {
  try {
    let farm = await Farm.findOne({ farmer: req.user._id });
    if (!farm) {
      farm = new Farm({ farmer: req.user._id });
    }
    const { farmName, description, location, region, district, farmSize, crops, images } = req.body;
    if (farmName) farm.farmName = farmName;
    if (description !== undefined) farm.description = description;
    if (location) farm.location = location;
    if (region) farm.region = region;
    if (district) farm.district = district;
    if (farmSize) farm.farmSize = farmSize;
    if (crops !== undefined) farm.crops = Array.isArray(crops) ? crops : crops.split(',').map((crop) => crop.trim()).filter(Boolean);
    if (images !== undefined) farm.images = Array.isArray(images) ? images : [images].filter(Boolean);
    await farm.save();
    res.json({ success: true, message: 'Farm profile saved successfully', data: farm });
  } catch (error) {
    next(error);
  }
};

import User from '../model/User.js';
import Farm from '../model/Farm.js';
import Product from '../model/Product.js';
import Order from '../model/Order.js';
import Review from '../model/Review.js';

const salesStatuses = ['COMPLETED', 'DELIVERED', 'PAID', 'ACCEPTED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'];

const buildStats = async () => {
  const [totalUsers, totalFarmers, totalBuyers, totalFarms, totalProducts, totalOrders, pendingOrders, completedOrders, salesAggregate] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'FARMER' }),
      User.countDocuments({ role: 'BUYER' }),
      Farm.countDocuments(),
      Product.countDocuments({ status: 'PUBLISHED' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'PENDING' }),
      Order.countDocuments({ status: { $in: ['COMPLETED', 'DELIVERED'] } }),
      Order.aggregate([
        { $match: { status: { $in: salesStatuses } } },
        { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
      ]),
    ]);

  return {
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalFarms,
    totalProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSales: salesAggregate.length > 0 ? Number(salesAggregate[0].totalSales.toFixed(2)) : 0,
  };
};

export const getPlatformStats = async (req, res, next) => {
  try {
    res.json({ success: true, data: await buildStats() });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = getPlatformStats;

export const getAdminFarms = async (req, res, next) => {
  try {
    const farms = await Farm.find()
      .populate('farmer', 'name email phone location profileImage')
      .sort({ createdAt: -1 });

    const enrichedFarms = await Promise.all(
      farms.map(async (farm) => {
        const [productCount, reviews] = await Promise.all([
          Product.countDocuments({ farmer: farm.farmer?._id }),
          Review.find({ farmer: farm.farmer?._id }),
        ]);
        const rating = reviews.length
          ? Number((reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1))
          : 4.8;
        return { ...farm.toObject(), productCount, rating, reviewCount: reviews.length };
      })
    );

    res.json({ success: true, data: enrichedFarms });
  } catch (error) {
    next(error);
  }
};

export const verifyFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    farm.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : !farm.isVerified;
    await farm.save();
    res.json({
      success: true,
      message: farm.isVerified ? 'Farm successfully verified' : 'Farm verification revoked',
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email phone location profileImage')
      .populate('farmer', 'name email phone location profileImage')
      .populate('items.product', 'name images unit price location')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, isBlocked } = req.query;
    const filter = {};
    if (role) filter.role = role.toUpperCase();
    if (isBlocked !== undefined) filter.isBlocked = isBlocked === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot suspend administrator account' });
    }

    const active = req.body.isActive;
    user.isBlocked = active === undefined ? !user.isBlocked : !active;
    await user.save();
    res.json({
      success: true,
      message: user.isBlocked ? 'User account suspended' : 'User account activated',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot block administrator account' });
    }

    user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : !user.isBlocked;
    await user.save();
    res.json({
      success: true,
      message: user.isBlocked ? 'User has been blocked' : 'User unblocked successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot delete administrator account' });
    }

    await Promise.all([
      Farm.deleteMany({ farmer: user._id }),
      Product.deleteMany({ farmer: user._id }),
      User.findByIdAndDelete(req.params.id),
    ]);
    res.json({ success: true, message: 'User and associated data removed' });
  } catch (error) {
    next(error);
  }
};

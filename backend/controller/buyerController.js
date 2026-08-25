import Order from '../model/Order.js';

export const getBuyerStats = async (req, res, next) => {
  try {
    const buyerId = req.user._id;
    const [totalOrders, pendingOrders, activeOrders, completedOrders, spendAggregate] = await Promise.all([
      Order.countDocuments({ buyer: buyerId }),
      Order.countDocuments({ buyer: buyerId, status: 'PENDING' }),
      Order.countDocuments({ buyer: buyerId, status: { $in: ['ACCEPTED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'] } }),
      Order.countDocuments({ buyer: buyerId, status: { $in: ['COMPLETED', 'DELIVERED'] } }),
      Order.aggregate([
        { $match: { buyer: buyerId, status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, totalSpent: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        activeOrders,
        completedOrders,
        totalSpent: spendAggregate.length ? Number(spendAggregate[0].totalSpent.toFixed(2)) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getBuyerOrders = async (req, res, next) => {
  try {
    const filter = { buyer: req.user._id };
    if (req.query.status && req.query.status !== 'ALL') {
      filter.status = req.query.status.toUpperCase();
    }

    const orders = await Order.find(filter)
      .populate('farmer', 'name email phone location profileImage')
      .populate('items.product', 'name images unit price location description')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

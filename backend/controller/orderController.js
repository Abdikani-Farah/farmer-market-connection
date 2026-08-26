import Order from '../model/Order.js';
import Product from '../model/Product.js';
import User from '../model/User.js';

const PAYMENT_METHODS = ['EVC_PLUS', 'SAAD', 'E_DAHAB'];

const getPopulatedOrder = (orderId) =>
  Order.findById(orderId)
    .populate('buyer', 'name email phone location')
    .populate('farmer', 'name email phone location')
    .populate('paymentConfirmedBy', 'name')
    .populate('items.product', 'name images unit price');

// @desc    Create new order (Buyer requests product)
// @route   POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { productId, quantity, deliveryAddress, deliveryMethod, notes, paymentMethod } = req.body;

    if (!productId || !quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid product and quantity required',
      });
    }

    if (paymentMethod && !PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Choose EVC Plus, SAAD, or e-Dahab' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.quantity} ${product.unit})`,
      });
    }

    // Calculate total
    const totalAmount = Number((product.price * Number(quantity)).toFixed(2));

    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.farmer,
      items: [
        {
          product: product._id,
          productName: product.name,
          unit: product.unit,
          quantity: Number(quantity),
          price: product.price,
        },
      ],
      totalAmount,
      deliveryAddress: deliveryAddress || req.user.location || 'Local Pickup Point',
      deliveryMethod: deliveryMethod || 'Direct Farm Pickup / Local Delivery',
      notes: notes || '',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: paymentMethod || null,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email phone location')
      .populate('farmer', 'name email phone location')
      .populate('items.product', 'name images unit price');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! The farmer will review and accept your request.',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders (Role-filtered: Farmer sees received orders, Buyer sees placed orders, Admin sees all)
// @route   GET /api/orders
export const getOrders = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    const filter = {};

    if (req.user.role === 'FARMER') {
      filter.farmer = req.user._id;
    } else if (req.user.role === 'BUYER') {
      filter.buyer = req.user._id;
    } else if (req.user.role === 'ADMIN') {
      // Admin can see all, or filter by role param if desired
      if (role === 'FARMER') filter.farmer = req.query.userId;
      if (role === 'BUYER') filter.buyer = req.query.userId;
    }

    if (status) {
      filter.status = status.toUpperCase();
    }

    const orders = await Order.find(filter)
      .populate('buyer', 'name email phone location profileImage')
      .populate('farmer', 'name email phone location profileImage')
      .populate('items.product', 'name images unit price location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email phone location profileImage')
      .populate('farmer', 'name email phone location profileImage')
      .populate('items.product', 'name images unit price location description');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Access check: must be buyer, farmer, or admin
    const isBuyer = order.buyer?._id.toString() === req.user._id.toString();
    const isFarmer = order.farmer?._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isFarmer = order.farmer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';

    if (!isBuyer && !isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this order' });
    }

    // Role-specific allowed transitions:
    if (isFarmer && !isAdmin) {
      // Farmer can accept, reject, process, mark ready, dispatch, deliver
      const allowedFarmerStatuses = [
        'ACCEPTED',
        'REJECTED',
        'PROCESSING',
        'READY_FOR_DELIVERY',
        'OUT_FOR_DELIVERY',
        'DELIVERED',
      ];
      if (status && !allowedFarmerStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Farmers can only set status to: ${allowedFarmerStatuses.join(', ')}`,
        });
      }
    }

    if (isBuyer && !isAdmin) {
      // Buyer can cancel if PENDING, or confirm delivery/complete
      if (status === 'CANCELLED' && order.status !== 'PENDING') {
        return res.status(400).json({
          success: false,
          message: 'Order can only be cancelled while in PENDING status.',
        });
      }
      if (status === 'COMPLETED' && !['DELIVERED', 'OUT_FOR_DELIVERY'].includes(order.status)) {
        return res.status(400).json({
          success: false,
          message: 'Order can be marked completed once delivered.',
        });
      }
    }

    if (status) {
      order.status = status;

      // If order is completed or accepted, reduce product stock
      if (status === 'ACCEPTED' || status === 'COMPLETED') {
        for (const item of order.items) {
          if (item.product) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { quantity: -item.quantity },
            });
          }
        }
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    const updated = await Order.findById(order._id)
      .populate('buyer', 'name email phone location')
      .populate('farmer', 'name email phone location')
      .populate('items.product', 'name images unit price');

    res.json({
      success: true,
      message: `Order status updated to ${order.status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a mobile-wallet payment reference for an order
// @route   POST /api/orders/:id/payment
export const submitPayment = async (req, res, next) => {
  try {
    const { paymentMethod, paymentPhone, paymentReference } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the buyer can submit payment details' });
    }

    if (['CANCELLED', 'REJECTED'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Payment cannot be submitted for this order' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.status(400).json({ success: false, message: 'This order has already been paid' });
    }

    if (!PAYMENT_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Choose EVC Plus, SAAD, or e-Dahab' });
    }

    if (!paymentPhone?.trim() || !paymentReference?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Your mobile number and transaction reference are required',
      });
    }

    order.paymentMethod = paymentMethod;
    order.paymentPhone = paymentPhone.trim();
    order.paymentReference = paymentReference.trim();
    order.paymentStatus = 'SUBMITTED';
    order.paymentSubmittedAt = new Date();
    order.paymentConfirmedAt = undefined;
    order.paymentConfirmedBy = null;
    await order.save();

    const updated = await getPopulatedOrder(order._id);
    res.json({
      success: true,
      message: 'Payment details submitted. The farmer will verify the transfer.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm a buyer-submitted mobile-wallet payment
// @route   PATCH /api/orders/:id/payment/confirm
export const confirmPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const isFarmer = order.farmer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    if (!isFarmer && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only the farmer can confirm this payment' });
    }

    if (order.paymentStatus !== 'SUBMITTED') {
      return res.status(400).json({ success: false, message: 'There is no submitted payment to confirm' });
    }

    order.paymentStatus = 'PAID';
    order.paymentConfirmedAt = new Date();
    order.paymentConfirmedBy = req.user._id;
    await order.save();

    const updated = await getPopulatedOrder(order._id);
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only administrators can remove orders' });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order removed',
    });
  } catch (error) {
    next(error);
  }
};

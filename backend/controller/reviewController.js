import Review from '../model/Review.js';
import Order from '../model/Order.js';

// @desc    Create review for farmer (Only by buyer who completed order)
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Order ID and star rating (1-5) are required',
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Buyer verification
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review orders that you placed as a buyer',
      });
    }

    // Completed status check
    if (!['DELIVERED', 'COMPLETED'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'You can only review a farmer after the order has been delivered or completed',
      });
    }

    // Check duplicate
    const existing = await Review.findOne({ order: orderId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this order',
      });
    }

    const review = await Review.create({
      buyer: req.user._id,
      farmer: order.farmer,
      order: order._id,
      rating: Number(rating),
      comment: comment || '',
    });

    const populatedReview = await Review.findById(review._id)
      .populate('buyer', 'name profileImage location')
      .populate('farmer', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for your feedback.',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a farmer
// @route   GET /api/farmers/:id/reviews
export const getFarmerReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ farmer: req.params.id })
      .populate('buyer', 'name profileImage location')
      .populate('order', 'createdAt items')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('buyer', 'name email location profileImage')
      .populate('farmer', 'name email location')
      .populate('order', 'totalAmount createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin or Author)
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.buyer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review removed',
    });
  } catch (error) {
    next(error);
  }
};

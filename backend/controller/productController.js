import Product from '../model/Product.js';
import Farm from '../model/Farm.js';
import Category from '../model/Category.js';
import Review from '../model/Review.js';

// @desc    Get all products (Search, category, location, minPrice, maxPrice, availability, sorting, pagination)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      availability,
      status,
      farmer,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // For public browsing, default to PUBLISHED unless specific status requested by auth user/admin
    if (status) {
      query.status = status;
    } else if (!farmer) {
      query.status = 'PUBLISHED';
    }

    if (farmer) {
      query.farmer = farmer;
    }

    if (availability !== undefined) {
      query.availability = availability === 'true' || availability === true;
    }

    if (category) {
      // Find category by ID or slug/name
      const catDoc = await Category.findOne({
        $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { name: { $regex: category, $options: 'i' } }, { slug: category.toLowerCase() }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum) || 1;

    const products = await Product.find(query)
      .populate('farmer', 'name email phone location profileImage')
      .populate('farm', 'farmName location isVerified')
      .populate('category', 'name slug icon')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Compute farmer ratings for product card display
    const enrichedProducts = await Promise.all(
      products.map(async (p) => {
        const pObj = p.toObject();
        const reviews = await Review.find({ farmer: p.farmer?._id });
        const avgRating =
          reviews.length > 0
            ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
            : 4.9;
        return {
          ...pObj,
          farmerRating: avgRating,
          farmerReviewCount: reviews.length,
        };
      })
    );

    res.json({
      success: true,
      count: enrichedProducts.length,
      data: enrichedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email phone location profileImage createdAt')
      .populate('farm', 'farmName description location region district farmSize crops isVerified')
      .populate('category', 'name slug icon');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ farmer: product.farmer?._id })
      .populate('buyer', 'name profileImage')
      .sort({ createdAt: -1 });

    const avgRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    // Related products from same farmer or category
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category?._id }, { farmer: product.farmer?._id }],
      status: 'PUBLISHED',
    })
      .limit(4)
      .populate('farmer', 'name');

    res.json({
      success: true,
      data: {
        ...product.toObject(),
        reviews,
        farmerRating: avgRating,
        farmerReviewCount: reviews.length,
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Farmer)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, quantity, unit, location, images, harvestDate, availability, status } =
      req.body;

    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name, price, and quantity are required',
      });
    }

    let farm = await Farm.findOne({ farmer: req.user._id });
    if (!farm) {
      farm = await Farm.create({
        farmer: req.user._id,
        farmName: `${req.user.name}'s Farm`,
        location: location || req.user.location,
      });
    }

    const uploadedImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Preserve URL-based product images while preferring an uploaded local image.
    const productImages =
      uploadedImage
        ? [uploadedImage]
        : images && images.length > 0
        ? Array.isArray(images)
          ? images
          : [images]
        : ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'];

    const product = await Product.create({
      farmer: req.user._id,
      farm: farm._id,
      category: category || null,
      name,
      description: description || '',
      price: Number(price),
      quantity: Number(quantity),
      unit: unit || 'kg',
      location: location || farm.location || req.user.location,
      images: productImages,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      availability: availability !== undefined ? availability === true || availability === 'true' : true,
      status: status || 'PUBLISHED',
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('farm', 'farmName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Farmer / Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Must be owner or admin
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
    }

    const {
      name,
      description,
      category,
      price,
      quantity,
      unit,
      location,
      images,
      harvestDate,
      availability,
      status,
    } = req.body;

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;
    if (price !== undefined) product.price = Number(price);
    if (quantity !== undefined) product.quantity = Number(quantity);
    if (unit) product.unit = unit;
    if (location) product.location = location;
    if (req.file) {
      product.images = [`/uploads/${req.file.filename}`];
    } else if (images) {
      product.images = Array.isArray(images) ? images : [images];
    }
    if (harvestDate) product.harvestDate = new Date(harvestDate);
    if (availability !== undefined) product.availability = availability === true || availability === 'true';
    if (status) product.status = status;

    await product.save();

    const updated = await Product.findById(product._id)
      .populate('category', 'name')
      .populate('farm', 'farmName');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Farmer / Admin)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Change product approval/status
// @route   PUT /api/products/:id/status
export const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.status = status;
    await product.save();

    res.json({
      success: true,
      message: `Product status updated to ${status}`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

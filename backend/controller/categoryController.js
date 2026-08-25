import Category from '../model/Category.js';
import Product from '../model/Product.js';

// @desc    Get all categories with product counts
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({
          category: cat._id,
          status: 'PUBLISHED',
        });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      icon: icon || 'Sprout',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category removed',
    });
  } catch (error) {
    next(error);
  }
};

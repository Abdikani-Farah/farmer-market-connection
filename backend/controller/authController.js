import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import Farm from '../model/Farm.js';
import Product from '../model/Product.js';

const JWT_SECRET = process.env.JWT_SECRET || 'farmer_market_secret_jwt_key_2026';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, location, farmName, farmDescription } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, password)',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role: role ? role.toUpperCase() : 'BUYER',
      location: location || 'Afgooye Agricultural District',
    });

    // If farmer, automatically initialize their Farm profile if provided or default
    if (user.role === 'FARMER') {
      await Farm.create({
        farmer: user._id,
        farmName: farmName || `${user.name}'s Organic Farm`,
        description: farmDescription || 'Producing fresh, sustainable harvest for local markets.',
        location: location || 'Afgooye',
        region: 'Lower Shabelle',
        district: 'Afgooye',
        farmSize: '5 Hectares',
        crops: ['Tomatoes', 'Watermelons', 'Maize', 'Bananas'],
        images: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'],
        isVerified: false,
      });
    }

    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      profileImage: user.profileImage,
    };

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & return JWT
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact platform administration.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      location: user.location,
      profileImage: user.profileImage,
    };

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    let farm = null;
    if (user.role === 'FARMER') {
      farm = await Farm.findOne({ farmer: user._id });
    }

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        farm,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (stateless JWT client acknowledgment)
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const farm = user.role === 'FARMER' ? await Farm.findOne({ farmer: user._id }) : null;
    res.json({ success: true, data: { ...user.toObject(), farm } });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, profileImage } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const farm = user.role === 'FARMER' ? await Farm.findOne({ farmer: user._id }) : null;
    const products = user.role === 'FARMER'
      ? await Product.find({ farmer: user._id, status: 'PUBLISHED' }).populate('category')
      : [];
    res.json({ success: true, data: { ...user.toObject(), farm, products } });
  } catch (error) {
    next(error);
  }
};

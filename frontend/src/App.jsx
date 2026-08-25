import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Core UI Layout Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Public Pages
import Home from './pages/public/Home.jsx';
import Marketplace from './pages/public/Marketplace.jsx';
import Products from './pages/public/Products.jsx';
import ProductDetails from './pages/public/ProductDetails.jsx';
import Farmers from './pages/public/Farmers.jsx';
import FarmerDetails from './pages/public/FarmerDetails.jsx';
import HowItWorks from './pages/public/HowItWorks.jsx';
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

// Farmer Dashboard Pages
import FarmerDashboard from './pages/farmer/Dashboard.jsx';
import FarmerProducts from './pages/farmer/Products.jsx';
import FarmerOrders from './pages/farmer/Orders.jsx';
import FarmerFarmProfile from './pages/farmer/FarmProfile.jsx';

// Buyer Dashboard Pages
import BuyerDashboard from './pages/buyer/Dashboard.jsx';
import BuyerOrders from './pages/buyer/Orders.jsx';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import AdminFarms from './pages/admin/Farms.jsx';
import AdminCategories from './pages/admin/Categories.jsx';
import AdminOrders from './pages/admin/Orders.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/farmers/:id" element={<FarmerDetails />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Protected Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <PrivateRoute allowedRoles={['FARMER']}>
                <FarmerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <PrivateRoute allowedRoles={['FARMER']}>
                <FarmerProducts />
              </PrivateRoute>
            }
          />
          <Route
            path="/farmer/orders"
            element={
              <PrivateRoute allowedRoles={['FARMER']}>
                <FarmerOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/farmer/farm"
            element={
              <PrivateRoute allowedRoles={['FARMER']}>
                <FarmerFarmProfile />
              </PrivateRoute>
            }
          />

          {/* Buyer Protected Routes */}
          <Route
            path="/buyer/dashboard"
            element={
              <PrivateRoute allowedRoles={['BUYER']}>
                <BuyerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <PrivateRoute allowedRoles={['BUYER']}>
                <BuyerOrders />
              </PrivateRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/farms"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminFarms />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminCategories />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <AdminOrders />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

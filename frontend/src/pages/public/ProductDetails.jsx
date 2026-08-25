import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api, useAuth } from '../../context/AuthContext.jsx';
import { getImageUrl } from '../../api/axios.js';
import ProductCard from '../../components/ProductCard.jsx';
import {
  MapPin,
  Calendar,
  Star,
  ShieldCheck,
  CheckCircle,
  Truck,
  Phone,
  Mail,
  User,
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Package,
  Clock,
  AlertCircle,
  X,
  Share2,
} from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isBuyer } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order Request Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.location || 'Mogadishu City Central Market');
  const [deliveryMethod, setDeliveryMethod] = useState('Direct Farm Pickup / Local Delivery');
  const [notes, setNotes] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

  // Contact farmer modal
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.data);
          // Default order quantity
          if (res.data.data.quantity > 0) {
            setOrderQuantity(Math.min(25, res.data.data.quantity));
          }
        }
      } catch (err) {
        setError('Harvest item not found or has been unlisted.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }

    setOrderSubmitting(true);
    setOrderError(null);

    try {
      const res = await api.post('/orders', {
        productId: product._id,
        quantity: Number(orderQuantity),
        deliveryAddress,
        deliveryMethod,
        notes,
      });

      if (res.data.success) {
        setOrderSuccess(res.data.data);
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to submit order request. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 bg-stone-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="h-96 bg-stone-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4"></div>
              <div className="h-6 bg-stone-200 rounded w-1/3"></div>
              <div className="h-24 bg-stone-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">{error || 'Product Not Found'}</h2>
        <p className="text-sm text-stone-500">The product you are looking for might have been sold out or archived.</p>
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    price,
    quantity,
    unit = 'kg',
    location,
    images = [],
    farmer,
    farm,
    category,
    harvestDate,
    availability,
    reviews = [],
    farmerRating = 4.9,
    farmerReviewCount = 0,
    relatedProducts = [],
  } = product;

  const mainImage =
    images && images.length > 0
      ? getImageUrl(images[0])
      : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80';

  const formattedHarvest = harvestDate
    ? new Date(harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent Harvest';

  const totalPrice = (Number(price) * Number(orderQuantity)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-emerald-700">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/marketplace" className="hover:text-emerald-700">
          Marketplace
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {category?.name && (
          <>
            <Link to={`/marketplace?category=${encodeURIComponent(category.name)}`} className="hover:text-emerald-700">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
          </>
        )}
        <span className="font-semibold text-stone-800 truncate">{name}</span>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-stone-100 border border-[#ECF1E4] aspect-4/3 shadow-sm">
            <img src={mainImage} alt={name} className="w-full h-full object-cover" />
            {category?.name && (
              <span className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                {category.name}
              </span>
            )}
            <span
              className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-xs ${
                !availability || quantity <= 0 ? 'bg-rose-600/90 text-white' : 'bg-[#15803D]/90 text-white'
              }`}
            >
              {!availability || quantity <= 0 ? 'Out of Stock' : `${quantity} ${unit} Available`}
            </span>
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden aspect-square border border-[#ECF1E4] bg-stone-100"
                >
                  <img src={getImageUrl(img)} alt={`${name} ${index}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Specifications & Order Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>{location || farm?.location || 'Direct Farm'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Harvested: {formattedHarvest}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A2E05] tracking-tight">{name}</h1>

            <div className="mt-3 flex items-center gap-4">
              <div className="text-3xl font-black text-[#166534]">
                ${Number(price).toFixed(2)}{' '}
                <span className="text-sm font-normal text-stone-500">/ {unit}</span>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{farmerRating}</span>
                <span className="text-stone-400 font-normal">({farmerReviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-sm text-stone-600 leading-relaxed bg-white p-5 rounded-2xl border border-[#ECF1E4]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">About This Harvest</h3>
            <p>{description || 'Fresh agricultural produce cultivated under natural organic conditions.'}</p>
          </div>

          {/* Farmer / Farm Card snippet */}
          <div className="bg-[#F4F7F0]/60 p-5 rounded-2xl border border-[#ECF1E4] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#22C55E] text-white font-bold flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {farmer?.profileImage ? (
                  <img src={farmer.profileImage} alt={farmer.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1A2E05] text-sm">{farmer?.name || 'Local Farmer'}</span>
                  {farm?.isVerified && <ShieldCheck className="w-4 h-4 text-[#22C55E]" />}
                </div>
                <div className="text-xs font-semibold text-[#15803D]">{farm?.farmName || 'Registered Farm'}</div>
                <div className="text-[11px] text-stone-400">{farmer?.location || farm?.location}</div>
              </div>
            </div>

            {farm?._id && (
              <Link
                to={`/farmers/${farm._id}`}
                className="text-xs font-bold text-[#166534] hover:text-white bg-white hover:bg-[#22C55E] border border-[#ECF1E4] px-4 py-2 rounded-full shadow-xs transition-all"
              >
                View Farm Profile
              </Link>
            )}
          </div>

          {/* CTA Buttons: Request Harvest & Contact */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setOrderModalOpen(true)}
              disabled={!availability || quantity <= 0}
              className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-full shadow-md shadow-green-200/50 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer hover:scale-102"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Request Produce / Order</span>
            </button>

            <button
              onClick={() => setContactModalOpen(true)}
              className="border border-[#ECF1E4] bg-white hover:bg-[#F4F7F0] text-[#1A2E05] font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#22C55E]" />
              <span>Contact Farmer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Reviews for Farmer */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Farmer Reviews & Ratings</h2>
            <p className="text-xs text-stone-500 mt-0.5">Feedback from verified buyers who completed orders with this farmer.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-amber-800 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{farmerRating} / 5.0</span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
                      {rev.buyer?.name?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-stone-900">{rev.buyer?.name || 'Verified Buyer'}</div>
                      <div className="text-[10px] text-stone-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-stone-400 text-xs">
            No customer reviews submitted yet. Be the first to order and review this farmer!
          </div>
        )}
      </div>

      {/* Related Products from same farmer or category */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-900">More Fresh Harvests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* --- ORDER REQUEST MODAL --- */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#ECF1E4] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                setOrderModalOpen(false);
                setOrderSuccess(null);
                setOrderError(null);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-[#F4F7F0]"
            >
              <X className="w-5 h-5" />
            </button>

            {orderSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EBF7EE] text-[#15803D] flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle className="w-10 h-10 text-[#22C55E]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1A2E05]">Order Request Sent!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Your request for <span className="font-bold text-[#1A2E05]">{orderQuantity} {unit}</span> of {name} has been received and routed directly to{' '}
                  <span className="font-bold text-[#15803D]">{farmer?.name}</span>. The farmer can now review and schedule fulfillment.
                </p>
                <div className="bg-[#F4F7F0] p-4 rounded-2xl border border-[#ECF1E4] text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order Reference:</span>
                    <span className="font-mono font-bold text-[#1A2E05]">#{orderSuccess._id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Farmer:</span>
                    <span className="font-semibold text-[#1A2E05]">{farmer?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Price:</span>
                    <span className="font-bold text-[#15803D]">${orderSuccess.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Status:</span>
                    <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      PENDING FARMER ACCEPTANCE
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/buyer/orders"
                    className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold py-3 rounded-full text-xs transition-colors text-center shadow-md shadow-green-200/50"
                  >
                    View in Buyer Orders
                  </Link>
                  <button
                    onClick={() => {
                      setOrderModalOpen(false);
                      setOrderSuccess(null);
                    }}
                    className="border border-[#ECF1E4] px-5 py-3 rounded-full text-xs font-semibold text-[#1A2E05] hover:bg-[#F4F7F0]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#15803D]">Direct Farm Order</div>
                  <h3 className="text-xl font-bold text-[#1A2E05] mt-1">Request {name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Farmer: <span className="font-semibold text-[#1A2E05]">{farmer?.name}</span> • Farm:{' '}
                    <span className="font-semibold text-[#1A2E05]">{farm?.farmName}</span>
                  </p>
                </div>

                {!isAuthenticated && (
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Please sign in to confirm and submit your order.</span>
                    </div>
                    <Link
                      to={`/login?redirect=/products/${id}`}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1 rounded-full text-[11px] shrink-0"
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                {orderError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                    {orderError}
                  </div>
                )}

                {/* Quantity Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2E05]">
                    Quantity Required ({unit}) - Max {quantity} {unit}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={quantity}
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(Math.max(1, Math.min(quantity, Number(e.target.value))))}
                      className="flex-1 bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3.5 py-2.5 text-sm font-bold text-[#1A2E05] focus:outline-[#22C55E]"
                      required
                    />
                    <div className="text-xs font-semibold text-[#166534] bg-[#EBF7EE] px-3 py-2.5 rounded-xl border border-[#ECF1E4]">
                      {unit}
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2E05]">Delivery Address / Destination</label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="E.g. Wadajir Market Store #12 or District Address"
                    className="w-full bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3.5 py-2 text-xs focus:outline-[#22C55E]"
                    required
                  />
                </div>

                {/* Delivery Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2E05]">Delivery Method</label>
                  <select
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="w-full bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3.5 py-2 text-xs focus:outline-[#22C55E]"
                  >
                    <option value="Direct Farm Pickup / Local Delivery">Direct Farm Pickup / Local Delivery</option>
                    <option value="Farmer Dispatch Truck">Farmer Dispatch Truck</option>
                    <option value="Wholesale Logistics Delivery">Wholesale Logistics Delivery</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1A2E05]">Order Notes / Packaging Preferences</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. Pack in wooden crates, delivery preferred early morning..."
                    className="w-full bg-[#F4F7F0] border border-[#ECF1E4] rounded-xl px-3.5 py-2 text-xs focus:outline-[#22C55E] resize-none"
                  ></textarea>
                </div>

                {/* Calculation summary */}
                <div className="bg-[#EBF7EE] p-4 rounded-2xl border border-[#ECF1E4] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#15803D] uppercase tracking-wider font-bold block">
                      Total Order Amount
                    </span>
                    <span className="text-xs text-stone-500">
                      {orderQuantity} {unit} &times; ${Number(price).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#1A2E05]">${totalPrice}</div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="w-full bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-50 text-white font-bold py-3.5 rounded-full shadow-md shadow-green-200/50 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer hover:scale-101"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{orderSubmitting ? 'Submitting Order...' : isAuthenticated ? 'Confirm & Send Order Request' : 'Sign In & Send Order Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}


      {/* --- CONTACT FARMER MODAL --- */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative space-y-5">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-lg overflow-hidden border border-emerald-200">
                {farmer?.profileImage ? (
                  <img src={farmer.profileImage} alt={farmer.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              <h3 className="text-lg font-bold text-stone-900">{farmer?.name}</h3>
              <p className="text-xs text-stone-500">{farm?.farmName} • {farmer?.location || farm?.location}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold">{farmer?.phone || '+252 61 7123456'}</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  DIRECT LINE
                </span>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span className="font-semibold">{farmer?.email || 'farmer@market.com'}</span>
                </div>
                <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-bold">
                  EMAIL
                </span>
              </div>
            </div>

            <button
              onClick={() => setContactModalOpen(false)}
              className="w-full bg-stone-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, Heart, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0c2e17] text-stone-300 pt-16 pb-12 border-t border-[#144924]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#144924]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#22C55E] flex items-center justify-center text-white shadow-md shadow-green-200/20">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Farmer<span className="text-[#4ade80]">Market</span>
              </span>
            </Link>
            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              Empowering agricultural communities by bridging local farmers directly with commercial and household
              buyers. Transparent prices, certified harvests, and seamless farm orders.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#4ade80] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Farm Verified Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#86efac] mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/marketplace" className="hover:text-[#4ade80] transition-colors">
                  All Harvests
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Vegetables" className="hover:text-[#4ade80] transition-colors">
                  Fresh Vegetables
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Fruits" className="hover:text-[#4ade80] transition-colors">
                  Seasonal Fruits
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Grains" className="hover:text-[#4ade80] transition-colors">
                  Wholesale Grains
                </Link>
              </li>
              <li>
                <Link to="/farmers" className="hover:text-[#4ade80] transition-colors">
                  Verified Farmers Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#86efac] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/how-it-works" className="hover:text-[#4ade80] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/register?role=FARMER" className="hover:text-[#4ade80] transition-colors">
                  Sell as a Farmer
                </Link>
              </li>
              <li>
                <Link to="/register?role=BUYER" className="hover:text-[#4ade80] transition-colors">
                  Buyer Account
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#4ade80] transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#4ade80] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#86efac] mb-4">Farm Hub</h4>
            <ul className="space-y-3 text-sm text-stone-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span>Afgooye & Jowhar Agricultural Corridors</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>+252 61 500-FARM</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#4ade80] shrink-0" />
                <span>support@farmermarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Farmer Market Connection Platform. JavaScript/Node/Express/MongoDB. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-white">Privacy Policy</Link>
            <Link to="/how-it-works" className="hover:text-white">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white">Farm Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

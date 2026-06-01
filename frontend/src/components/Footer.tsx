import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 text-sm">
        {/* Branding & Description */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/logo.jpg" alt="BrickOurHouse Logo" className="h-10 sm:h-12 w-auto object-contain rounded-full shadow-sm" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              BrickOurHouse
            </span>
          </Link>
          <p className="text-gray-600 leading-relaxed max-w-sm font-medium">
            Helping in building your house effortlessly. Connect with skilled local contractors, agricultural hands, and domestic helpers to get the right help fast.
          </p>
        </div>

        {/* Company Navigation Links */}
        <div>
          <p className="text-gray-900 font-bold text-base mb-4 tracking-wide">Quick Links</p>
          <ul className="flex flex-col gap-2.5 text-gray-600 font-semibold">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/workers" className="hover:text-primary transition-colors">Find Workers</Link>
            </li>
            <li>
              <Link to="/requests" className="hover:text-primary transition-colors">Find Jobs</Link>
            </li>
            <li>
              <Link to="/hire-request" className="hover:text-primary transition-colors">Post Work</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-gray-900 font-bold text-base mb-4 tracking-wide">Get In Touch</p>
          <ul className="flex flex-col gap-2.5 text-gray-600 font-semibold">
            <li className="hover:text-primary transition-colors cursor-pointer">
              📞 +91 98765 43210
            </li>
            <li className="hover:text-primary transition-colors cursor-pointer">
              ✉️ support@workerplace.in
            </li>
            <li className="text-xs text-gray-400 font-medium pt-2">
              Available Monday - Saturday, 9am - 6pm IST
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-200/50 py-6 text-center text-sm font-semibold text-gray-500 bg-gray-100/50">
        <p>Copyright © {new Date().getFullYear()} BrickOurHouse. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

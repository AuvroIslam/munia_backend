import React from "react";
import "../App.css";
import { FileText, Twitter, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
  <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-12 pb-4 px-4">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-12">
        {/* Left: Logo and Description */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span className="text-xl font-bold text-red-600 dark:text-red-500">PDF Pulse</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 max-w-xs text-left">
            Your intelligent PDF library powered by AI. Transform how you read, learn, and discover knowledge.
          </p>
          <div className="flex gap-5 text-gray-400 dark:text-gray-500">
            <a href="#" aria-label="Twitter">
              <Twitter className="w-6 h-6 hover:text-blue-400 dark:hover:text-blue-300 transition-colors" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github className="w-6 h-6 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
            </a>
            <a href="#" aria-label="Email">
              <Mail className="w-6 h-6 hover:text-red-400 dark:hover:text-red-300 transition-colors" />
            </a>
          </div>
        </div>
        {/* Center: Links */}
        <div className="flex-[2] flex flex-col sm:flex-row gap-12 justify-between min-w-[480px]">
          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Product</h4>
            <ul className="text-gray-700 dark:text-gray-200 text-base space-y-2">
              <li><a href="#">Book Store</a></li>
              <li><a href="#">AI Features</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Mobile App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Resources</h4>
            <ul className="text-gray-700 dark:text-gray-200 text-base space-y-2">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">Company</h4>
            <ul className="text-gray-700 dark:text-gray-200 text-base space-y-2">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-800 mt-10 pt-5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 dark:text-gray-400 text-base">
        <div className="w-full md:w-auto text-left">© 2025 PDF Pulse. All rights reserved.</div>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-1"><i className="fa-regular fa-brain"></i> Powered by AI</span>
          <span className="flex items-center gap-1"><i className="fa-regular fa-heart text-red-500 dark:text-red-400"></i> Made for readers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

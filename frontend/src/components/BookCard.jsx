import React from "react";
import { Star, Download, ShoppingCart } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  // Map database fields to component props
  const title = book.title;
  const author = book.author;
  const rating = parseFloat(book.rating || 0);
  const isFree = book.is_free;
  const price = parseFloat(book.price || 0);
  const image =
    book.cover_image ||
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80";

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Please login to download!");
        return;
      }

      console.log('Starting download for book:', book.id);
      
      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${book.id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      console.log('Download response:', response.data);
      
      if (response.data && response.data.status === 'success' && response.data.download_url) {
        console.log('Using S3 pre-signed URL:', response.data.download_url);
        window.location.href = response.data.download_url;
      } else {
        console.error('Unexpected response:', response.data);
        alert('Failed to generate download URL. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      if (error.response && error.response.status !== 200) {
        alert("Failed to download. Please check login or file availability");
      } else {
        alert("An error occurred during download");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      {/* Image */}
      <Link to={`/books/${book.id}`}>
        <div className="relative h-56 w-full">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {/* Rating badge */}
          <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-gray-100 text-sm font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            {rating.toFixed(1)}
          </div>
        </div>
      </Link>
      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {author}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[#8b5cf6] font-semibold">
            {isFree ? "Free" : `$${price.toFixed(2)}`}
          </span>

          {isFree ? (
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          ) : (
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Search, Store, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom"; // ⬅️ NEW
import apiClient from "../../api/apiClient";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/semantic-search?q=${encodeURIComponent(debouncedQuery)}`
        );
        const data = await response.data;
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [debouncedQuery]);

  return (
    <section className="bg-gradient-to-r from-[#f3f6ff] to-[#f3f6ff] dark:from-gray-800 dark:to-gray-800 py-20 text-center">
      {/* Main Heading and Description */}
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Your Intelligent PDF Library
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Discover, purchase, and enhance your reading experience with
          AI-powered insights. Transform how you consume knowledge with smart
          summaries and personalized recommendations.
        </p>

        {/* Search Bar and Button */}
        <div className="max-w-xl mx-auto mb-8 flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="title, author, genre, mood etc."
            className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-500"
            aria-label="Search for PDFs by title, author, genre, or mood"
          />
          <button
            onClick={() => setDebouncedQuery(query)} // Force immediate search on button click
            className="px-4 py-3 rounded-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#3b58fc] to-[#3b58fc] hover:opacity-90 transition"
            aria-label="Search PDFs"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 text-left">
          {loading && (
            <p className="text-gray-600 dark:text-gray-300">Searching...</p>
          )}
          {!loading && Array.isArray(results) && results.length > 0 && (
            <ul className="space-y-4">
              {results.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`}>
                  <li className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow border border-gray-200 dark:border-gray-600">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      by {book.author}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {book.description}
                    </p>
                  </li>
                </Link>
              ))}
            </ul>
          )}
          {!loading && debouncedQuery && results.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300">No results found</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#3b58fc] to-[#3b58fc] hover:opacity-90 transition flex items-center justify-center gap-2">
            <Store className="w-5 h-5" />
            Browse Store
          </button>

          <Link
            to="/ai-features"
            className="px-6 py-3 rounded-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#3b58fc] to-[#3b58fc] hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Try AI Features
          </Link>

          <button className="px-6 py-3 rounded-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:opacity-90 transition flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Upload PDF
          </button>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  ShoppingCart,
  Download,
} from "lucide-react";
import BookCard from "../components/BookCard";
import { booksApi } from "../api/booksApi";
import FilterPage from "./FilterPage";
import axios from "axios";
import apiClient from "../api/apiClient"; // Import your API client

export default function StorePage() {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [semanticQuery, setSemanticQuery] = useState(""); // For semantic search
  const [showFilters, setShowFilters] = useState(true);
  const [view, setView] = useState("grid");
  const [semanticResults, setSemanticResults] = useState([]); // Store semantic search results
  const [isSemanticSearch, setIsSemanticSearch] = useState(false); // Track if we're using semantic search

  // ⬇️ New filters state
  const [filters, setFilters] = useState({
    genres: [],
    price: "all",
    rating: 0,
  });

  // Set up debounce effect for semantic search
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSemanticQuery(query);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // Perform semantic search when debounced query changes
  useEffect(() => {
    const performSemanticSearch = async () => {
      if (!semanticQuery.trim()) {
        setSemanticResults([]);
        setIsSemanticSearch(false);
        return;
      }

      try {
        const response = await apiClient.get(
          `/semantic-search?q=${encodeURIComponent(semanticQuery)}`
        );
        const data = await response.data;
        setSemanticResults(data);
        setIsSemanticSearch(true);
      } catch (error) {
        console.error("Semantic search failed:", error);
        setIsSemanticSearch(false);
      }
    };

    performSemanticSearch();
  }, [semanticQuery]);

  const handleDownload = async (id, title) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        alert("Please login to download!");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/books/${id}/download`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Unexpected Response from server");
      }
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        console.error(error);
        alert("Failed to download. Please check login or file availability");
      } else {
        console.warn("Download triggered but Axios threw: ", error);
      }
    }
  };

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await booksApi.getBooks();
        // Ensure we're setting an array
        const booksData = response?.data?.data?.data || response?.data?.data || [];
        setAllBooks(Array.isArray(booksData) ? booksData : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books from server");
        setAllBooks([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter books by query + filters
  const filteredBooks = useMemo(() => {
    // Ensure allBooks is an array
    const books = Array.isArray(allBooks) ? allBooks : [];
    
    // If we're doing semantic search, use those results
    if (isSemanticSearch && semanticQuery.trim()) {
      return (semanticResults || []).map((result) => {
        // Find the full book data from books if available
        const fullBookData = books.find((book) => book.id === result.id) || {};

        return {
          ...fullBookData,
          ...result,
          // Ensure we have all required properties
          genre: result.genre || fullBookData.genre || "Unknown",
          rating: result.rating || fullBookData.rating || 0,
          is_free: result.is_free !== undefined ? result.is_free : fullBookData.is_free || false,
          price: result.price || fullBookData.price || 0,
        };
      });
    }

    // Otherwise, use regular filtering
    return books.filter((book) => {
      // Ensure book properties exist with default values if undefined
      const bookTitle = (book.title || '').toLowerCase();
      const bookAuthor = (book.author || '').toLowerCase();
      const bookDescription = (book.description || '').toLowerCase();
      const searchQueryLower = query.toLowerCase();

      const matchesQuery =
        bookTitle.includes(searchQueryLower) ||
        bookAuthor.includes(searchQueryLower) ||
        bookDescription.includes(searchQueryLower);

      const matchesGenre =
        filters.genres.length === 0 || filters.genres.includes(book.genre);

      const matchesPrice =
        filters.price === "all" ||
        (filters.price === "free" && book.is_free) ||
        (filters.price === "paid" && !book.is_free);

      const matchesRating = (book.rating || 0) >= filters.rating;

      return matchesQuery && matchesGenre && matchesPrice && matchesRating;
    });
  }, [
    query,
    filters,
    allBooks,
    isSemanticSearch,
    semanticQuery,
    semanticResults,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading books...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar filters */}
      {showFilters && (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 hidden md:block">
          <FilterPage filters={filters} setFilters={setFilters} />
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books by title, author, or content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Toggle filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* View toggle */}
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-lg border ${
                view === "grid"
                  ? "bg-violet-500 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg border ${
                view === "list"
                  ? "bg-violet-500 text-white"
                  : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results */}
        <p className="text-sm text-gray-500 mb-4">
          {isSemanticSearch && semanticQuery.trim() ? (
            <span>
              Semantic search results: {filteredBooks.length} book(s) found
            </span>
          ) : (
            <span>{filteredBooks.length} book(s) found</span>
          )}
        </p>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm flex p-4 gap-4"
              >
                {/* Book Image */}
                <img
                  src={
                    book.cover_image ||
                    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-md"
                />

                {/* Book Details */}
                <div className="flex flex-col flex-1">
                  {/* Title & Author */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {book.author}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {book.description}
                  </p>

                  {/* Genre */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-violet-200 rounded-full">
                      {book.genre}
                    </span>
                  </div>

                  {/* Footer: Rating + Price + Action */}
                  <div className="flex items-center justify-between mt-auto">
                    {/* Rating + Price */}
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm font-medium text-yellow-500">
                        ⭐ {book.rating}
                      </span>
                      <span
                        className={`text-base font-semibold ${
                          book.is_free ? "text-green-600" : "text-violet-600"
                        }`}
                      >
                        {book.is_free
                          ? "Free"
                          : `$${parseFloat(book.price).toFixed(2)}`}
                      </span>
                    </div>

                    {/* Action button */}
                    {book.is_free ? (
                      <button
                        onClick={() => handleDownload(book.id, book.title)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    ) : (
                      <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition inline-flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

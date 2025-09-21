// pages/FilterPage.jsx
import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function FilterPage({ filters, setFilters }) {
  const defaultFilters = {
    genres: [],
    price: "all",
    rating: 0,
    sort: "",
  };

  const [localFilters, setLocalFilters] = useState(filters || defaultFilters);

  // Sync localFilters when parent filters change
  useEffect(() => {
    setLocalFilters(filters || defaultFilters);
  }, [filters]);
  

  const genres = ["Technology", "Business", "Writing", "Lifestyle", "Science", "Fiction"];
  const priceRanges = [
    { label: "All", value: "all" },
    { label: "Free", value: "free" },
    { label: "Paid", value: "paid" },
  ];
  const ratings = [
    { label: "⭐ 4+ stars", value: 4 },
    { label: "⭐ 3+ stars", value: 3 },
    { label: "⭐ 2+ stars", value: 2 },
    { label: "⭐ 1+ stars", value: 1 },
  ];

  const handleApply = () => setFilters(localFilters);

  const handleClear = () => setFilters(defaultFilters);

  return (
    <div className="space-y-6 bg-slate-900 rounded-2xl shadow-md border border-slate-700 p-6 text-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-700 pb-3">
        <SlidersHorizontal className="text-violet-400" size={20} />
        <h2 className="text-lg font-semibold text-white">Filters</h2>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-medium text-gray-300 mb-2">Sort by</h3>
        <div className="relative">
          <select
            value={localFilters.sort}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
            className="w-full border border-slate-700 rounded-xl p-3 pr-10 bg-slate-800 text-gray-200 focus:ring-2 focus:ring-violet-500 focus:outline-none appearance-none shadow-sm"
          >
            <option value="">Select sorting</option>
            <option value="title">Title (A–Z)</option>
            <option value="rating">Rating (High → Low)</option>
            <option value="priceLowHigh">Price (Low → High)</option>
            <option value="priceHighLow">Price (High → Low)</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={18}
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-medium text-gray-300 mb-2">Price</h3>
        <div className="space-y-2">
          {priceRanges.map((p) => (
            <label
              key={p.value}
              className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-violet-400"
            >
              <input
                type="radio"
                name="price"
                checked={localFilters.price === p.value}
                onChange={() =>
                  setLocalFilters((prev) => ({ ...prev, price: p.value }))
                }
                className="accent-violet-500"
              />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      {/* Genre */}
      <div>
        <h3 className="font-medium text-gray-300 mb-2">Genre</h3>
        <div className="space-y-2">
          {genres.map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-violet-400"
            >
              <input
                type="checkbox"
                name="genre"
                checked={localFilters.genres.includes(g)}
                onChange={() => {
                  const newGenres = localFilters.genres.includes(g)
                    ? localFilters.genres.filter((x) => x !== g)
                    : [...localFilters.genres, g];
                  setLocalFilters((prev) => ({ ...prev, genres: newGenres }));
                }}
                className="accent-violet-500"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-medium text-gray-300 mb-2">Rating</h3>
        <div className="space-y-2">
          {ratings.map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-2 text-sm cursor-pointer text-gray-300 hover:text-violet-400"
            >
              <input
                type="radio"
                name="rating"
                checked={localFilters.rating === r.value}
                onChange={() =>
                  setLocalFilters((prev) => ({ ...prev, rating: r.value }))
                }
                className="accent-violet-500"
              />
              {r.label}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleApply}
          className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl shadow transition"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-gray-200 font-medium rounded-xl shadow transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

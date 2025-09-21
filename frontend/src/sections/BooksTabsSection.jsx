import React, { useState, useMemo, useEffect } from "react";
import BookCard from "../components/BookCard";
import { booksApi } from "../api/booksApi";
import { useAuth } from "../contexts/AuthContext";

const TABS = [
  { key: "featured", label: "Featured Books" },
  { key: "free", label: "Top Free PDFs" },
  { key: "picks", label: "AI Picks for You" },
];

export default function BooksTabsSection() {
  const [active, setActive] = useState("featured");
  const [allBooks, setAllBooks] = useState({
    featured: [],
    free: [],
    picks: []
  });
  const [loading, setLoading] = useState(true);
  const [aiPicksMessage, setAiPicksMessage] = useState("");
  const { isAuthenticated } = useAuth();

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        // Fetch featured and free books (always available)
        const [featuredResponse, freeResponse] = await Promise.all([
          booksApi.getFeaturedBooks(),
          booksApi.getFreeBooks()
        ]);

        let aiPicksData = [];
        let aiMessage = "";

        // Fetch AI picks only if user is authenticated
        if (isAuthenticated) {
          try {
            const aiPicksResponse = await booksApi.getAiPicks();
            aiPicksData = aiPicksResponse.data.data || [];
            aiMessage = aiPicksResponse.data.message || "";
          } catch (error) {
            console.error('Error fetching AI picks:', error);
            if (error.response?.status === 401) {
              aiMessage = "Please login to get AI recommendations";
            } else {
              aiMessage = "Unable to load AI recommendations";
            }
          }
        } else {
          aiMessage = "Login to get personalized AI recommendations";
        }

        setAllBooks({
          featured: featuredResponse.data.data || [],
          free: freeResponse.data.data || [],
          picks: aiPicksData
        });
        setAiPicksMessage(aiMessage);

      } catch (error) {
        console.error('Error fetching books:', error);
        // Keep empty arrays as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [isAuthenticated]); // Re-fetch when authentication status changes

  const list = useMemo(() => {
    if (active === "featured") return allBooks.featured;
    if (active === "free") return allBooks.free;
    return allBooks.picks;
  }, [active, allBooks]);

  if (loading) {
    return (
      <section className="py-12 bg-[#f7f6ff] dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[#f7f6ff] dark:bg-gray-900/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Capsule tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 rounded-full bg-[#f3f6ff] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1 py-1">
            {TABS.map((t) => {
              const isActive = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={[
                    "px-4 py-2 rounded-full text-sm font-semibold transition",
                    isActive
                      ? "bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-gray-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        {active === "picks" && list.length === 0 ? (
          // AI Picks empty state
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              AI Recommendations
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              {aiPicksMessage || "Download books to get personalized AI recommendations"}
            </p>
            {!isAuthenticated && (
              <button 
                onClick={() => window.location.href = '/auth'}
                className="mt-4 px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
              >
                Login for AI Picks
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

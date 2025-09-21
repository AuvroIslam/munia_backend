import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { Star, ShoppingCart, Download } from "lucide-react";

export default function SingleBookPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/books/${id}`);
        setBook(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch book. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleDownload = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Please login to download this book");
      navigate("/auth");
      return;
    }

    if (!book) return;
    try {
      setDownloading(true);
      const response = await apiClient.get(`/books/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status === 'success' && response.data.url) {
        window.open(response.data.url, '_blank');
        link.href = url;
        link.setAttribute("download", `${book.title}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        alert("Unexpected response from server");
      }
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download PDF. Please check login or file availability.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-800 dark:text-gray-200">
        Loading Book...
      </p>
    );
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!book)
    return (
      <p className="text-center mt-10 text-gray-800 dark:text-gray-200">
        Book not found
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto p-6">
        {/* Cover Image and Book Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              book.cover_image ||
              "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80"
            }
            alt={book.title}
            className="w-full md:w-64 h-auto rounded-lg shadow-md object-cover"
          />

          <div className="flex-1 flex flex-col gap-3">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-700 dark:text-gray-300">by {book.author}</p>

            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5" />
              <span>{parseFloat(book.rating || 0).toFixed(1)}</span>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              Genre: {book.genre || "N/A"}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Published: {book.publication_date || "N/A"}
            </p>

            <div className="flex gap-2">
              {book.featured && (
                <span className="text-purple-500 font-semibold">Featured</span>
              )}
              {book.editors_pick && (
                <span className="text-green-500 font-semibold">
                  Editor's Pick
                </span>
              )}
            </div>

            <p className="mt-4 text-gray-800 dark:text-gray-200">
              {book.description}
            </p>

            <div className="mt-6">
              {book.is_free ? (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <Download className="w-5 h-5" />
                  {downloading ? "Downloading..." : "Download PDF"}
                </button>
              ) : (
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now - ${parseFloat(book.price || 0).toFixed(2)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

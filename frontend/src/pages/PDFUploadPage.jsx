import { useState } from "react";
import axios from "axios";

export default function PDFUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    price: "",
    description: "",
    isbn: "",
    publication_date: "",
    is_free: true,
    featured: true,
    editors_pick: true,
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("auth_token");
    if (!token) {
      setMessage("Please Login first");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (pdfFile) data.append("pdf_file", pdfFile);
      if (coverImage) data.append("cover_image", coverImage);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/books",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("✅ Book Uploaded successfully");
      setFormData({
        title: "",
        author: "",
        genre: "",
        price: "",
        description: "",
        isbn: "",
        publication_date: "",
        is_free: false,
        featured: false,
        editors_pick: false,
      });
      setPdfFile(null);
      setCoverImage(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to upload book. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Upload New PDF Book
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          required
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
        ></textarea>
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
        />
        <input
          type="date"
          name="publication_date"
          value={formData.publication_date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
        />

        {/* File inputs */}
        <label className="block">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Upload PDF
          </span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full p-2 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:hover:bg-green-700 dark:file:bg-green-500 dark:file:hover:bg-green-600"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Cover Image (optional)
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full p-2 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:hover:bg-green-700 dark:file:bg-green-500 dark:file:hover:bg-green-600"
          />
        </label>

        {/* Checkboxes */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_free"
              checked={formData.is_free}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 border-gray-300 dark:border-gray-600 rounded"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Free Book
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 border-gray-300 dark:border-gray-600 rounded"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Featured
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="editors_pick"
              checked={formData.editors_pick}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 dark:text-green-400 focus:ring-green-500 dark:focus:ring-green-400 border-gray-300 dark:border-gray-600 rounded"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">
              Editor's Pick
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        {message && (
          <p className="text-center text-sm mt-2 text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

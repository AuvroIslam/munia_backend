import apiClient from './apiClient';

export const booksApi = {
  // Get all books with filters
  getBooks: (params = { per_page: 100 }) => {
    return apiClient.get('/books', { params });
  },

  // Get single book
  getBook: (id) => {
    return apiClient.get(`/books/${id}`);
  },

  // Get featured books
  getFeaturedBooks: () => {
    return apiClient.get('/books/featured/list');
  },

  // Get free books
  getFreeBooks: () => {
    return apiClient.get('/books/free/list');
  },

  // Get editor's picks
  getEditorsPicks: () => {
    return apiClient.get('/books/picks/list');
  },

  // Get AI picks for authenticated user
  getAiPicks: () => {
    const token = localStorage.getItem('auth_token');
    return apiClient.get('/ai-picks', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  // Download PDF (requires authentication)
  downloadPdf: (id) => {
    return apiClient.get(`/books/${id}/download`, {
      responseType: 'blob'
    });
  },

  // Create new book (requires authentication)
  createBook: (formData) => {
    return apiClient.post('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

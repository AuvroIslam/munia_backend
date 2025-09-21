import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "./pages/Home/Home";
import AIFeaturesPage from "./pages/AIFeaturesPage";
import StorePage from "./pages/StorePage";
import Auth from "./pages/Auth/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import Contact from "./pages/Contact/Contact.jsx";

import Pricing from "./pages/Pricing/Pricing";
import PDFUploadPage from "./pages/PDFUploadPage.jsx";
import SingleBookPage from "./pages/SingleBookPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/ai-features",
        element: (
          <ProtectedRoute>
            <AIFeaturesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/upload-pdf",
        element: (
          <ProtectedRoute>
            <PDFUploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/store",
        element: <StorePage />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/books/:id",
        element: <SingleBookPage />,
      },
    ],
  },
]);

export default router;

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <div className="min-h-[100vh]">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </AuthProvider>
  );
}

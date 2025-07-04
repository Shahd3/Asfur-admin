import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginPage from "./components/Login/LoginPage";
import Header from "./components/Layout/header";
import Package from "./components/Package/Package";
import Users from "./components/Users/Users";
import Offers from "./components/Offer/offer";
import Booking from "./components/Booking/Booking";
import Agency from "./components/Agency/Agency"; 
import PackageDetails from "./components/Package/packagedetails"; 
import AddPackageform from "./components/Package/AddPackage";
//import EditPackage from "./components/Package/editPacakge";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("admin_logged_in");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("admin_logged_in"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} />
    </Router>
  );
}

function Layout({ isLoggedIn }) {
  const location = useLocation();

  const isLoginPage = location.pathname === "/loginPage";
  const showLayout = isLoggedIn && !isLoginPage;

  return (
    <div className="flex">
      {showLayout && <Sidebar />}

      <div className="flex-1 min-h-screen bg-gradient-to-b from-[#f2fefd] to-white font-dm-serif">
        {showLayout && <Header />}
        <div className="p-6">
          <Routes>
            <Route
              path="/loginPage"
              element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/loginPage" />}
            />
            <Route path="/package" element={<Package />} />
            <Route path="/users" element={<Users />} />
            <Route path="/offer" element={<Offers />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/agency" element={<Agency />} />
            <Route path="/package/:id" element={<PackageDetails />} />
            <Route path="pages/addpackageform" element={<AddPackageform />} />
            {/* <Route path="/package/edit/:id" element={<EditPackage />} /> */}

          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

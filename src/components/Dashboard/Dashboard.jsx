import React, { useEffect, useState } from "react";
import api from "/src/api.js";
import { FiUsers, FiSearch, FiDollarSign } from "react-icons/fi";
import CountryPieChart from './pieChart';
import RevenueLineGraph from './lineChart';

const MetricCard = ({ title, value, icon: Icon }) => (
    <div className="rounded-lg p-4 shadow bg-white flex items-center space-x-4">
        {Icon && <Icon className="text-[#0c4041] text-2xl" />}
        <div>
            <h2 className="text-sm font-semibold text-[#0c4041]">{title}</h2>
            <p className="text-2xl font-bold text-gray-700 mt-1">{value}</p>
        </div>
    </div>
);

export default function Dashboard() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userCount, setUserCount] = useState(0);
    const [lang, setLang] = useState("en");
    const [users, setUsers] = useState([]);
    const isArabic = false;
    

    const labels = {
        dashboard: isArabic ? "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645" : "Dashboard",
        toggle: isArabic ? "\ud83c\uddec\ud83c\udde7 English" : "\ud83c\uddf8\ud83c\udde6 Arabic",
        user: isArabic ? "\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a" : "Users",
        recent: isArabic ? "\u0627\u0644\u0625\u0639\u0644\u0627\u0646\u0627\u062a \u0627\u0644\u0623\u062e\u064a\u0631\u0629" : "Recent Listings",
    };


    const locationData = [
        { name: "Dubai", value: 45, active: true },
        { name: "Cairo", value: 30, active: true },
        { name: "Istanbul", value: 15, active: false },
        { name: "New York", value: 10, active: true },
    ];
    const activeLocations = locationData.filter(loc => loc.active);

    const [recentPackages, setRecentPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useEffect(() => {
        document.documentElement.lang = lang;
        document.body.dir = isArabic ? "rtl" : "ltr";
    }, [lang, isArabic]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get("admin/analytics/get-analytics?date_filter_type=monthly&selected_month=2025-01");
                setOverview(response.data.data.overview);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const response = await api.get(
                    "admin/user/get-list?page=1&limit=100&sort_dir=desc",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                const total = response.data.total || 0;
                setUserCount(total);
            } catch (error) {
                console.error("Failed to fetch user count:", error);
            }
        };

        fetchUserCount();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("admin/user/get-list?page=1&limit=100&sort_dir=desc");
                const recentUsers = res.data.data.slice(0, 6); // Get recent 4 users

                // Map data to your required shape
                const mappedUsers = recentUsers.map((user) => ({
                    id: user.id,
                    name: user.name || "N/A",
                    email: user.email || "N/A",
                    status: user.is_active ? "active" : "blocked",
                }));

                setUsers(mappedUsers);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchRecentPackages = async () => {
            try {
                const response = await api.get("/admin/package/get-packages-list?sort=created_at&sort_dir=desc&limit=3&page=1", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setRecentPackages(response.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch packages:", error);
            } finally {
                setPackagesLoading(false);
            }
        };

        fetchRecentPackages();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!overview) return <div>No data available</div>;

    return (
        <main className="min-h-screen p-6 overflow-y-auto">
            <div className="bg-[#0c4041] text-white p-4 rounded-lg mb-6">
                <h2 className="text-xl font-bold">{labels.dashboard}</h2>
                <p className="text-sm mt-1">{isArabic ? "ملخص الشهر الحالي" : "This month's summary"}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Total Revenue" value={`AED ${overview.total_revenue}`} icon={FiDollarSign} />
                <MetricCard title="Agency Revenue" value={`AED ${overview.agency_revenue}`} icon={FiDollarSign} />
                <MetricCard title="Freelance Revenue" value={`AED ${overview.freelance_revenue}`} icon={FiDollarSign} />
                <MetricCard title="Total Bookings" value={overview.total_bookings} icon={FiSearch} />
                <MetricCard title="Total Customers" value={overview.total_customers} icon={FiUsers} />
                <MetricCard title="Active Packages" value={overview.active_packages} icon={FiUsers} />
                <MetricCard title="Total Searches" value={overview.total_searches} icon={FiSearch} />
                <MetricCard title="User Count" value={userCount} icon={FiUsers} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Users</h3>
                        <ul className="text-sm space-y-2">
                            {users.length === 0 ? (
                                <li>{isArabic ? "لا توجد إعلانات" : "No listings available"}</li>
                            ) : (
                                users.map((user, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-start items-center border-b border-gray-200 pb-1"
                                    >
                                        {/* Avatar Placeholder with First Letter */}
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-xl font-bold text-gray-700">
                                                {user.name !== "N/A" ? user.name[0].toUpperCase() : "?"}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-800">{user.name}</span>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded-full ${user.status === "active"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                        }`}
                                                >
                                                    {user.status === "active"
                                                        ? isArabic
                                                            ? "نشط"
                                                            : "Active"
                                                        : isArabic
                                                            ? "محظور"
                                                            : "Blocked"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
                <CountryPieChart lang={lang} isArabic={isArabic}/>
            </div>

            <div>
                <RevenueLineGraph lang={lang} isArabic={isArabic}/>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {isArabic ? "أحدث الباقات" : "Latest Packages"}
                </h3>
                {packagesLoading ? (
                    <p className="text-gray-500 text-sm">{isArabic ? "جاري التحميل..." : "Loading packages..."}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentPackages.map(pkg => (
                            <div key={pkg.id} className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-md transition">
                                <div className="h-64 bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                                    {pkg.cover?.virtual_path ? (
                                        <img
                                            src={pkg.cover.virtual_path}
                                            alt={pkg.package_translations?.[0]?.title || "Package"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400">
                                            {isArabic ? "لا توجد صورة" : "No Image"}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-md font-bold mb-1 text-gray-800 truncate">
                                    {pkg.package_translations?.[0]?.title || (isArabic ? "لا عنوان" : "No Title")}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {pkg.package_translations?.[0]?.description || (isArabic ? "لا يوجد وصف" : "No Description")}
                                </p>
                                <p className="text-sm font-semibold text-green-600 mt-2">
                                    {pkg.selling_price ? `${isArabic ? "درهم" : "Dhs"} ${pkg.selling_price}` : (isArabic ? "السعر غير متوفر" : "No Price")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-4 left-4 z-50">
                <button
                    onClick={() => setLang(lang === "en" ? "ar" : "en")}
                    className="bg-[#129295] hover:bg-[#0f7f81] text-white px-8 py-3 rounded-full shadow-lg text-sm"
                >
                    {labels.toggle}
                </button>
            </div>
        </main>
    );
}

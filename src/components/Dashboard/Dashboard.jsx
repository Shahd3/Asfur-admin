import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import api from "/src/api.js";


export default function Dashboard() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userCount, setUserCount] = useState(0);


    const locationData = [
        { name: "Dubai", value: 45, active: true },
        { name: "Cairo", value: 30, active: true },
        { name: "Istanbul", value: 15, active: false },
        { name: "New York", value: 10, active: true },
    ];

    const activeLocations = locationData.filter(location => location.active);


    const [lang, setLang] = useState("en");
    const isArabic = lang === "ar";

    // Static data
    const stats = {
        users: userCount,
        listings: 350,
        locations: 24,
        media: 72,
    };

    // Language direction setup
    useEffect(() => {
        document.documentElement.lang = lang;
        document.body.dir = isArabic ? "rtl" : "ltr";
    }, [lang, isArabic]);

    const labels = {
        dashboard: isArabic ? "لوحة التحكم" : "Dashboard",
        toggle: isArabic ? "🇬🇧 English" : "🇸🇦 Arabic",
        user: isArabic ? "إحصائيات" : "Users",
        recent: isArabic ? "الإعلانات الأخيرة" : "Recent Listings",
        approved: isArabic ? "مقبول" : "Approved",
        pending: isArabic ? "قيد الانتظار" : "Pending",
        rejected: isArabic ? "مرفوض" : "Rejected",
    };

  

    const users = [
        { id: 1, name: "John Doe", email: "john@example.com", status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", status: "blocked" },
        { id: 3, name: "Robert Brown", email: "robert@example.com", status: "active" },
    ];



    //api test 
    const [recentPackages, setRecentPackages] = useState([]);
    const [packagesLoading, setPackagesLoading] = useState(true);

    useEffect(() => {
        const fetchRecentPackages = async () => {
            try {
                const response = await api.get(
                    "/admin/package/get-packages-list?sort=created_at&sort_dir=desc&limit=3&page=1",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setRecentPackages(response.data?.data || []);
            } catch (error) {
                console.error("Failed to fetch recent packages:", error);
            } finally {
                setPackagesLoading(false);
            }
        };

        fetchRecentPackages();
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

    if (loading) return <div>Loading...</div>
    if (!overview) return <div>No data available</div>


    return (
        <main className="fmin-h-screen p-6 overflow-y-auto">
            <h2 className="text-4xl font-semibold mb-6 text-[#0c4041] ">
                Dashboard
            </h2>


            {/*Stats Section*/}
            <div className="space-y-6">

                {/* Total Revenue – full width card */}
                <div className="rounded-lg p-6 shadow mt-10 bg-white">
                    <h2 className="text-xl font-semibold text-[#0c4041]">Total Revenue</h2>
                    <p className="text-5xl font-bold text-gray-700 mt-2">AED {overview.total_revenue}</p>
                </div>

                {/* Other Widgets – grid layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Total Bookings</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">{overview.total_bookings}</p>
                    </div>

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Total Customers</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">{overview.total_customers}</p>
                    </div>

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Agency Revenue</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">AED {overview.agency_revenue}</p>
                    </div>

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Freelance Revenue</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">AED {overview.freelance_revenue}</p>
                    </div>

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Active Packages</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">{overview.active_packages}</p>
                    </div>

                    <div className="rounded-lg p-6 shadow bg-white">
                        <h2 className="text-lg font-semibold text-[#0c4041]">Total Searches</h2>
                        <p className="text-3xl font-bold text-gray-700 mt-2">{overview.total_searches}</p>
                    </div>

                </div>
            </div>



            {/*Recent Users Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow mt-10">
                    <h3 className="text-xl font-semibold mb-3 text-gray-700 ">
                        {labels.user}
                    </h3>
                    <ul className="text-sm space-y-2">
                        {users.length === 0 ? (
                            <li>{isArabic ? "لا توجد إعلانات" : "No listings available"}</li>
                        ) : (
                            users.map((user, idx) => (
                                <li
                                    key={idx}
                                    className="flex justify-start items-center border-b border-gray-200 pb-1"
                                >
                                    {/* Square User Box */}
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                        <span className="text-xl font-bold text-gray-700">
                                            {user.name[0]} {/* Display the first letter of the name */}
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

                {/* Pie Chart for Active Locations */}
                <div className="bg-white p-4 rounded-lg shadow mt-10">
                    <h3 className="text-md font-semibold mb-3 text-gray-700">
                        {isArabic ? "المواقع النشطة" : "Active Locations"}
                    </h3>

                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={activeLocations}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                outerRadius="80%"
                                fill="#0f7f81"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = outerRadius + 10;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                }}
                            >
                                {activeLocations.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            index === 0
                                                ? "#0f7f81"
                                                : index === 1
                                                    ? "#C7E8EA"
                                                    : "#efe5f6"
                                        }
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>



            {/* Recently Added Packages Section */}
            <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {isArabic ? "أحدث الباقات" : "Latest Packages"}
                </h3>

                {packagesLoading ? (
                    <p className="text-gray-500 text-sm">{isArabic ? "جاري التحميل..." : "Loading packages..."}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentPackages.length === 0 ? (
                            <p className="text-gray-500 text-sm">{isArabic ? "لا توجد باقات" : "No packages found."}</p>
                        ) : (
                            recentPackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-md transition"
                                >
                                    {/* Package Image */}
                                    <div className="h-40 bg-gray-100 rounded-md overflow-hidden mb-3 flex items-center justify-center">
                                        {pkg.cover?.virtual_path ? (
                                            <img
                                                src={pkg.cover.virtual_path}
                                                alt={pkg.package_translations?.[0]?.title || "Package Image"}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">
                                                {isArabic ? "لا توجد صورة" : "No Image"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title + Description */}
                                    <h4 className="text-md font-bold mb-1 text-gray-800 dark:text-white truncate">
                                        {pkg.package_translations?.[0]?.title || (isArabic ? "لا عنوان" : "No Title")}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                        {pkg.package_translations?.[0]?.description || (isArabic ? "لا يوجد وصف" : "No Description")}
                                    </p>
                                    <p className="text-sm font-semibold text-green-600 mt-2">
                                        {pkg.selling_price
                                            ? `${isArabic ? "درهم" : "Dhs"} ${pkg.selling_price}`
                                            : isArabic ? "السعر غير متوفر" : "No Price"}
                                    </p>
                                </div>
                            ))

                        )}
                    </div>
                )}
            </div>



            {/* Language Toggle Button */}
            <div className="fixed bottom-4 left-4 z-50">
                <button
                    onClick={() => setLang(lang === "en" ? "ar" : "en")}
                    className="bg-[#129295] hover:bg-[#0f7f81] text-white px-8 py-4 rounded-full shadow-lg text-sm"
                >
                    {labels.toggle}
                </button>
            </div>


        </main>
    );
}





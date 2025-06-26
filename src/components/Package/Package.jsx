import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "/src/api";


export default function Package() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [newPackage, setNewPackage] = useState({
        title: "",
        overview: "",
        price: "",
        image: "",
        day: "",
        description: "",
    });

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const GET_PACKAGES_URL = "/admin/package/get-packages-list?sort=min_rooms&sort_dir=asc&limit=100&page=1";
    const ADD_PACKAGE_URL = "/admin/package/create-package-translation";

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get(GET_PACKAGES_URL, { headers });
                const results = response.data?.data;
                setPackages(results || []);
            } catch (error) {
                console.error("Error fetching packages:", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleAddPackage = async () => {
        try {
            const response = await axios.post(ADD_PACKAGE_URL, newPackage, { headers });
            setPackages((prev) => [...prev, response.data]);
            setNewPackage({
                title: "",
                overview: "",
                price: "",
                image: "",
                day: "",
                description: "",
            });
            setShowForm(false);
        } catch (error) {
            console.error("Error adding package:", error.message || error);
        }
    };

    return (
        <div className="p-6 max-w-screen-xl mx-auto">



            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">📦 Packages</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#c7e8ea] hover:bg-[lightblue] text-black px-4 py-2 rounded-md text-sm"
                >
                    ➕ Add A New Package
                </button>
            </div>



            {showForm && (
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 ">Add New Package</h2>


                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newPackage.title}
                            onChange={(e) => setNewPackage({ ...newPackage, title: e.target.value })}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            placeholder="Overview"
                            value={newPackage.overview}
                            onChange={(e) => setNewPackage({ ...newPackage, overview: e.target.value })}
                            className="p-2 border rounded "
                        />
                        <input
                            type="text"
                            placeholder="Price"
                            value={newPackage.price}
                            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                            className="p-2 border rounded "
                        />
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleAddPackage}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



            {loading ? (
                <div className="text-center text-gray-500">Loading packages...</div>
            ) : (
                <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="bg-white rounded-lg shadow flex flex-col overflow-hidden w-full aspect-square"
                        >


                            <div className="h-1/2 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                {pkg.cover?.virtual_path ? (
                                    <img
                                        src={pkg.cover.virtual_path}
                                        alt={pkg.package_translations?.[0]?.title || "Package Image"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    "No Image"
                                )}
                            </div>



                            <div className="h-1/2 p-4 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-md font-semibold text-gray-800 truncate">
                                        {pkg.package_translations?.[0]?.title || "No Title"}
                                    </h2>
                                    <div
                                        className="text-xs text-gray-600 dark:text-gray-300 mt-1"
                                        dangerouslySetInnerHTML={{
                                            __html: pkg.package_translations?.[0]?.description || "No Description",
                                        }}
                                    />
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold mt-1">
                                        {pkg.selling_price ? `Dhs ${pkg.selling_price} per person` : "No Price"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
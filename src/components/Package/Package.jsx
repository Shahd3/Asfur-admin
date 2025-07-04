import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "/src/api";
import AddPackageForm from "./AddPackage.jsx";
import { Plus } from "lucide-react";

export default function Package() {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const ADD_PACKAGE_URL = "/admin/package/create-package";

    const fetchPackages = async (pageNum = 1) => {
        try {
            const response = await api.get(
                `/admin/package/get-packages-list?sort=min_rooms&sort_dir=asc&limit=15&page=${pageNum}`,
                { headers }
            );

            const newPackages = response.data?.data || [];
            setPackages((prev) => {
                const uniquePackages = [...prev, ...newPackages].filter(
                    (pkg, index, self) =>
                        index === self.findIndex((p) => p.id === pkg.id)
                );
                return uniquePackages;
            });

            if (newPackages.length < 15) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages(page);
    }, [page]);

    const handleAddPackage = async (packageData) => {
        try {
            const { title, description, ...rest } = packageData;

            const payload = {
                ...rest,
                package_translations: [
                    {
                        locale: "en",
                        title,
                        description,
                    },
                ],
            };

            const response = await api.post(ADD_PACKAGE_URL, payload, { headers });


            setPackages([]);
            setPage(1);
            setHasMore(true);
            setLoading(true);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding package:", error);
        }
    };



    const getTranslation = (pkg, locale = "en") =>
        pkg.package_translations?.find((t) => t.locale === locale);

    return (
        <div className="p-6">
            {showForm ? (
                <AddPackageForm onSubmit={handleAddPackage} />
            ) : loading ? (
                <div className="text-center text-gray-500">Loading packages...</div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-14 pl-2 pt-4 rounded-full">
                        <h1 className="text-4xl font-bold text-[#0C4041]">Package List</h1>
                        <div
                            onClick={() => setShowForm(true)}
                            className="fixed right-6 bg-[#129295] hover:bg-[#0f7f81] text-white w-16 h-16 rounded-full shadow-lg cursor-pointer group transition-all duration-300 ease-in-out hover:w-40 flex items-center justify-start pl-4 z-50"
                        >
                            <Plus className="w-8 h-8 shrink-0 transition-all duration-300" />
                            <span className="ml-2 text-md whitespace-nowrap overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Add Package
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {packages.map((pkg, index) => {
                            const translation = getTranslation(pkg, "en");

                            return (
                                <Link
                                    to={`/package/${pkg.id}`}
                                    key={`${pkg.id}-${index}`}
                                    className="relative bg-[#f9f9f9] rounded-lg shadow flex flex-col overflow-hidden hover:shadow-md transition transform hover:scale-105 duration-300 ease-in-out"
                                >
                                    <div className="bg-white">
                                        <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                            {pkg.cover?.virtual_path ? (
                                                <img
                                                    src={pkg.cover.virtual_path}
                                                    alt={translation?.title || "Package Image"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col justify-between flex-grow">
                                            <h2 className="text-2xl font-bold text-gray-800 truncate">
                                                {translation?.title || "No Title"}
                                            </h2>

                                            <div className="mt-1 flex items-center gap-2">
                                                {pkg.country?.flag && (
                                                    <img
                                                        src={pkg.country.flag}
                                                        alt="Country Flag"
                                                        className="h-4 w-6 object-cover rounded-sm"
                                                    />
                                                )}
                                                <p className="text-gray-600 font-medium text-sm">
                                                    {pkg.city?.name || "No City"}, {pkg.country?.name || "No Country"}
                                                </p>
                                            </div>

                                            <div
                                                className="text-xs text-gray-500 mt-1 overflow-hidden text-ellipsis"
                                                style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
                                                dangerouslySetInnerHTML={{
                                                    __html: translation?.description || "No Description",
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="pl-3 pb-3">
                                        <p className="text-[#129295] font-semibold mt-2">
                                            {pkg.selling_price ? `Dhs ${pkg.selling_price} per person` : "No Price"}
                                        </p>
                                    </div>


                                </Link>
                            );
                        })}
                    </div>

                    {hasMore && !loading && (
                        <div className="text-center mt-6 text-sm">
                            <button
                                className="text-[#129295]  hover:text-[#0f7f81] transition"
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Load More ↓
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

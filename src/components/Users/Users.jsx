import React, { useState, useEffect } from "react";
import api from "/src/api";

const USERS_PER_PAGE = 10;
const GET_USERS_URL = "/admin/user/get-list?page=1&limit=100&sort_dir=desc";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const token = localStorage.getItem("token");
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get(GET_USERS_URL, { headers });
                const results = response.data?.data;
                setUsers(results || []);
            } catch (error) {
                console.error("Error fetching users:", error.message || error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);


    const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

    const paginatedUsers = users.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );
    const updateUserStatus = async (id, isActive) => {
        try {
            const payload = {
                id, // ensure this is a number, not undefined/null
                is_active: isActive, // true or false
            };

            console.log("Sending payload:", payload); // debug: check this in console

            const res = await api.post(
                "/admin/user/update-user-profile",
                payload,
                { headers }
            );

            console.log("Status updated:", res.data);
            return true;
        } catch (error) {
            console.error("Failed to update user status:", error.response?.data || error.message);
            return false;
        }
    };





    const toggleUserStatus = async (id, currentIsActive) => {
        const newStatus = !currentIsActive;

        const success = await updateUserStatus(id, newStatus);

        if (success) {
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, is_active: newStatus } : user
                )
            );
        } else {
            alert("Failed to update user status. Check API.");
        }
    };






    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">
                👤 User Management
            </h1>

            {loading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    {["Name", "Email", "Phone Number", "Status", "Actions"].map(
                                        (label) => (
                                            <th
                                                key={label}
                                                className="px-6 py-3 border-b-2 border-gray-200  text-left text-sm font-semibold text-gray-600 uppercase"
                                            >
                                                {label}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-100  transition-colors"
                                    >
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-900">
                                            {user.name || "—"}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                                            {user.email || "—"}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 ">
                                            {user.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 capitalize">
                                            <span
                                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {user.is_active ? "Active" : "Blocked"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 border-b border-gray-200 text-center">
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                className={`px-3 py-1 rounded text-white ${user.is_active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                                    }`}
                                            >
                                                {user.is_active ? "Block" : "Activate"}
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center items-center space-x-1 select-none">
                        {/* First Page */}
                        <button
                            onClick={() => goToPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded  text-gray-700 text-xl"
                        >
                            « 
                        </button>

                        {/* Prev */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded text-gray-700 text-xl"
                        >
                            ‹
                        </button>

                        {/* Page Numbers with ellipsis */}
                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            // Show pages near current, first and last pages only
                            if (
                                pageNum === 1 ||
                                pageNum === totalPages ||
                                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`px-3 py-1 rounded ${currentPage === pageNum
                                                ? "bg-blue-600 text-white"
                                                : "text-gray-700"
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                            // Render ellipsis at appropriate places
                            if (
                                (pageNum === currentPage - 2 && pageNum > 2) ||
                                (pageNum === currentPage + 2 && pageNum < totalPages - 1)
                            ) {
                                return <span key={"ellipsis-" + pageNum} className="px-2">...</span>;
                            }
                            return null;
                        })}

                        {/* Next */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded  text-gray-700 text-xl"
                        >
                             ›
                        </button>

                        {/* Last Page */}
                        <button
                            onClick={() => goToPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded text-gray-700 text-xl"
                        >
                             »
                        </button>
                    </div>

                </>
            )}
        </div>
    );
}


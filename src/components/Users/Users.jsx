import React, { useState, useEffect } from "react";
import api from "/src/api";

const USERS_PER_PAGE = 15;
const GET_USERS_URL = "/admin/user/get-list?page=1&limit=100&sort_dir=desc";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);

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
                user_id: id,
                is_active: isActive,
            };

            const res = await api.post(
                "/admin/user/update-user-profile",
                payload,
                { headers }
            );

            console.log("Status updated:", res.data);
            return true;
        } catch (error) {
            console.error(
                "Failed to update user status:",
                error.response?.data || error.message
            );
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
            <div className="flex justify-between items-center mb-14 pl-2 pt-4 rounded-full">
                <h1 className="text-4xl font-bold text-[#0C4041]">User Managment</h1>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Name", "Email", "Phone Number", "Status"].map(
                                        (label) => (
                                            <th
                                                key={label}
                                                className="px-6 py-3 border-b-2 border-gray-200  text-left text-sm font-semibold text-gray-600 uppercase pl-6"
                                            >
                                                {label}
                                            </th>
                                        )
                                    )}
                                </tr>

                            </thead>
                            <tbody className="bg-white">
                                {paginatedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-100  transition-colors"
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <td className="px-6 py-4 border-b border-gray-200">
                                            <div className="flex items-center gap-5">
                                                <img
                                                    src={user.photo_url || "https://www.gravatar.com/avatar/?d=mp"}
                                                    alt="User Avatar"
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                <span className="text-gray-900 font-medium">
                                                    {user.name || "—"}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                                            {user.email || "—"}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200 text-gray-700 ">
                                            {user.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 border-b border-gray-200">
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                className={`group px-6 py-2 rounded-full text-xs font-semibold transition-colors duration-200 ${user.is_active
                                                    ? "bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800"
                                                    : "bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800"
                                                    }`}
                                            >
                                                <span className="group-hover:hidden">
                                                    {user.is_active ? "Active" : "Blocked"}
                                                </span>
                                                <span className="hidden group-hover:inline">
                                                    {user.is_active ? "Block" : "Activate"}
                                                </span>
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

                    
                    {selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                                
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
                                >
                                    &times;
                                </button>

                               
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={selectedUser.photo_url || "https://www.gravatar.com/avatar/?d=mp"}
                                        alt="User Avatar"
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name || "—"}</h2>
                                        <p className="text-sm text-gray-500">{selectedUser.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 space-y-2">
                                    <p><strong>Phone:</strong> {selectedUser.phone || "N/A"}</p>
                                    <p><strong>Account Status:</strong>{" "}
                                        <span className={`font-semibold ${selectedUser.is_active ? "text-green-600" : "text-red-600"}`}>
                                            {selectedUser.is_active ? "Active" : "Blocked"}
                                        </span>
                                    </p>
                                    <p><strong>User Type:</strong> {selectedUser.user_type || "—"}</p>
                                    <p><strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    )}


                </>
            )}
        </div>
    );
}


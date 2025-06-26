import React, { useState, useEffect } from "react";
import api from "/src/api";
import axios from "axios";

const GET_BOOKINGS_URL = "admin/booking/get-bookings-list?limit=10&page=1";

export default function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(GET_BOOKINGS_URL, { headers });
        setBookings(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);

      }
    };

    fetchBookings();
  }, []);




  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 ">
          Bookings
        </h1>
      </div>
      <br />< br />

      {loading ? (
        <p className="text-center text-gray-500 ">
          Loading bookings...
        </p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {booking.package?.cover?.virtual_path ? (
                  <img
                    src={booking.package.cover.virtual_path}
                    alt="Package Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {booking.trip_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    👤 {booking.customer?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-500  mt-1">
                    🗓 {booking.start_date} → {booking.end_date}
                  </p>
                  <p className="text-sm mt-1">
                    <span
                      className={`inline-block px-2 py-1 mt-2 rounded-full text-xs font-medium ${
                        booking.booking_status === "CONFIRMED"
                          ? "bg-green-200 text-green-800"
                          : booking.booking_status === "CANCELLED"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {booking.booking_status}
                    </span>
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
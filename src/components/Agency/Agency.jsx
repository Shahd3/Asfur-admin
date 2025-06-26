import React, { useEffect, useState } from "react";
import api from "/src/api";

const GET_AGENCIES_URL = "admin/agency/get-agency-list?sort=rating&srto_dir=desc&limit=10&page=1";

export default function Agency() {
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await api.get(GET_AGENCIES_URL, { headers });
        setAgencies(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching agencies:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 ">Agencies</h1><br /><br />

      {loading ? (
        <p className="text-gray-500 ">Loading agencies...</p>
      ) : agencies.length === 0 ? (
        <p className="text-gray-500 ">No agencies found.</p>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {agencies.map((agency) => {
            const translation = agency.agency_translations?.find(t => t.locale === "en") || {};
            return (
              <div
                key={agency.id}
                className="bg-white  p-4 rounded-lg shadow-md"
              >
                {agency.cover?.virtual_path ? (
                  <img
                    src={agency.cover.virtual_path}
                    alt={translation.name}
                    className="w-full h-40 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200  rounded flex items-center justify-center text-sm text-gray-500">
                    No Image
                  </div>
                )}
                <div className="mt-4 space-y-1">
                  <h2 className="text-lg font-semibold text-gray-800 ">
                    {translation.name || "Unnamed Agency"}
                  </h2>
                  <p className="text-sm text-gray-600 ">
                    Type: {agency.type}
                  </p>
                  <p className="text-sm text-gray-600 ">
                    Rating: ⭐ {agency.agency_rating?.stars || 0} ({agency.agency_rating?.percentage || 0}%)
                  </p>
                  <p className="text-sm text-gray-600 ">
                    Status: {agency.account_status}
                  </p>
                  <p className="text-sm text-gray-600 ">
                    📞 {agency.contact_number || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 ">
                    ✉️ {agency.email || "N/A"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import api from "/src/api"; // use your baseURL-configured axios instance

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const GET_OFFERS_URL = "admin/offer/get-offer-list?sort=max_discount&sort_dir=desc&limit=10&page=1";

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await api.get(GET_OFFERS_URL);
        const rawData = response.data?.data || [];
        setOffers(rawData);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800"> Offers</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => alert("Coming soon")}
            className="bg-[#c7e8ea] hover:bg-[lightblue] text-black px-4 py-2 rounded-md text-sm"
          >
            ➕ Add A New Offer
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500">Loading offers...</div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {offers.length > 0 ? (
            offers.map((offer) => {
              const translation = offer.offer_translations?.[0];
              const image = offer.offer_packages?.[0]?.package?.cover?.virtual_path;

              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-lg shadow flex flex-col overflow-hidden w-full aspect-square"
                >
                  {/* Image */}
                  <div className="h-1/2 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    {image ? (
                      <img
                        src={image}
                        alt={translation?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "No Image"
                    )}
                  </div>

                  {/* Info */}
                  <div className="h-1/2 p-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-md font-semibold text-gray-800 truncate">
                        {translation?.title || "No Title"}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {translation?.description || "No description available"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full text-gray-500">No offers found.</div>
          )}
        </div>
      )}
    </div>
  );
}
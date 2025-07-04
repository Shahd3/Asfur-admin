import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "/src/api";
import { ArrowLeft, Plane, Hotel, Map, UserCog, Pencil, Trash } from "lucide-react";


export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [packages, setPackages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});


  const navigate = useNavigate();
  const DELETE_PACKAGE_URL = (id) => `admin/package/delete-package/${id}`;

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await api.get(`/admin/package/get-package/${id}`,
          { headers });
        setPkg(res.data?.data);
      } catch (err) {
        console.error("Error loading package:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);


  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      await api.delete(DELETE_PACKAGE_URL(id), { headers });
      navigate("/package");
    } catch (err) {
      console.error("Error deleting package:", err);
    }
  };


  const handleEditSubmit = async (e) => {
    const formData = new FormData();
    formData.append("package_translation[0][locale]", "ar");
    formData.append("package_translation[0][title]", editData.title);
    formData.append(
      "package_translation[0][description]",
      editData.description
    );
    formData.append("selling_price", editData.selling_price);
    formData.append("package_id", id);


    try {
      const response = await api.post(
        "admin/package/create-package-translation",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Package created:", response);

      alert("✅ Package updated successfully!");
      setIsEditing(false);


      const refreshed = await api.get(`/admin/package/get-package/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPkg(refreshed.data?.data);
    } catch (error) {
      console.error(
        "❌ Error updating package:",
        error.response?.data || error
      );
      alert("❌ Update failed.");
    }
  };

  if (loading) return <p className="p-4">Loading package details...</p>;
  if (!pkg) return <p className="p-4 text-red-500">Package not found.</p>;

  const translation = pkg.package_translations?.find(t => t.locale === "en") || {};
  const meals = pkg.meals?.find(m => m.locale === "en")?.meals || "Not provided";
  const transport = pkg.transportation?.find(t => t.locale === "en")?.transportation || "Not provided";
  const termsHTML = pkg.terms_and_conditions?.[0]?.translations?.find(t => t.locale === "en")?.description || "<p>Not provided</p>";
  const cancelHTML = pkg.cancellation_terms?.[0]?.translations?.find(t => t.locale === "en")?.description || "<p>Not provided</p>";
  const flights = pkg.flights || [];
  const accommodations = pkg.accommodations || [];
  const itineraryHTML = pkg.itenary?.find(t => t.locale === "en")?.itenary || "<p>Not provided</p>";
  const categories = pkg.package_categories?.map(c => c.category?.name).join(", ") || "None";
  const groups = pkg.package_groups?.map(g => {
    const tr = g.package_group?.translations?.find(t => t.locale === "en");
    return tr?.title;
  }).filter(Boolean).join(", ") || "None";

  return (
    <div className="relative">
      <button
        onClick={() => navigate(`/package`)}
        className="flex items-center gap-2 bg-[#129295] rounded-full px-4 py-4 text-white hover:bg-[#0f7f81] text-sm font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex justify-center p-6 min-h-screen">

        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Cover */}
          {pkg.cover?.virtual_path ? (
            <img src={pkg.cover.virtual_path} alt="Cover" className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400 italic">No cover image</div>
          )}


          <div className="p-6 space-y-6">
            <div className="mt-3">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="text-2xl font-bold text-gray-800 border p-2 rounded w-full"
                    placeholder="Title"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="mt-2 p-2 w-full rounded border text-gray-700"
                    rows={4}
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    value={editData.selling_price}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, selling_price: e.target.value }))
                    }
                    className="mt-2 p-2 border w-full rounded text-gray-700"
                    placeholder="Selling Price"
                  />
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {translation.title || "No Title"}
                  </h1>
                  <p className="text-[#129295] font-medium text-md mt-1">
                    📍 {pkg.city?.name || "No City"}, {pkg.country?.name || "No Country"}
                  </p>
                </>
              )}

            </div>

            {/* Admin Info */}
            <div className="grid grid-cols-2 gap-4 text-sm bg-[#f9fafb] p-4 rounded-md border border-grey-100 text-[#0c4041]" >
              <p><strong>Status:</strong> <span className="text-[#129295]">{pkg.status}</span></p>
              <p><strong>Pricing Type:</strong> {pkg.pricing_type || "N/A"}</p>
              <p><strong>Valid Till:</strong> {pkg.valid_till}</p>
              <p><strong>Created By:</strong> {pkg.created_by || "N/A"}</p>
              <p><strong>Agency:</strong> {pkg.travel_agency?.agency_translations?.find(t => t.locale === "en")?.name || "N/A"}</p>
              <p><strong>Agency Rating:</strong> ⭐ {pkg.travel_agency?.agency_rating?.stars || "N/A"} ({pkg.travel_agency?.rating_count || 0} reviews)</p>
              <p><strong>Available From:</strong> {pkg.available_dates?.starting_date || "N/A"}</p>
              <p><strong>Available Until:</strong> {pkg.available_dates?.ending_date || "N/A"}</p>
              <p><strong>Keywords:</strong> {pkg.keywords || "None"}</p>
              <p><strong>Categories:</strong> {categories}</p>
              <p><strong>Groups:</strong> {groups}</p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: translation.description || "<p>No description</p>" }} />
            </div>

            {/* Inclusions */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">This Package Includes</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3"><Plane className="text-[#129295] w-5 h-5 mt-1" /><span><strong>Flights:</strong> {
                  flights.length ? (
                    <ul className="ml-4 list-disc">
                      {flights.map((f, idx) => {
                        const tr = f.translations?.find(t => t.locale === "en");
                        return <li key={idx}>{tr?.from_city || "N/A"} ➝ {tr?.to_city || "N/A"}</li>;
                      })}
                    </ul>
                  ) : "Not provided"
                }</span></li>

                <li className="flex items-start gap-3"><Map className="text-[#129295] w-5 h-5 mt-1" /><span><strong>Transportation:</strong> {transport}</span></li>

                <li className="flex items-start gap-3"><Hotel className="text-[#129295] w-5 h-5 mt-1" /><span><strong>Accommodations:</strong> {
                  accommodations.length ? (
                    <ul className="ml-4 list-disc">
                      {accommodations.map((a, i) => {
                        const name = a.translations?.find(t => t.locale === "en")?.hotel_name || "N/A";
                        return <li key={i}>{name} - {a.no_of_days} nights</li>;
                      })}
                    </ul>
                  ) : "Not provided"
                }</span></li>

                <li className="flex items-start gap-3"><UserCog className="text-[#129295] w-5 h-5 mt-1" /><span><strong>Meals:</strong> {meals}</span></li>
              </ul>
            </div>

            {/* Facts */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 border-t pt-4">
              <p><strong>Days/Nights:</strong> {pkg.number_of_days} / {pkg.number_of_nights}</p>
              <p><strong>Price:</strong> {pkg.selling_price} AED</p>
              <p><strong>People:</strong> {pkg.min_people}–{pkg.max_people}</p>
              <p><strong>Rooms:</strong> {pkg.min_rooms}–{pkg.max_rooms}</p>
              <p><strong>Children Allowed:</strong> {pkg.children_allowed ? "Yes" : "No"}</p>
              <p><strong>Location:</strong> {pkg.latitude}, {pkg.longitude}</p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Daily Itinerary</h2>
              {pkg.itineraries?.length ? (
                pkg.itineraries.map((item, index) => {
                  const title = item.translations?.find(t => t.locale === "en")?.title || `Day ${item.day}`;
                  const inclusions = item.inclusions || [];

                  return (
                    <div key={index} className="mb-4">
                      <h3 className="font-semibold text-[#129295]">{title}</h3>
                      <ul className="list-disc ml-6 text-gray-700">
                        {inclusions.map((incl, i) => {
                          const desc = incl.translations?.find(t => t.locale === "en")?.description;
                          return <li key={i}>{desc}</li>;
                        })}
                      </ul>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600">No daily itinerary provided.</p>
              )}
            </div>


            {/* Terms & Cancellation */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Terms & Conditions</h2>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: termsHTML }} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">Cancellation Policy</h2>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: cancelHTML }} />
            </div>

            {/* Edit Link */}
            <div className="pt-4">
              <div>
                <button
                  onClick={(e) => {
                    handleDelete(pkg.id, e)
                  }}
                  className="inline-block group bg-[#db5856] text-white px-5 h-10 rounded-full flex items-center gap-2 hover:bg-[#e54c38]"
                  title="Delete Package"
                >
                  <Trash className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>

              </div>
              <div>
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleEditSubmit();
                    } else {
                      setEditData({
                        title: translation.title || "",
                        description: translation.description || "",
                        selling_price: pkg.selling_price || "",
                      });
                      setIsEditing(true);
                    }
                  }}

                  className="absolute mt-12 top-1 group bg-white text-[#129295] w-12 h-12 rounded-full flex items-center justify-start pl-2 hover:bg-[#129295] hover:text-white transition-all duration-300 overflow-hidden hover:w-24 z-10 border border-[#129295]"
                  title="Edit Package"
                >
                  <Pencil className="w-7 h-5 shrink-0 transition-all duration-300" />
                  <span className="ml-4 text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {isEditing ? "Save" : "Edit"}
                  </span>

                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

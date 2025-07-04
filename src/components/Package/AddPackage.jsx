import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "/src/api";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useNavigate } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import Select from "react-select";




delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({

    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position} />;
}


export default function AddPackagePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [OgPrice, setOgPrice] = useState("");
  const [days, setDays] = useState("");
  const [nights, setNights] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [position, setPosition] = useState({ lat: 24.453884, lng: 54.377342 });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const [pricingType, setPricingType] = useState("");
  const [validTill, setValidTill] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [agencies, setAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [flights, setFlights] = useState([
    { from_city: "", to_city: "" }
  ]);
  const [transportation, setTransportation] = useState("");
  const [accommodations, setAccommodations] = useState([
    { hotel_name: "", no_of_days: "" }
  ]);

  const [min_people, setMinPeople] = useState("");
  const [max_people, setMaxPeople] = useState("");

  const [meals, setMeals] = useState("");
  const [min_rooms, setMinRoom] = useState("");
  const [max_rooms, setMaxRoom] = useState("");

  const [roomsAllowed, setRoomsAllowed] = useState(false);
  const [childrenAllowed, setChildrenAllowed] = useState(false);

  const [itinerariesDay, setItinerariesDay] = useState("");
  const [itinerariesTitle, setItinerariesTitle] = useState("");


  const token = localStorage.getItem("token");
  const options = agencies.map((a) => ({
    value: a.id,
    label: a.agency_translations?.find(t => t.locale === "en")?.name || "Unnamed"
  }));

  const Coptions = categories.map((c) => ({
    value: c.id,
    label: c.name || "Unnamed"
  }));




  if (!token) {
    alert("You must be logged in to add a package.");
    return;
  }

  useEffect(() => {
    api.get("admin/agency/get-agency-list?limit=1000&page=1", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setAgencies(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to load agencies:", err);
      });
  }, []);

  useEffect(() => {
    api.get("admin/category/get-category-list?page=1&limit=100", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        setCategories(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to load Categories:", err);
      });
  }, []);



  useEffect(() => {
    api.get("admin/country/get-country-list?limit=1000&page=1").then((res) => {
      setCountries(res.data?.data || []);
    });
    api.get("admin/city/get-city-list?limit=1000&page=1").then((res) => {
      setCities(res.data?.data || []);
    });
  }, []);

  const filteredCities = cities.filter(
    (city) => city.country_id === Number(selectedCountryId)
  );

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("picture", file);
    form.append("picture_large", file);
    form.append("description", "Cover");
    const res = await api.post("auth/picture/upload-picture", form);
    return res.data?.data?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageId = null;

    if (selectedImage) {
      try {
        uploadedImageId = await uploadImage(selectedImage);
      } catch (err) {
        console.error("image upload failed:", err);
        alert("Failed to upload cover image!");
        return;
      }
    }
    const formData = new FormData();
    formData.append("package_translation[0][locale]", "en");
    formData.append("package_translation[0][title]", title);
    formData.append("package_translation[0][description]", description);
    formData.append("selling_price", price);
    formData.append("original_price", OgPrice);
    formData.append("number_of_days", days);
    formData.append("number_of_nights", nights);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    formData.append("city_id", parseInt(selectedCityId));
    formData.append("country_id", parseInt(selectedCountryId));
    formData.append("status", status);
    formData.append("pricing_type", pricingType);
    formData.append("valid_till", validTill);
    formData.append("expired_at", expiredAt);
    formData.append("travel_agency_id", selectedAgencyId);
    selectedCategories.forEach((id, index) => {
      formData.append(`categories[${index}]`, id);
    });
    flights.forEach((flight, i) => {
      formData.append(`flights[${i}][translations][0][locale]`, "en");
      formData.append(`flights[${i}][translations][0][from_city]`, flight.from_city);
      formData.append(`flights[${i}][translations][0][to_city]`, flight.to_city);
    });
    formData.append("package_translation[0][transportation]", transportation);
    formData.append("min_people", min_people);
    formData.append("max_people", max_people);

    accommodations.forEach((accommodation, i) => {
      formData.append(`accommodations[${i}][translations][0][locale]`, "en");
      formData.append(`accommodations[${i}][translations][0][hotel_name]`, accommodation.hotel_name);
      formData.append(`accommodations[${i}][no_of_days]`, accommodation.no_of_days);
    });

    formData.append("rooms_allowed", roomsAllowed ? 1 : 0);
    formData.append("children_allowed", childrenAllowed ? 1 : 0);

    if (roomsAllowed) {
      formData.append("min_rooms", min_rooms);
      formData.append("max_rooms", max_rooms);
    }

    formData.append("itineraries[0][day]", itinerariesDay);
    formData.append("itineraries[0][translations][0][title]", itinerariesTitle);


    formData.append("package_translation[0][meals]", meals);


    if (uploadedImageId) { formData.append("cover_id", uploadedImageId) };

    try {
      const response = await api.post("admin/package/create-package-translation", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
      );
      setShowModal(true);
    } catch (error) {
      console.error("Error submiting Package: ", error)
    }
  }
  return (
    <div className="p-10 bg-white m-10">
      <h2 className="text-3xl font-bold mb-8 text-[#0C4041]">Create New Package</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
          <p className="text-gray-500 col-span-4"> Package Info:</p>
          <input
            type="text"
            placeholder="Package Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="text-2xl border border-gray-300 rounded-lg p-3  col-span-4"
          />
          <input
            type="number"
            placeholder="Oiginal Price (AED)"
            value={OgPrice}
            onChange={(e) => setOgPrice(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          />
          <input
            type="number"
            placeholder="Selling Price (AED)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3"
          />
          <select
            value={pricingType}
            onChange={(e) => setPricingType(e.target.value)}
            required
            className={`border border-gray-300 rounded-lg p-3 ${!pricingType ? "text-gray-400" : "text-black"
              }`}
          >
            <option value="" disabled hidden>
              Pricing Type
            </option>
            <option value="PER_PERSON">PER_PERSON</option>
            <option value="PACKAGE">PACKAGE</option>
          </select><br />
          <input
            type="number"
            placeholder="Number of Days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3 "
          />
          <input
            type="number"
            placeholder="Number of Nights"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        <textarea
          placeholder="Package Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 rounded-lg p-3 w-full min-h-[120px]"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
          className={`border border-gray-300 rounded-lg p-3 ${!status ? "text-gray-400" : "text-black"
            }`}
        >
          <option value="" disabled >
            Select Status
          </option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="DRAFT">DRAFT</option>
          <option value="REMOVED">REMOVED</option>
        </select>

        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              {selectedImage && (
                <p className="text-sm mt-2 text-gray-700">Selected: {selectedImage.name}</p>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>
        </div>

        <p className="text-gray-500 col-span-4"> Location Details:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={selectedCountryId}
            onChange={(e) => {
              setSelectedCountryId(e.target.value);
              setSelectedCityId("");
            }}
            required
            className={`border border-gray-300 rounded-lg p-3 ${!selectedCountryId ? "text-gray-400" : "text-black"}`}
          >
            <option value="" disabled hidden>Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            required
            className={`border border-gray-300 rounded-lg p-3 ${!selectedCityId ? "text-gray-400" : "text-black"}`}
          >
            <option value="">Select City</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-500">Pick Location on Map</label>
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={10}
            className="h-72 rounded border border-gray-300"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>

        <div className="flex flex-wrap gap-10">
          <div className="w-full sm:w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till:</label>
            <input
              type="date"
              value={validTill}
              onChange={(e) => setValidTill(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              required
            />
          </div>

          <div className="w-full sm:w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expired At:</label>
            <input
              type="date"
              value={expiredAt}
              onChange={(e) => setExpiredAt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-black"
              required
            />
          </div>
        </div>


        <div>
          <label className="block font-medium mb-2 text-gray-500">Agency Info:</label>
          <Select
            options={options}
            onChange={(selected) => setSelectedAgencyId(selected.value)}
            placeholder="Select Travel Agency"
            styles={{
              control: (base, state) => ({
                ...base,
                padding: "8px 8px",
                borderRadius: "0.5rem",
                minHeight: "42px",
                fontSize: "1.1rem",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50,
              }),
            }}
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-500">Categories Info:</label>
          <Select
            options={Coptions}
            isMulti
            onChange={(selectedOptions) => {
              setSelectedCategories(selectedOptions.map((opt) => opt.value));
            }}
            placeholder="Select Categories"
            styles={{
              control: (base) => ({
                ...base,
                padding: "8px",
                borderRadius: "0.5rem",
                fontSize: "1rem",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#9ca3af",
              }),
              menu: (base) => ({
                ...base,
                zIndex: 50,
              }),
            }}
          />

        </div>
        <div>
          <h3 className="text-gray-500 mb-2">Flight Information</h3>
          {flights.map((flight, index) => (
            <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
              <p className="font-semibold mb-2">Flight #{index + 1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="From City (en)"
                  value={flight.from_city}
                  onChange={(e) => {
                    const updated = [...flights];
                    updated[index].from_city = e.target.value;
                    setFlights(updated);
                  }}
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="text"
                  placeholder="To City (en)"
                  value={flight.to_city}
                  onChange={(e) => {
                    const updated = [...flights];
                    updated[index].to_city = e.target.value;
                    setFlights(updated);
                  }}
                  className="border border-gray-300 rounded p-2"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFlights([...flights, { from_city: "", to_city: "" }])}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Add Another Flight
          </button>
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-500">Transportation (En):</label>
          <textarea
            placeholder="Describe transportation options..."
            value={transportation}
            onChange={(e) => setTransportation(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full min-h-[100px]"
          />
        </div>

        <div>
          <h3 className="text-gray-500 mb-2">Accommodations: </h3>
          {accommodations.map((accommodation, index) => (
            <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
              <p className="font-semibold mb-2">Accommodation #{index + 1}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Hotel Name"
                  value={accommodation.hotel_name}
                  onChange={(e) => {
                    const updated = [...accommodations];
                    updated[index].hotel_name = e.target.value;
                    setAccommodations(updated);
                  }}
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="number"
                  placeholder="No. Of Days"
                  value={accommodation.no_of_days}
                  onChange={(e) => {
                    const updated = [...accommodations];
                    updated[index].no_of_days = parseInt(e.target.value) || "";
                    setAccommodations(updated);
                  }}
                  className="border border-gray-300 rounded-lg p-3"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setAccommodations([...accommodations, { hotel_name: "", no_of_days: "" }])}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Add Another Accommodation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={roomsAllowed}
              onChange={() => setRoomsAllowed(!roomsAllowed)}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Rooms allowed?</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={childrenAllowed}
              onChange={() => setChildrenAllowed(!childrenAllowed)}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Children allowed?</span>
          </label>
        </div>


        {roomsAllowed && (
          <div className="mt-4">
            <label className="block font-medium mb-2 text-gray-500">Range of Rooms:</label>
            <input
              type="number"
              placeholder="Min"
              value={min_rooms}
              onChange={(e) => setMinRoom(e.target.value)}
              className="border border-gray-300 rounded-lg p-3"
            /> -
            <input
              type="number"
              placeholder="Max"
              value={max_rooms}
              onChange={(e) => setMaxRoom(e.target.value)}
              className="border border-gray-300 rounded-lg p-3"
            />
          </div>
        )}


        <div>
          <label className="block font-medium mb-2 text-gray-500">Meals (En):</label>
          <textarea
            placeholder="Describe Meals provided..."
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full min-h-[100px]"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-500">Range of People:</label>
          <input
            type="number"
            placeholder="Min"
            value={min_people}
            onChange={(e) => setMinPeople(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          />  -
          <input
            type="number"
            placeholder="Max"
            value={max_people}
            onChange={(e) => setMaxPeople(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-500">Daily Itinerary:</label>
          <input
            type="number"
            placeholder="Day #"
            value={itinerariesDay}
            onChange={(e) => setItinerariesDay(e.target.value)}
            className="border border-gray-300 rounded-lg p-3"
          /> <input
            type="text"
            placeholder="Itinerary Title"
            value={itinerariesTitle}
            onChange={(e) => setItinerariesTitle(e.target.value)}
            required
            className="border border-gray-300 rounded-lg p-3 "
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Submit Package
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-2 text-green-600">Success!</h3>
            <p className="mb-4">The package has been added successfully.</p>
            <button
              onClick={() => {
                setShowModal(false);
                window.location.href = "/package";
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

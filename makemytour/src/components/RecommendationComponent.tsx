// 🔥 RecommendationComponent.tsx (with "no cheaper hotel" check)
import React, { useEffect, useState } from 'react';
import { getRecommendedHotels } from "@/api/index"; // ✅ Your central API

type RecommendationComponentProps = {
  location: string;
  price?: number; // 🛑 Now price is optional
};

const RecommendationComponent: React.FC<RecommendationComponentProps> = ({ location, price }) => {
  const [recommendedHotels, setRecommendedHotels] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // if price is given (hotel page) — filter cheaper hotels
        // if price not given (flight page) — show all hotels in the location
        const recs = await getRecommendedHotels(location, price || 99999999); // Big number if price not given
        const cheaperHotels = price
          ? recs.filter((hotel: any) => hotel.pricePerNight < price)
          : recs; // Show all if price not set
        setRecommendedHotels(cheaperHotels);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };

    if (location) {
      fetchRecommendations();
    }
  }, [location, price]);

  const sortedHotels = [...recommendedHotels].sort((a, b) => b.pricePerNight - a.pricePerNight);

  return (
    <div className="mt-6 p-4 border rounded-xl bg-gray-50 shadow-sm">
      <h3 className="font-bold text-lg mb-4">AI Recommended Hotels in {location}:</h3>

      {sortedHotels.length === 0 ? (
        <p className="text-gray-500">No hotels available in {location}.</p>
      ) : (
        <ul className="space-y-3">
          {sortedHotels.map((hotel: any, idx: number) => (
            <li key={idx} className="relative group border p-3 rounded-lg bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">
                  {hotel.hotelName} - ₹{hotel.pricePerNight}
                </span>
              </div>

              {/* Tooltip — Only if 'price' was passed (Hotel page) */}
              {price && (
                <div className="text-gray-500 text-sm mt-1 relative">
                  <span className="cursor-pointer group-hover:underline">
                    Why this?
                  </span>
                  <div className="hidden group-hover:block absolute bg-white border p-2 text-xs rounded shadow-lg top-5 left-0 z-10 w-64">
                    Recommended because it's in {location} and costs ₹{hotel.pricePerNight}, lower than your selected price ₹{price}.
                  </div>
                </div>
              )}

              {/* Tooltip — if Flight page (no price passed) */}
              {!price && (
                <div className="text-gray-500 text-sm mt-1 relative">
                  <span className="cursor-pointer group-hover:underline">
                    Why this?
                  </span>
                  <div className="hidden group-hover:block absolute bg-white border p-2 text-xs rounded shadow-lg top-5 left-0 z-10 w-64">
                    Recommended because this hotel is in {location} — suitable for your travel destination.
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationComponent;







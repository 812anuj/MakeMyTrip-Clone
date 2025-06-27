import axios from "axios";

const BACKEND_URL = "https://makemytrip-clone-gqck.onrender.com";

export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login?email=${email}&password=${password}`;
    const res = await axios.post(url);
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const data = res.data;
    // console.log(data);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${email}`);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const data = res.data;
    return data;
  } catch (error) {}
};
export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handleflightbooking = async (userId, flightId, seats, price) => {
  try {
    const url = `${BACKEND_URL}/booking/flight?userId=${userId}&flightId=${flightId}&seats=${seats}&price=${price}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handlehotelbooking = async (userId, hotelId, rooms, price) => {
  try {
    const url = `${BACKEND_URL}/booking/hotel?userId=${userId}&hotelId=${hotelId}&rooms=${rooms}&price=${price}`;
    const res = await axios.post(url);
    return res.data; 
  } catch (error) {
    console.log("Hotel booking API error:", error);
    throw error;
  }
};


// Cancel Booking API Function in index.js (improved & safe)
export const cancelBooking = async (userId, bookingId, reason, authToken) => {
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};

    const response = await axios.post(
      `${BACKEND_URL}/booking/cancel?userId=${userId}&bookingId=${bookingId}&reason=${encodeURIComponent(reason)}`,
      { userId, bookingId, reason },  // 🔶 Issue: body unnecessary (params already in URL)
      { headers }
    );

    if (!response.data) {
      throw new Error('No response data received from server');
    }

    return {
      status: response.data.status || 'SUCCESS',
      bookingId: response.data.bookingId,
      refundAmount: response.data.refundAmount || 0,
      refundStatus: response.data.refundStatus || 'PENDING',
      message: response.data.message || 'Cancellation processed successfully'
    };

  } catch (error) {
    console.error('Cancellation error:', error);
    // Structured error handling
    let errorMessage = 'Failed to cancel booking';
    let refundStatus = 'FAILED';

    if (error.response) {
      errorMessage = error.response.data?.message || error.message;
      refundStatus = error.response.data?.refundStatus || 'FAILED';
    } else if (error.request) {
      errorMessage = 'No response received from server';
    } else {
      errorMessage = error.message;
    }

    return {
      status: 'ERROR',
      bookingId,
      refundAmount: 0,
      refundStatus,
      message: errorMessage
    };
  }
};



// Fetch AI User Recommendation (already done by you)
export const getAIRecommendations = async (userId) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/recommendation/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("AI Recommendation API Error:", error);
    return [];
  }
};


// 🔥 Get Recommended Hotels API function
export const getRecommendedHotels = async (location, price) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/recommendation/hotels`, {
      params: { location, price } // ✅ Send location and price as query params
    });
    return res.data; // Expected to return list of hotels from backend
  } catch (error) {
    console.error("Error fetching recommended hotels:", error);
    return []; // Return empty list on error to prevent frontend crash
  }
};









import React, { useState, useEffect } from "react";
import { getuserbyemail } from "@/api";
import {
  User,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { editprofile, cancelBooking } from "@/api";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditFormChange = (field: any, value: any) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleCancelClick = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setShowCancelModal(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getuserbyemail(user?.email);
        dispatch(setUser(data));
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    if (user?.email) fetchUser();
  }, [user?.email, dispatch]);

  const confirmCancelBooking = async () => {
    if (!cancelReason) {
      alert("Please select a cancellation reason");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await cancelBooking(
        user?.id,
        cancelBookingId,
        cancelReason
      );

      if (result.status === 'SUCCESS') {
        const updatedBookings = user.bookings.map((booking: any) => 
          booking.bookingId === cancelBookingId ? { 
            ...booking,
            type: booking.type,
            isCancelled: true,
            refundAmount: result.refundAmount,
            refundStatus: result.refundStatus,
            cancellationReason: cancelReason
          } : booking
        );

        dispatch(setUser({ ...user, bookings: updatedBookings }));
        
        alert(`Booking cancelled! Refund: ₹${result.refundAmount}`);
      } else {
        alert(`Cancellation failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Cancellation error:", error);
      alert("Failed to process cancellation");
    } finally {
      setIsProcessing(false);
      setShowCancelModal(false);
      setCancelBookingId("");
      setCancelReason("");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleEditFormChange("email", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUserData({
                          firstName: user?.firstName || "",
                          lastName: user?.lastName || "",
                          email: user?.email || "",
                          phoneNumber: user?.phoneNumber || "",
                        });
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p>{user?.phoneNumber}</p>
                  </div>
                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
              
              {user?.bookings?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any bookings yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {user?.bookings?.map((booking: any, index: number) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                        booking.isCancelled ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {booking?.type === "Flight" ? (
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">
                              {booking?.type}
                              {booking.isCancelled && (
                                <span className="ml-2 text-sm text-red-500">
                                  (Cancelled)
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Booking ID: {booking?.bookingId}
                            </p>
                            {!booking.isCancelled && (
                              <p className="text-sm font-medium mt-1">
                                {booking?.type === "Flight" 
                                  ? `${booking.flightName || 'Flight'} - ${booking.departure} → ${booking.destination}`
                                  : booking.hotelName || 'Hotel'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ₹ {booking?.totalPrice?.toLocaleString("en-IN")}
                            {booking.isCancelled && booking.refundAmount > 0 && (
                              <span className="block text-xs text-green-600">
                                Refund: ₹{booking.refundAmount?.toFixed(2)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking?.date)}</span>
                        </div>
                        {!booking.isCancelled && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {booking?.type === "Flight"
                                ? `${booking.departure} → ${booking.destination}`
                                : booking.hotelLocation}
                            </span>
                          </div>
                        )}
                      </div>

                      {!booking.isCancelled ? (
                        <button
                          onClick={() => handleCancelClick(booking.bookingId)}
                          className="mt-3 text-red-600 text-sm flex items-center hover:text-red-700"
                        >
                          Cancel Booking
                        </button>
                      ) : (
                        <div className="mt-3 text-sm">
                          <p className="text-gray-600">
                            Reason: {booking.cancellationReason}
                          </p>
                          <p className="text-gray-600">
                            Status: {booking.refundStatus}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Cancel Booking</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Reason for cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select a reason</option>
                  <option value="Change of plans">Change of plans</option>
                  <option value="Found better deal">Found better deal</option>
                  <option value="Travel issues">Travel issues</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="bg-yellow-50 p-3 rounded-md text-sm">
                <p className="font-medium">Cancellation Policy:</p>
                <p>50% refund if cancelled 24 hours before departure</p>
                <p>No refund if cancelled less than 24 hours before departure</p>
                <p>No refund on departured flight</p>
                <p>50% refund on cancellation of Hotel</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-md"
                disabled={isProcessing}
              >
                Back
              </button>
              <button
                onClick={confirmCancelBooking}
                disabled={!cancelReason || isProcessing}
                className={`px-4 py-2 rounded-md ${
                  isProcessing 
                    ? "bg-gray-400" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {isProcessing ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
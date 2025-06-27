// pages/booking/confirmation/[id].tsx
import { useRouter } from "next/router";

export default function BookingConfirmation() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-lg mb-6">
        Your booking ID: <strong>{id}</strong>
      </p>
      <p>Check your email for the confirmation and e-ticket.</p>
    </div>
  );
}
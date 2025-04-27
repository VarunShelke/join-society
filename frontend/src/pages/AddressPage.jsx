import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import {loadStripe} from "@stripe/stripe-js";
import { useCartStore } from "../stores/useCartStore";

const stripePromise = loadStripe(
  "pk_test_51RFOm8FaZrsZwtN6aI2SAUvymGHJ9u6uloGJRKti4AyI4Q5javafNdEwy1z6oZQOXt9NSRZf98y2YutPmuY3YpcL00yQJ6icaH"
);

const AddressPage = () => {
  const navigate = useNavigate();
  const {total, subtotal, coupon, isCouponApplied, cart} = useCartStore();
  
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    try {
      const stripe = await stripePromise;
      const response = await axios.post("/payments/create-checkout-session", {
        products: cart,
        couponCode: coupon ? coupon.code : null,
        address,
      });
      const session = response.data;
      const result = await stripe.redirectToCheckout({
          sessionId: session.id,
      });

      if (result.error) {
          console.error("Error:", result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create checkout session.");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <button className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
      <form onSubmit={handleProceedToPay} className="space-y-4">
        {["fullName", "street", "city", "state", "postalCode", "country"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={address[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded"
        >
          Proceed to Pay
        </button>
      </form>
    </div>
  );
};

export default AddressPage;

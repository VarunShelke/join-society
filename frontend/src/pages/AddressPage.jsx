import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "../lib/axios";
import {loadStripe} from "@stripe/stripe-js";
import {useCartStore} from "../stores/useCartStore";

const stripePromise = loadStripe("pk_test_51RFOm8FaZrsZwtN6aI2SAUvymGHJ9u6uloGJRKti4AyI4Q5javafNdEwy1z6oZQOXt9NSRZf98y2YutPmuY3YpcL00yQJ6icaH");

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

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setAddress({...address, [e.target.name]: e.target.value});
        if (errors[e.target.name]) {
            setErrors({...errors, [e.target.name]: ""}); // Clear error on change
        }
    };

    const validateFields = () => {
        const newErrors = {};
        const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/; // Validates US ZIP codes
        const nameRegex = /^[a-zA-Z\s]+$/;

        if (!address.fullName) newErrors.fullName = "Full name is required.";
        else if (!nameRegex.test(address.fullName)) newErrors.fullName = "Full name can only contain letters.";

        if (!address.street) newErrors.street = "Street address is required.";
        if (!address.city) newErrors.city = "City is required.";
        if (!address.state) newErrors.state = "State is required.";
        if (!address.postalCode) newErrors.postalCode = "Postal code is required.";
        else if (!postalCodeRegex.test(address.postalCode)) newErrors.postalCode = "Invalid postal code format.";
        if (!address.country) newErrors.country = "Country is required.";

        return newErrors;
    };

    const handleProceedToPay = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Show errors if any
            return;
        }

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
                    <div key={field}>
                        <input
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            value={address[field]}
                            onChange={handleChange}
                            required
                        />
                        {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                    </div>
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
import {useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {motion} from "framer-motion";
import {Loader, PlusCircle} from "lucide-react";

const CreateCouponForm = () => {
    const [code, setCode] = useState("");
    const [discount, setDiscount] = useState("");

    const handleCreateCoupon = async (e) => {
        e.preventDefault();

        if (!code || !discount) {
            toast.error("Please provide both coupon code and discount percentage.");
            return;
        }

        try {
            const response = await axios.post("/api/coupons/add", {code, discount});
            toast.success("Coupon code created successfully!");
            setCode("");
            setDiscount("");
        } catch (error) {
            console.error("Error creating coupon:", error);
            toast.error("Failed to create coupon. Please try again.");
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8}}
        >
            <h2 className="text-2xl font-semibold mb-6 text-emerald-300">Create a Coupon</h2>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="mb-4">
                    <label className="block text-gray-300 mb-2">Coupon Code</label>
                    <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">Discount Percentage</label>
                    <input
                        type="number"
                        placeholder="Enter discount percentage"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        min="1"
                        max="100"
                        className="w-full p-2 rounded-md bg-gray-700 text-gray-200"
                    />
                </div>
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                >
                    <>
                        <PlusCircle className='mr-2 h-5 w-5'/>
                        Create Coupon
                    </>
                </button>
            </form>
        </motion.div>
    );
};

export default CreateCouponForm;
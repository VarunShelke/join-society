import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import axios from "../lib/axios";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import toast from "react-hot-toast";

const ProductDetailsModal = ({ isOpen, onClose, productId }) => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const { addToCart, getCartItems } = useCartStore();
    const { user } = useUserStore();

    // Fetch product details when modal opens
    useEffect(() => {
        if (isOpen && productId) {
            fetchProductDetails();
        }
    }, [isOpen, productId]);

    const fetchProductDetails = async () => {
        try {
            setLoading(true);
            // Fetch product details
            const response = await axios.get(`/products/${productId}`);
            setProduct(response.data);

            // Fetch similar products (could be based on category)
            if (response.data.category) {
                const similarResponse = await axios.get(`/products/recommendations`);
                setSimilarProducts(similarResponse.data.filter(p => p._id !== productId).slice(0, 4));
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please login to add products to cart", { id: "login" });
            return;
        }

        if (product) {
            try {
                // Silence all the individual toast notifications
                toast.dismiss();

                // Create a custom toast for the multiple quantity
                if (quantity > 1) {
                    // Show a temporary loading toast
                    const toastId = `add-${product._id}`;
                    toast.loading(`Adding items to cart...`, { id: toastId });

                    // Add to cart multiple times based on quantity
                    for (let i = 0; i < quantity; i++) {
                        await addToCart(product, false); // Add false parameter to prevent toasts
                    }

                    // Replace with a single success message
                    toast.success(`Added ${quantity} ${product.name} to cart`, { id: toastId });
                } else {
                    // For single quantity, just use the normal flow
                    await addToCart(product);
                }

                // Make sure cart is refreshed
                await getCartItems();

                // Close the modal
                onClose();
            } catch (error) {
                toast.error("Failed to add items to cart");
            }
        }
    };

    const increaseQuantity = () => setQuantity(prev => prev + 1);

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // Close modal if Escape key is pressed
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [onClose]);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // If not open, don't render
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pt-16"> {/* Added pt-16 for top spacing */}
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        className="relative w-full max-w-6xl max-h-[85vh] bg-gray-900 overflow-auto z-10 mx-4 flex flex-col"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-10 p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                            onClick={onClose}
                        >
                            <X className="h-6 w-6 text-gray-400 hover:text-white" />
                        </button>

                        {loading ? (
                            <div className="flex justify-center items-center h-96 w-full">
                                <div className="relative">
                                    <div className="w-12 h-12 border-emerald-200 border-2 rounded-full" />
                                    <div className="w-12 h-12 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0" />
                                </div>
                            </div>
                        ) : product ? (
                            <>
                                {/* Main Product Content */}
                                <div className="flex flex-col md:flex-row">
                                    {/* Product Image (Left side) */}
                                    <div className="md:w-1/2 bg-white">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center"
                                        />
                                    </div>

                                    {/* Product Details (Right side) */}
                                    <div className="md:w-1/2 p-8 flex flex-col">
                                        {/* Product Title */}
                                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                            {product.name}
                                        </h1>

                                        {/* Price */}
                                        <p className="text-3xl font-bold text-emerald-400 mt-2">${product.price}</p>

                                        {/* Product Description */}
                                        <div className="my-6">
                                            <p className="text-gray-300 text-base leading-relaxed">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Product Specs */}
                                        {(product.brand || product.material || product.category || product.style) && (
                                            <div className="mb-6">
                                                {product.style && (
                                                    <p className="text-gray-300">Style # {product.style}</p>
                                                )}
                                                {product.color && (
                                                    <p className="text-gray-300">Color: {product.color}</p>
                                                )}
                                                {product.material && (
                                                    <p className="text-gray-300">Material: {product.material}</p>
                                                )}
                                            </div>
                                        )}

                                        {/* Spacer to push quantity and button to bottom */}
                                        <div className="flex-grow"></div>

                                        {/* Quantity and Add to Cart button */}
                                        <div className="mt-4">
                                            <div className="flex items-center mb-4">
                                                <span className="text-white mr-4">Quantity:</span>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={decreaseQuantity}
                                                        className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                                                    >
                                                        <Minus className="h-4 w-4 text-white" />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={quantity}
                                                        readOnly
                                                        className="h-10 w-16 bg-transparent text-center text-white focus:outline-none text-lg"
                                                    />
                                                    <button
                                                        onClick={increaseQuantity}
                                                        className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700"
                                                    >
                                                        <Plus className="h-4 w-4 text-white" />
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold rounded transition-colors duration-300 flex items-center justify-center"
                                            >
                                                <ShoppingCart className="w-5 h-5 mr-2" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Similar Products / You might also like section */}
                                {similarProducts.length > 0 && (
                                    <div className="p-6 border-t border-gray-800 mt-4">
                                        <h2 className="text-xl font-semibold text-emerald-400 mb-4">You Might Also Like</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {similarProducts.map(similarProduct => (
                                                <div
                                                    key={similarProduct._id}
                                                    className="rounded-lg overflow-hidden border border-gray-800 hover:border-emerald-500 transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setProduct(similarProduct);
                                                        setQuantity(1);
                                                    }}
                                                >
                                                    <div className="aspect-square overflow-hidden">
                                                        <img
                                                            src={similarProduct.image}
                                                            alt={similarProduct.name}
                                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="p-3">
                                                        <p className="text-sm font-medium text-white truncate">{similarProduct.name}</p>
                                                        <p className="text-emerald-400 font-bold">${similarProduct.price}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex justify-center items-center h-64 w-full">
                                <p className="text-gray-400">Product not found</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
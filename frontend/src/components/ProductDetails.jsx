import React, {useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-hot-toast';

const ProductDetails = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);

                // Fetch similar products based on category
                const similarResponse = await axios.get(`/api/products/similar/${id}`);
                setSimilarProducts(similarResponse.data.slice(0, 5)); // Limit to 5 similar products
            } catch (error) {
                toast.error('Error loading product details');
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            await axios.post('/api/cart/add', {
                productId: id,
                quantity: quantity
            });
            toast.success('Added to cart successfully!');
        } catch (error) {
            toast.error('Error adding to cart');
        }
    };

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="rounded-lg overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-xl font-semibold">${product.price}</p>
                    <p className="text-gray-600">{product.description}</p>

                    {/* Quantity Adjuster */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => handleQuantityChange('decrease')}
                            className="px-3 py-1 border rounded-md"
                        >
                            -
                        </button>
                        <span>{quantity}</span>
                        <button
                            onClick={() => handleQuantityChange('increase')}
                            className="px-3 py-1 border rounded-md"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

            {/* Similar Products Section */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {similarProducts.map((product) => (
                        <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                            <h3 className="mt-2 font-semibold">{product.name}</h3>
                            <p className="text-gray-600">${product.price}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import axios from "../lib/axios";
import {useUserStore} from "../stores/useUserStore";

export default function OrderHistoryTab({userId}) {
    const {user} = useUserStore();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios
            .get("/orders", {params: {user: userId}})
            .then((res) => setOrders(res.data))
            .catch((err) =>
                toast.error(err.response?.data?.message || err.message)
            );
    }, [userId]);

    if (!orders.length) {
        return <p className="text-gray-400 text-center">No orders found.</p>;
    }

    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <div
                    key={order._id}
                    className="bg-gray-700 rounded-lg p-6 space-y-4"
                >
                    {/* — Order header bar — */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-400">
                        <div>
                            <div className="uppercase">Order Placed</div>
                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div className="uppercase">Total</div>
                            <div>${order.totalAmount.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="uppercase">Ship To</div>
                            <div>{user.name}</div>
                        </div>
                        <div>
                            <div className="uppercase">Order #</div>
                            <div>{order.orderNumber}</div>
                        </div>
                    </div>

                    {/* — Products list — */}
                    <div className="space-y-4">
                        {order.products.map((item) => (
                            <div
                                key={item.product._id}
                                className="flex items-center space-x-4"
                            >
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 space-y-1">
                                    <div className="text-white font-medium">
                                        {item.product.name}
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        Qty: {item.quantity}
                                    </div>
                                </div>
                                <div className="text-gray-300 font-semibold">
                                    ${item.price.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

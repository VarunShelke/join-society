// Order History Tab For Profile Page 

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export default function OrderHistoryTab({ userId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("/orders", { params: { user: userId } })
      .then(res => setOrders(res.data))
      .catch(err => toast.error(err.response?.data?.message || err.message));
  }, [userId]);

  if (!orders.length) {
    return <p>No orders found.</p>;
  }

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th className="border-b py-2">Order #</th>
          <th className="border-b py-2">Date</th>
          <th className="border-b py-2">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o._id}>
            <td className="py-2">{o.orderNumber}</td>
            <td className="py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
            <td className="py-2">${o.totalAmount.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

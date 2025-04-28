// Coupons Tab For Profile Page 

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export default function CouponsTab({ userId }) {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    axios.get("/coupons/my")
      .then(res => setCoupons(res.data))
      .catch(err => toast.error(err.response?.data?.message || err.message));
  }, [userId]);

  if (!coupons.length) {
    return <p>You have no active coupons.</p>;
  }

  return (
    <ul className="space-y-3">
      {coupons.map(c => (
        <li key={c._id} className="flex justify-between border p-3 rounded">
          <span><strong>{c.code}</strong> — {c.discountPercentage}% off</span>
          <span>
            {c.expirationDate
              ? new Date(c.expirationDate).toLocaleDateString()
              : "No expiry"}
          </span>
        </li>
      ))}
    </ul>
  );
}

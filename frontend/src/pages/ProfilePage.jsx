import { useState } from "react";
import { Lock, ShoppingBasket, CirclePercent } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

import SecurityTab     from "../components/SecurityTab";
import OrderHistoryTab from "../components/OrderHistoryTab";
import CouponsTab      from "../components/CouponsTab";

const tabs = [
  { id: "security", label: "Login/Security", icon: Lock },
  { id: "orders",   label: "Order History",  icon: ShoppingBasket },
  { id: "coupons",  label: "Coupons",        icon: CirclePercent },
];

export default function ProfilePage() {
  const { user, checkAuth } = useUserStore();
  const [activeTab, setActiveTab] = useState("security");

  if (!user) return null; // or <Navigate to="/login" />

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Profile
        </motion.h1>

        {/* Tab buttons */}
        <div className="flex justify-center mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content: dark, centered card */}
        {activeTab === "security" && (
          <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SecurityTab user={user} refreshUser={checkAuth} />
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-3xl mx-auto overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <OrderHistoryTab userId={user._id} />
          </motion.div>
        )}

        {activeTab === "coupons" && (
          <motion.div
            className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <CouponsTab userId={user._id} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

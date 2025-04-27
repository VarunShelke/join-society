// Login and Security Tab For Profile Page 

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";

export default function SecurityTab({ user, refreshUser }) {
  const [email, setEmail] = useState(user.email);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const updateEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/auth/update-email", { email });
      toast.success("Email updated");
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (newPwd !== confirmPwd) {
      return toast.error("New passwords must match");
    }
    try {
      await axios.put("/auth/update-password", {
        oldPassword: oldPwd,
        newPassword: newPwd,
      });
      toast.success("Password changed");
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* — Email Form — */}
      <form onSubmit={updateEmail} className="space-y-4">
        <h2 className="text-2xl font-semibold">Change Email</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">
          Save Email
        </button>
      </form>

      {/* — Password Form — */}
      <form onSubmit={updatePassword} className="space-y-4">
        <h2 className="text-2xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current password"
          value={oldPwd}
          onChange={e => setOldPwd(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="New password"
          value={newPwd}
          onChange={e => setNewPwd(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPwd}
          onChange={e => setConfirmPwd(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
}

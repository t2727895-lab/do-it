"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-1.5 text-xs font-mono uppercase tracking-widest border border-white/10 text-[#98A2B3] hover:border-[#FFD000]/30 hover:text-[#FFD000] transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
}

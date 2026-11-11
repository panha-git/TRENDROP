"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function logout() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const result = await response.json();
        setError(result.error ?? "We couldn't sign you out. Please try again.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        aria-label={compact ? "Sign out" : undefined}
        className={compact
          ? "flex h-9 w-9 items-center justify-center rounded-lg border border-subtle-border bg-elevated text-secondary transition hover:border-accent-border hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          : "rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-400 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"}
        disabled={loading}
        onClick={logout}
        type="button"
        title="Sign out"
      >
        {compact ? "↪" : loading ? "Signing out..." : "Sign out"}
      </button>
      {error && (
        <p className={`${compact ? "absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-red-500/20 bg-[#1b1b23] p-3 shadow-lg" : "mt-2"} text-sm text-red-300`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

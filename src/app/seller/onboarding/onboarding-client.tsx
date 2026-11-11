"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = { role: string; sellerStatus: string };

export default function SellerOnboardingClient({ role, sellerStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(sellerStatus);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitApplication() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/seller-application", { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "We couldn't submit your application. Please try again.");
        return;
      }
      setStatus(result.sellerStatus);
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const canApply = role === "buyer" && (status === "not_applied" || status === "rejected");

  return (
    <main className="min-h-screen bg-[#101014] px-4 py-12 text-white sm:px-6">
      <section className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#1b1b23] p-6 sm:p-8">
        <Link className="text-sm font-extrabold tracking-[0.18em] text-violet-300" href="/">
          TRENDROP
        </Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-violet-300">Seller program</p>
        <h1 className="mt-2 text-2xl font-bold">Apply to sell on TRENDROP</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Submit a request for seller access. Your account will remain a buyer account until an administrator reviews and approves it.
        </p>

        {status === "pending" && (
          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100" role="status">
            Your application is pending review. Seller tools are not available until approval.
          </div>
        )}
        {status === "approved" && role === "seller" && (
          <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100" role="status">
            Your seller account is approved.
          </div>
        )}
        {status === "rejected" && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-100" role="status">
            Your previous application was rejected. You may submit a new request.
          </div>
        )}
        {role !== "buyer" && role !== "seller" && (
          <p className="mt-6 rounded-xl border border-white/10 p-4 text-sm text-zinc-300" role="status">
            This account type cannot submit a seller application.
          </p>
        )}
        {error && <p className="mt-6 text-sm text-red-300" role="alert">{error}</p>}

        <div className="mt-8 flex flex-wrap gap-3">
          {canApply && (
            <button
              className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
              onClick={submitApplication}
              type="button"
            >
              {loading ? "Submitting..." : status === "rejected" ? "Submit new request" : "Submit application"}
            </button>
          )}
          {role === "seller" && status === "approved" && (
            <Link className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500" href="/seller/dashboard">
              Seller dashboard
            </Link>
          )}
          <Link className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400" href="/account">
            Back to account
          </Link>
        </div>
        <p className="mt-6 text-xs leading-5 text-zinc-500">
          This request stores only the application status. Identity documents, payment details, and seller profile data are not collected here.
        </p>
      </section>
    </main>
  );
}

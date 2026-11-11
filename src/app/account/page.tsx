import Link from "next/link";
import LogoutButton from "@/components/auth/logout-button";
import { requireCurrentUser } from "@/lib/require-auth";

export default async function AccountPage() {
  const user = await requireCurrentUser("/account");

  return (
    <main className="min-h-screen bg-[#101014] px-4 py-12 text-white sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm font-extrabold tracking-[0.18em] text-violet-300" href="/">
          TRENDROP
        </Link>
        <section className="mt-8 rounded-2xl border border-white/10 bg-[#1b1b23] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">Your account</p>
              <h1 className="mt-2 text-2xl font-bold">{user.name}</h1>
              <p className="mt-1 text-sm text-zinc-400">{user.email}</p>
            </div>
            <LogoutButton />
          </div>

          <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Account type</dt>
              <dd className="mt-1 text-sm capitalize text-zinc-200">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Seller application</dt>
              <dd className="mt-1 text-sm capitalize text-zinc-200">{user.sellerStatus.replaceAll("_", " ")}</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/10 pt-6">
            <Link className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500" href="/orders">
              My orders
            </Link>
            <Link className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400" href="/cart">
              Shopping cart
            </Link>
            {user.role === "seller" && user.sellerStatus === "approved" ? (
              <Link className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400" href="/seller/dashboard">
                Seller dashboard
              </Link>
            ) : user.role === "buyer" && user.sellerStatus !== "pending" ? (
              <Link className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400" href="/seller/onboarding">
                {user.sellerStatus === "rejected" ? "Reapply to sell" : "Apply to sell"}
              </Link>
            ) : user.role === "buyer" ? (
              <Link className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-violet-400" href="/seller/onboarding">
                View application status
              </Link>
            ) : null}
          </div>
          <p className="mt-6 text-xs leading-5 text-zinc-500">
            Profile details are read from your TRENDROP account. Profile editing is not yet connected to a persistent workflow.
          </p>
        </section>
      </div>
    </main>
  );
}

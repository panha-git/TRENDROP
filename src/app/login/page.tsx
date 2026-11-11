"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Sign in failed. Please try again.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const field = "mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#191820] px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101014] px-4 py-12 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-[#17171f] p-7 shadow-2xl shadow-black/30 sm:p-9">
        <Link href="/" className="text-sm font-extrabold tracking-[0.18em] text-violet-300">TRENDROP</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Welcome back</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Sign in to continue to your TRENDROP account.</p>
        {params.get("registered") === "1" && <p className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300" role="status">Your account was created. Sign in to continue.</p>}
        <form className="mt-7 space-y-5" onSubmit={submit}>
          <label className="block text-sm font-medium">Email address
            <input className={field} name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium">Password
            <input className={field} name="password" type="password" autoComplete="current-password" required placeholder="Your password" />
          </label>
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300" role="alert">{error}</p>}
          <button disabled={loading} className="h-12 w-full rounded-xl bg-violet-600 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60" type="submit">{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">New to TRENDROP? <Link className="font-semibold text-violet-300 hover:text-violet-200" href="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}

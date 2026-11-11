"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };
    if (payload.password !== String(data.get("confirmPassword") ?? "")) {
      setError("Your passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Registration failed. Please try again.");
        return;
      }
      router.push("/login?registered=1");
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
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Join the marketplace</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Start discovering products and building your wishlist.</p>
        <form className="mt-7 space-y-5" onSubmit={submit}>
          <label className="block text-sm font-medium">Full name
            <input className={field} name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name" />
          </label>
          <label className="block text-sm font-medium">Email address
            <input className={field} name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-medium">Password
            <input className={field} name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="At least 8 characters" />
          </label>
          <label className="block text-sm font-medium">Confirm password
            <input className={field} name="confirmPassword" type="password" autoComplete="new-password" minLength={8} maxLength={128} required placeholder="Enter your password again" />
          </label>
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm text-red-300" role="alert">{error}</p>}
          <button disabled={loading} className="h-12 w-full rounded-xl bg-violet-600 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60" type="submit">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-400">Already have an account? <Link className="font-semibold text-violet-300 hover:text-violet-200" href="/login">Sign in</Link></p>
        <p className="mt-5 text-center text-xs leading-5 text-zinc-500">You will start as a buyer. You can apply to become a seller after signing in.</p>
      </section>
    </main>
  );
}

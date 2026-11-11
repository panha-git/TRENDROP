"use client";

import { FormEvent, useState } from "react";
import { registrationSchema } from "@/lib/validation/student";

export default function SignupFormPage() {
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setStatus("");
      return;
    }

    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const formValidation = registrationSchema.safeParse({
        name: formData.get("name"),
        gender: formData.get("gender"),
        age: Number(formData.get("age")),
        email: formData.get("email"),
        password,
      });
      if (!formValidation.success) {
        setError(formValidation.error.issues[0]?.message ?? "Please check your registration details.");
        setIsSubmitting(false);
        return;
      }
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          gender: formData.get("gender"),
          age: Number(formData.get("age")),
          email: formData.get("email"),
          password,
        }),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to save registration.");
        return;
      }

      form.reset();
      setStatus("Registration saved. Sign-in is not available yet.");
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center bg-zinc-50 px-4 py-12 font-sans text-zinc-900">
      <section className="w-full max-w-2xl rounded-3xl border border-zinc-200 bg-white p-7 shadow-xl shadow-zinc-900/5 sm:p-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Fill in your details to register.
        </p>

        <form
          className="mt-8 grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="name">
              Full name
            </label>
            <input
              autoComplete="name"
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              id="name"
              name="name"
              placeholder="Jane Smith"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              id="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="gender">
              Gender
            </label>
            <select
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              defaultValue=""
              id="gender"
              name="gender"
            >
              <option disabled value="">
                Select gender
              </option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="age">
              Age
            </label>
            <input
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              id="age"
              max={120}
              min={1}
              name="age"
              placeholder="Enter your age"
              type="number"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              autoComplete="new-password"
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              id="password"
              minLength={8}
              name="password"
              placeholder="At least 8 characters"
              type="password"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="confirmPassword"
            >
              Confirm password
            </label>
            <input
              autoComplete="new-password"
              className="h-12 w-full rounded-xl border border-zinc-200 px-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              id="confirmPassword"
              minLength={8}
              name="confirmPassword"
              placeholder="Enter your password again"
              type="password"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 sm:col-span-2" role="alert">
              {error}
            </p>
          )}

          <button
            className="h-12 w-full rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Saving..." : "Register"}
          </button>
        </form>

        {status && <p className="mt-5 text-sm text-emerald-700" role="status">{status}</p>}
      </section>
    </main>
  );
}

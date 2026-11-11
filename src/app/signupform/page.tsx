"use client";

import { FormEvent, useState } from "react";
import { studentSchema } from "@/lib/validation/student";

type RegisteredUser = {
  id: string;
  name: string;
  gender: string;
  age: number;
  email: string;
};

export default function SignupFormPage() {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [hasLoadedUsers, setHasLoadedUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

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
      const formValidations = studentSchema.safeParse({
        name: formData.get("name"),
        gender: formData.get("gender"),
        age: Number(formData.get("age")),
        email: formData.get("email"),
        enrolled: true,
      });
      if (!formValidations.success) {
        setError(formValidations.error.issues[0].message);
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
      setUsers([]);
      setHasLoadedUsers(false);
      setStatus(
        "Registration saved. Click “Check database” to view registered users.",
      );
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function loadUsers() {
    setError("");
    setStatus("");
    setIsLoadingUsers(true);

    try {
      const response = await fetch("/api/registrations");
      const result: { users?: RegisteredUser[]; error?: string } =
        await response.json();

      if (!response.ok || !result.users) {
        setError(result.error ?? "Unable to load registrations.");
        return;
      }

      setUsers(result.users);
      setHasLoadedUsers(true);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setIsLoadingUsers(false);
    }
  }
  console.log("users", users);
  console.log("error", error);
  console.log("status", status);
  console.log("hasLoadedUsers", hasLoadedUsers);
  console.log("isSubmitting", isSubmitting);
  console.log("isLoadingUsers", isLoadingUsers);
  console.log("Registered users", users);

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
            <p className="text-red-500"> {error}</p>
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
            <p className="text-red-500"> {error}</p>
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

        <section
          aria-labelledby="registered-users-heading"
          className="mt-10 border-t border-zinc-100 pt-7"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold" id="registered-users-heading">
              Registered users
            </h2>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {users.length} {users.length === 1 ? "person" : "people"}
            </span>
          </div>

          {status && (
            <p className="mt-4 text-sm text-emerald-700" role="status">
              {status}
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            className="mt-4 h-10 rounded-xl border border-indigo-200 px-4 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoadingUsers}
            onClick={loadUsers}
            type="button"
          >
            {isLoadingUsers ? "Loading..." : "Check database"}
          </button>

          {users.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-500">
              {hasLoadedUsers
                ? "No registrations found in the database."
                : "Click “Check database” to load registered users."}
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {users.map((user, index) => (
                <li
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4"
                  key={user.id}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-semibold">{user.name}</h3>
                      <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="inline text-zinc-500">Gender: </dt>
                          <dd className="inline">{user.gender}</dd>
                        </div>
                        <div>
                          <dt className="inline text-zinc-500">Age: </dt>
                          <dd className="inline">{user.age}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="inline text-zinc-500">Email: </dt>
                          <dd className="inline break-all">{user.email}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-4 text-xs text-zinc-500">
            Passwords are never shown in the registered users list.
          </p>
        </section>
      </section>
    </main>
  );
}

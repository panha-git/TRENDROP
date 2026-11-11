"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "./logout-button";

type User = { name: string };
type State = { status: "loading" } | { status: "error" } | { status: "ready"; user: User | null };

export default function AuthNavigation() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session lookup failed.");
        return response.json() as Promise<{ user: User | null }>;
      })
      .then((result) => {
        if (active) setState({ status: "ready", user: result.user });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });
    return () => {
      active = false;
    };
  }, []);

  if (state.status === "loading") {
    return <span aria-label="Checking account" className="h-9 w-9 rounded-lg border border-subtle-border bg-elevated" />;
  }
  if (state.status === "error") {
    return <span className="text-xs font-medium text-secondary" role="status">Account unavailable</span>;
  }
  if (!state.user) {
    return (
      <div className="flex items-center gap-2">
        <Link className="rounded-lg px-2 py-2 text-xs font-semibold text-secondary transition hover:text-white" href="/login">
          Sign in
        </Link>
        <Link className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-light" href="/register">
          Register
        </Link>
      </div>
    );
  }

  const initials = state.user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-2">
      <Link
        aria-label={`Account for ${state.user.name}`}
        className="flex h-9 items-center justify-center gap-2 rounded-lg border border-subtle-border bg-elevated px-2 text-xs font-semibold text-white transition hover:border-accent-border"
        href="/account"
      >
        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px]">
          {initials || "U"}
        </span>
        <span className="hidden max-w-28 truncate sm:inline">{state.user.name}</span>
      </Link>
      <LogoutButton compact />
    </div>
  );
}

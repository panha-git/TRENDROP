"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartCount } from "@/lib/cart";
import { readOrderReferences } from "@/lib/orders";

type OrderSummary = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotalCents: number;
  items: Array<{
    productId: string;
    slug: string;
    name: string;
    seller: string;
    image: string;
    unitPriceCents: number;
    quantity: number;
    variant?: string;
  }>;
};

function Header() {
  const cartCount = useCartCount();
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="text-xl font-extrabold tracking-tight text-violet-700" href="/">TRENDROP</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm font-medium">
          <Link className="hover:text-violet-700" href="/">Shop</Link>
          <Link aria-current="page" className="font-bold text-violet-700" href="/orders">My orders</Link>
          <Link aria-label={`Cart, ${cartCount} items`} className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50" href="/cart">Cart ({cartCount})</Link>
        </nav>
      </div>
    </header>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const references = readOrderReferences();
        const results = await Promise.all(
          references.map(async (reference) => {
            const response = await fetch(`/api/orders/${reference.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ accessToken: reference.accessToken }),
            });
            const data = (await response.json()) as { order?: OrderSummary; error?: string };
            if (!response.ok || !data.order) {
              throw new Error(data.error ?? "Could not load a saved order.");
            }
            return data.order;
          }),
        );
        if (active) {
          setOrders(results);
        }
      } catch (loadError) {
        console.error("Could not load saved orders.", loadError);
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load your orders.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[.15em] text-violet-700">Buyer account</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">My orders</h1>
        <p className="mt-2 text-sm text-slate-600">Orders saved from this browser. Payment and shipping are not connected.</p>

        {isLoading && <p className="mt-8 rounded-xl bg-white p-5 text-sm text-slate-600" role="status">Loading your orders…</p>}
        {!isLoading && error && (
          <div className="mt-8 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800" role="alert">
            <p>{error}</p>
            <button className="mt-3 font-semibold underline" onClick={() => window.location.reload()} type="button">Try again</button>
          </div>
        )}
        {!isLoading && !error && orders.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold">No saved orders yet</h2>
            <p className="mt-2 text-sm text-slate-600">After checkout, an unpaid order preview will appear here in this browser.</p>
            <Link className="mt-5 inline-flex rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-800" href="/">Browse products</Link>
          </div>
        )}
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li className="overflow-hidden rounded-xl border border-slate-200 bg-white" key={order.id}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3 text-sm">
                <span className="font-semibold">{order.orderNumber}</span>
                <time className="text-slate-500" dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div className="flex items-center gap-3 p-4" key={`${item.productId}-${item.variant ?? ""}-${index}`}>
                    <Image alt="" className="size-16 rounded-lg bg-slate-100 object-cover" height={64} src={item.image} unoptimized width={64} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.seller} · Qty {item.quantity}{item.variant ? ` · ${item.variant}` : ""}</p>
                    </div>
                    <span className="text-sm font-semibold">${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-4">
                <div>
                  <p className="text-sm font-bold">Subtotal: ${(order.subtotalCents / 100).toFixed(2)} {order.currency}</p>
                  <p className="mt-1 text-xs text-amber-800">{order.status === "awaiting_payment" ? "Awaiting payment · no payment has been taken" : `Status: ${order.status}`}</p>
                </div>
                <Link className="rounded-lg border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-800 hover:bg-violet-50" href={`/orders/${order.id}`}>View order status</Link>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

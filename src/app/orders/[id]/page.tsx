"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartCount } from "@/lib/cart";
import { readOrderReferences } from "@/lib/orders";

type OrderDetails = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  currency: string;
  subtotalCents: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
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
      <div className="mx-auto flex min-h-16 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="text-xl font-extrabold tracking-tight text-violet-700" href="/">TRENDROP</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm font-medium">
          <Link className="hover:text-violet-700" href="/orders">My orders</Link>
          <Link className="rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50" href="/cart">Cart ({cartCount})</Link>
        </nav>
      </div>
    </header>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const reference = readOrderReferences().find((saved) => saved.id === id);
        if (!reference) {
          throw new Error("This order is not saved in this browser.");
        }
        const response = await fetch(`/api/orders/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: reference.accessToken }),
        });
        const data = (await response.json()) as { order?: OrderDetails; error?: string };
        if (!response.ok || !data.order) {
          throw new Error(data.error ?? "Could not load this order.");
        }
        if (active) {
          setOrder(data.order);
        }
      } catch (loadError) {
        console.error("Could not load the order details.", loadError);
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load this order.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadOrder();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link className="text-sm font-semibold text-violet-700 hover:underline" href="/orders">← My orders</Link>
        {isLoading && <p className="mt-6 rounded-xl bg-white p-5 text-sm text-slate-600" role="status">Loading order…</p>}
        {!isLoading && error && (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800" role="alert">
            <p>{error}</p>
            <Link className="mt-3 inline-block font-semibold underline" href="/orders">Return to my orders</Link>
          </div>
        )}
        {!isLoading && order && (
          <>
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-violet-700">Order saved</p>
              <h1 className="mt-1 text-2xl font-bold">{order.orderNumber}</h1>
              <p className="mt-2 text-sm text-slate-600">Placed <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString()}</time></p>
              <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h2 className="font-semibold text-amber-950">{order.status === "awaiting_payment" ? "Awaiting payment setup" : `Order status: ${order.status}`}</h2>
                <p className="mt-1 text-sm leading-6 text-amber-900">No payment was taken, and this order has not been sent to a seller or shipping carrier. Payment and fulfillment integrations are not connected, so live tracking is unavailable.</p>
              </div>
            </div>

            <section aria-labelledby="items-title" className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-bold" id="items-title">Items</h2>
              <ul className="mt-3 divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <li className="flex items-center gap-3 py-4" key={`${item.productId}-${item.variant ?? ""}-${index}`}>
                    <Image alt="" className="size-16 rounded-lg bg-slate-100 object-cover" height={64} src={item.image} unoptimized width={64} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.seller} · Qty {item.quantity}{item.variant ? ` · ${item.variant}` : ""}</p>
                    </div>
                    <span className="text-sm font-semibold">${((item.unitPriceCents * item.quantity) / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-100 pt-4 text-right text-sm font-bold">Subtotal: ${(order.subtotalCents / 100).toFixed(2)} {order.currency}</div>
            </section>

            <section aria-labelledby="shipping-title" className="mt-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
              <h2 className="text-lg font-bold" id="shipping-title">Shipping details submitted</h2>
              <address className="mt-3 text-sm not-italic leading-6 text-slate-600">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}<br />
                {order.shippingAddress.email}
              </address>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

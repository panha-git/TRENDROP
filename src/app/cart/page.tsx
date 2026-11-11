"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { addCartItem, CartItem, readCart, saveCart, useCartCount } from "@/lib/cart";
import { products } from "@/lib/catalog";
import { saveOrderReference } from "@/lib/orders";
import { createOrderSchema } from "@/lib/validation/order";

type CreatedOrder = {
  id: string;
  orderNumber: string;
};

const recommendations = products.filter((product) =>
  ["clipsound-transparent-earbuds", "glassskin-pept-hydrate-mist"].includes(product.id),
);

function Header() {
  const cartCount = useCartCount();
  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e3ef] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
        <Link className="shrink-0 text-lg font-extrabold tracking-tight text-violet-700 sm:text-xl" href="/">TRENDROP</Link>
        <nav aria-label="Buyer screens" className="flex items-center gap-3 text-xs font-semibold text-slate-600 sm:gap-5">
          <Link className="hidden hover:text-violet-700 sm:inline" href="/">Discover</Link>
          <Link className="hover:text-violet-700" href="/orders">Orders</Link>
          <Link className="hover:text-violet-700" href="/account">Account</Link>
          <Link aria-label={`Shopping cart, ${cartCount} items`} aria-current="page" className="rounded-lg bg-violet-50 px-3 py-2 text-violet-700" href="/cart">Cart ({cartCount})</Link>
        </nav>
      </div>
    </header>
  );
}

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setItems(readCart());
      } catch (loadError) {
        console.error("Could not load the cart from browser storage.", loadError);
        setError("Your saved cart could not be loaded. Check browser storage and try again.");
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotalCents = useMemo(
    () => items.reduce((total, item) => total + Math.round(item.price * 100) * item.quantity, 0),
    [items],
  );

  function updateCart(nextItems: CartItem[]) {
    try {
      saveCart(nextItems);
      setItems(nextItems);
      setError("");
    } catch (saveError) {
      console.error("Could not save the cart to browser storage.", saveError);
      setError("Cart changes could not be saved in this browser.");
    }
  }

  function changeQuantity(item: CartItem, delta: number) {
    if (delta > 0 && item.quantity >= 99) {
      setError("A product option cannot exceed a quantity of 99.");
      return;
    }
    updateCart(
      items
        .map((current) =>
          current.id === item.id && current.variant === item.variant
            ? { ...current, quantity: current.quantity + delta }
            : current,
        )
        .filter((current) => current.quantity > 0),
    );
  }

  function addRecommendation(product: (typeof recommendations)[number]) {
    try {
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setItems(readCart());
      setNotice(`${product.name} added to your cart.`);
    } catch (addError) {
      console.error("Could not add the recommendation to the cart.", addError);
      setError("Could not add that item. Please try again.");
    }
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!items.length) {
      setError("Add at least one product before placing an order.");
      return;
    }

    try {
      const storageTestKey = "trendrop-order-storage-check";
      window.localStorage.setItem(storageTestKey, "1");
      window.localStorage.removeItem(storageTestKey);
    } catch (storageError) {
      console.error("Browser storage is not available for order access.", storageError);
      setError("Enable browser storage before placing an order so you can access order history.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      items: items.map(({ id, quantity, variant }) => ({
        productId: id,
        quantity,
        ...(variant ? { variant } : {}),
      })),
      shippingAddress: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        address: formData.get("address"),
        city: formData.get("city"),
        region: formData.get("region"),
        postalCode: formData.get("postalCode"),
        country: formData.get("country"),
      },
    };

    const validation = createOrderSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Check your shipping details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result: {
        error?: string;
        accessToken?: string;
        order?: CreatedOrder;
      } = await response.json();

      if (!response.ok || !result.order || !result.accessToken) {
        setError(result.error ?? "The order could not be saved. Your cart is unchanged.");
        return;
      }

      try {
        saveOrderReference({ id: result.order.id, accessToken: result.accessToken });
        saveCart([]);
      } catch (storageError) {
        console.error("Could not save access to the newly created order.", storageError);
        setError(`Order ${result.order.orderNumber} was saved, but this browser could not store its private history access. Do not clear browser data; contact support with the order number.`);
        return;
      }

      router.push(`/orders/${result.order.id}`);
    } catch (requestError) {
      console.error("Order submission failed.", requestError);
      setError("Could not reach the order service. Your cart is unchanged; please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#faf8ff] text-[#131b2e]">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <ol aria-label="Checkout progress" className="mx-auto mb-7 flex max-w-2xl items-start">
          {["Shopping cart", "Shipping & save order"].map((label, index) => {
            const step = index + 1;
            return (
              <li className="flex min-w-0 flex-1 items-start gap-2" key={label}>
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${checkoutStep >= step ? "bg-violet-700 text-white" : "bg-slate-200 text-slate-600"}`}>{step}</span>
                <span className={`pt-1 text-xs font-semibold sm:text-sm ${checkoutStep >= step ? "text-violet-800" : "text-slate-500"}`}>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Demo catalog and checkout: orders are saved as <strong>awaiting payment</strong>. No payment is processed, and fulfillment is not triggered.
        </div>
        {error && <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800" role="alert">{error}</p>}
        {notice && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800" role="status">{notice}</p>}

        {checkoutStep === 1 && (
          <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,.8fr)]">
            <section className="min-w-0 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-4 py-4 shadow-sm sm:px-5">
                <h1 className="text-lg font-bold">Your cart <span className="text-sm font-normal text-slate-500">({itemCount} items)</span></h1>
                <Link className="text-sm font-semibold text-violet-700 hover:underline" href="/">Continue shopping</Link>
              </div>
              {!loaded ? (
                <p className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">Loading your saved cart…</p>
              ) : items.length === 0 ? (
                <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm">
                  <h2 className="text-lg font-bold">Your cart is empty</h2>
                  <p className="mt-2 text-sm text-slate-500">Choose a product to get started. Your cart will stay in this browser.</p>
                  <Link className="mt-5 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800" href="/">Browse products</Link>
                </div>
              ) : items.map((item) => (
                <article className="flex min-w-0 gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-sm sm:gap-4 sm:p-5" key={`${item.id}:${item.variant ?? ""}`}>
                  <Link aria-label={`View ${item.name}`} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-28" href={`/products/${products.find((product) => product.id === item.id)?.slug ?? "aeroglow"}`}>
                    <Image alt={item.name} className="object-cover" fill sizes="(max-width: 640px) 80px, 112px" src={item.image} unoptimized />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-500">{products.find((product) => product.id === item.id)?.seller}</p>
                    <h2 className="mt-1 break-words text-sm font-bold leading-5 text-slate-900 sm:text-base">{item.name}</h2>
                    {item.variant && <p className="mt-1 text-xs text-slate-600">Option: {item.variant}</p>}
                    <p className="mt-1 font-bold text-slate-900">${item.price.toFixed(2)} each</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-1">
                        <button aria-label={`Decrease ${item.name} quantity`} className="grid size-8 place-items-center rounded bg-slate-50 text-lg hover:bg-slate-100" disabled={item.quantity <= 1} onClick={() => changeQuantity(item, -1)} type="button">−</button>
                        <span aria-live="polite" className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button aria-label={`Increase ${item.name} quantity`} className="grid size-8 place-items-center rounded bg-slate-50 text-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50" disabled={item.quantity >= 99} onClick={() => changeQuantity(item, 1)} type="button">+</button>
                      </div>
                      <p className="text-sm font-bold">{formatPrice(Math.round(item.price * 100) * item.quantity)}</p>
                      <button aria-label={`Remove ${item.name}`} className="px-1 text-xs font-medium text-slate-500 hover:text-rose-700" onClick={() => updateCart(items.filter((current) => current !== item))} type="button">Remove</button>
                    </div>
                  </div>
                </article>
              ))}

              {items.length > 0 && (
                <section className="rounded-2xl bg-white p-4 sm:p-5">
                  <h2 className="font-bold">You may also like</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {recommendations.map((product) => (
                      <article className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 p-3" key={product.id}>
                        <Image alt={product.name} className="size-12 shrink-0 rounded-lg object-cover" height={48} src={product.image} unoptimized width={48} />
                        <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{product.name}</p><p className="mt-1 text-sm font-bold">${product.price.toFixed(2)}</p></div>
                        <button className="shrink-0 rounded-lg border border-violet-200 px-2.5 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50" onClick={() => addRecommendation(product)} type="button">Add</button>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </section>

            <aside className="min-w-0 rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-20">
              <h2 className="text-lg font-bold">Order summary</h2>
              <div className="mt-4 flex justify-between gap-3 text-sm"><span className="text-slate-600">Items subtotal</span><strong>{formatPrice(subtotalCents)}</strong></div>
              <p className="mt-3 text-xs leading-5 text-slate-500">Shipping and taxes are not calculated in this prototype. The backend verifies product prices before saving an order.</p>
              <p className="mt-4 border-t border-slate-100 pt-4 text-sm font-semibold">Payment is not connected; no charge will be made.</p>
              <button className="mt-5 w-full rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50" disabled={!loaded || !items.length} onClick={() => { setError(""); setCheckoutStep(2); }} type="button">Continue to shipping</button>
            </aside>
          </div>
        )}

        {checkoutStep === 2 && (
          <section className="mx-auto grid min-w-0 max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,.7fr)]">
            <div className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
              <button className="text-sm font-semibold text-violet-700 hover:underline" onClick={() => setCheckoutStep(1)} type="button">← Back to cart</button>
              <h1 className="mt-4 text-xl font-bold">Shipping contact</h1>
              <p className="mt-1 text-sm text-slate-500">This address is stored with your order. It is not sent to a carrier yet.</p>
              <form className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2" onSubmit={placeOrder}>
                <label className="min-w-0 text-sm font-medium">First name<input autoComplete="given-name" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={80} name="firstName" required /></label>
                <label className="min-w-0 text-sm font-medium">Last name<input autoComplete="family-name" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={80} name="lastName" required /></label>
                <label className="min-w-0 text-sm font-medium sm:col-span-2">Email<input autoComplete="email" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={254} name="email" required type="email" /></label>
                <label className="min-w-0 text-sm font-medium sm:col-span-2">Street address<input autoComplete="street-address" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={200} name="address" required /></label>
                <label className="min-w-0 text-sm font-medium">City<input autoComplete="address-level2" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={100} name="city" required /></label>
                <label className="min-w-0 text-sm font-medium">State / region<input autoComplete="address-level1" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={100} name="region" required /></label>
                <label className="min-w-0 text-sm font-medium">Postal code<input autoComplete="postal-code" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={20} name="postalCode" required /></label>
                <label className="min-w-0 text-sm font-medium">Country<input autoComplete="country-name" className="mt-1 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5" maxLength={80} name="country" required /></label>
                <button className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60 sm:col-span-2" disabled={isSubmitting || !items.length} type="submit">{isSubmitting ? "Saving order…" : `Save unpaid order · ${formatPrice(subtotalCents)}`}</button>
              </form>
            </div>
            <aside className="min-w-0 rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-bold">Items ({itemCount})</h2>
              <ul className="mt-3 space-y-3">{items.map((item) => <li className="flex min-w-0 justify-between gap-3 text-sm" key={`${item.id}:${item.variant ?? ""}`}><span className="min-w-0 break-words text-slate-600">{item.name}{item.variant ? ` · ${item.variant}` : ""} × {item.quantity}</span><strong className="shrink-0">{formatPrice(Math.round(item.price * 100) * item.quantity)}</strong></li>)}</ul>
              <div className="mt-4 flex justify-between border-t border-slate-100 pt-4 font-bold"><span>Items subtotal</span><span>{formatPrice(subtotalCents)}</span></div>
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Order status will be “Awaiting payment”. No payment, shipment, or seller notification is triggered.</p>
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

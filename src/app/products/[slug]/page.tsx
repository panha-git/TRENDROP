"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { addCartItem } from "@/lib/cart";
import { getProductBySlug } from "@/lib/catalog";

export default function CatalogProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const product = getProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(product?.variants?.[0] ?? "");
  const [error, setError] = useState("");

  if (!product || product.slug === "aeroglow") {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-xl font-bold">Product not found</h1>
        <Link className="mt-4 inline-block text-violet-700 underline" href="/">Return to the marketplace</Link>
      </main>
    );
  }

  function addToCart(andOpenCart = false) {
    if (!product) {
      return;
    }
    try {
      addCartItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          ...(variant ? { variant } : {}),
        },
        quantity,
      );
      setError("");
      if (andOpenCart) {
        router.push("/cart");
      } else {
        setError(`${product.name} added to your cart.`);
      }
    } catch (addError) {
      console.error("Could not add the product to the cart.", addError);
      setError("Could not add this product. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8ff] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link className="text-sm font-semibold text-violet-700 hover:underline" href="/">← Back to discovery</Link>
        <p className="mt-5 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">Sample marketplace listing · Prices shown in USD</p>
        <div className="mt-4 grid items-start gap-8 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <Image alt={product.name} className="object-cover" fill priority sizes="(max-width: 1024px) 100vw, 50vw" src={product.image} unoptimized />
          </div>
          <section className="min-w-0">
            <p className="text-sm font-semibold text-violet-700">{product.category} · {product.seller}</p>
            <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-600"><span className="text-amber-500">★</span> {product.rating} · sample rating</p>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              <span className="text-slate-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">{product.discount}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">Sample listing data only. Availability, shipping, and taxes are not connected to a live seller.</p>

            {product.variants && (
              <fieldset className="mt-6">
                <legend className="text-sm font-semibold">Choose an option</legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((option) => (
                    <button aria-pressed={variant === option} className={`rounded-lg border px-3 py-2 text-sm ${variant === option ? "border-violet-700 bg-violet-50 text-violet-800" : "border-slate-200"}`} key={option} onClick={() => setVariant(option)} type="button">{option}</button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-semibold">Quantity</span>
              <button aria-label="Decrease quantity" className="grid size-9 place-items-center rounded-lg border border-slate-200" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} type="button">−</button>
              <span aria-live="polite" className="min-w-6 text-center font-semibold">{quantity}</span>
              <button aria-label="Increase quantity" className="grid size-9 place-items-center rounded-lg border border-slate-200" disabled={quantity >= 99} onClick={() => setQuantity((current) => Math.min(99, current + 1))} type="button">+</button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button className="rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white hover:bg-violet-800" onClick={() => addToCart(true)} type="button">Buy now · ${(product.price * quantity).toFixed(2)}</button>
              <button className="rounded-xl border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50" onClick={() => addToCart()} type="button">Add to cart</button>
            </div>
            {error && <p className={`mt-4 rounded-lg p-3 text-sm ${error.includes("added") ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`} role={error.includes("added") ? "status" : "alert"}>{error}</p>}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <h2 className="font-semibold">About this listing</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">This product is part of TRENDROP’s sample catalog. Add it to the cart to see the saved quantity and item price. Checkout saves an unpaid order preview; it does not charge you or arrange shipping.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

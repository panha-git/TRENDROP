"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addCartItem, CartItem, readCart, saveCart, useCartCount } from "@/lib/cart";

const demoCart: CartItem[] = [
  {
    id: "aeroglow-rgb-audio-lamp",
    name: "AeroGlow RGB Smart Sunset Lamp",
    price: 19.99,
    quantity: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaLetf-5xEYkI5XZJeDR71qBLVGGoN2XYy-ZCaB_ubI15iShb2E3GRNICUWHwIRMlOXo3ztBRZWH7MOd7ucoKBcGdEDfdgpEBUw175ONRWJlPjrOy835GFCXb0rsW2m334KYyLabnImjdmAxjHJu9MCaynIxpFLk4t6IKuWo",
  },
  {
    id: "syncpulse-neon-audio-visualizer",
    name: "SyncPulse Neon Audio Visualizer Flow Bar",
    price: 18.5,
    quantity: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS8pyIFCjzynUpdY_0w5LglcOTT_K1fY1gR6k5wBHPqiiCo1TJ_bSdn4E4_9NZjECa5teC4DD9MLsjgkmnxIQEAiy77yHKj9HhojCuyfNRxaWcCVVRh3XwRZAxckM1b1ybPJsSRQlfJceHQblkpn6ExsR2yIMjzTQUba7OCh",
  },
  {
    id: "glassskin-pept-hydrate-mist",
    name: "GlassSkin Pept-Hydrate Micro-Mist",
    price: 16.5,
    quantity: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAD3Fl-XFIm8ArgwN3J_zkfdwxFVguBFPy2PUsLgbUtg_ukyFSJ0mfgWaX3PMT-8onON0sMSyDF_4M5Jt4zYxKJVjx82sWXSnisWLr4u1-_DjMzcKlI-MvFX-Ws8QqYeyApBDhXfGflK4ZMwBoIJMXN5VNKsNR6491X6CVaSX",
  },
];

const recommendations = [
  {
    id: "carbon-fiber-desk-pivot-stand",
    name: "Carbon-Fiber Desk Pivot Stand",
    description: "Universal fit for SyncPulse",
    price: 14.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1VFqQDuq2HQ88WTBh0C_65xhG96vxUcsKHAgG2LeIb1kjt78Rm28GRTsg9eoOeuEG45x1ZnVLkxYlpjg1wwMhqvR9PxPHlDJHEqxA87MG4tctMGf8gd3hlAkHjnaV2R4sUwrnLOppwu7HLPR0HVklsA3wO3ZvP1Wb2klB0P",
  },
  {
    id: "65w-gan-fast-hub",
    name: "65W GaN Fast Hub Adapter",
    description: "Dual USB-C 3.0",
    price: 21.99,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDR0Z_kYPz8SjzA7CB492UIpQ0C07arzKVq86-QLnb4frMTHYxUe6LZdxjkJ1o1vNa9HYX2ooi6cLPH2FIBnlvsnrsoB8M3dmJcMeYcN7oPeIKYKbT_0NzX8Gf-MysBLixynSzqE6UrLW97LKALLB855F0jfYgzYgRvwQhHkW",
  },
];

function Header() {
  const cartCount = useCartCount();
  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e3ef] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-violet-700" href="/"><span className="text-rose-600">♨</span> TRENDROP</Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link className="hover:text-violet-700" href="/">Trending Drops</Link><Link className="hover:text-violet-700" href="/">Flash Deals</Link><Link className="hover:text-violet-700" href="/">Categories</Link><Link className="hover:text-violet-700" href="/orders">Orders</Link><Link className="hover:text-violet-700" href="/account">Account</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden rounded-xl border border-[#e4e2f0] bg-[#f6f5ff] px-3 py-2 text-xs text-slate-500 lg:inline">⌕ &nbsp; Search viral drops &amp; creators...</span>
          <Link aria-label="Shopping cart" aria-current="page" className="relative rounded-lg bg-violet-50 p-2 text-lg text-violet-700" href="/cart">♧<span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">{cartCount}</span></Link>
          <Link className="flex items-center gap-2 text-sm font-semibold text-slate-700" href="/account"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-xs text-white">AK</span><span className="hidden sm:inline">Alex Kim</span></Link>
        </div>
      </div>
      <nav aria-label="Buyer screens" className="mx-auto flex max-w-[1440px] justify-around border-t border-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 md:hidden">
        <Link href="/orders">Orders</Link><Link href="/cart">Cart</Link><Link href="/account">Account</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t border-[#e4e2f0] bg-[#f1f1ff] px-5 py-9 text-sm text-slate-600">
      <div className="mx-auto grid max-w-[1440px] gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div><Link className="font-extrabold text-violet-700" href="/">♨ TRENDROP</Link><p className="mt-3 max-w-xs text-xs leading-5">The next-gen marketplace for hyper-viral products, flash live drops, and verified social commerce.</p><p className="mt-3 text-xs font-semibold text-teal-800">✦ 100% Authentic Drops</p></div>
        <div><p className="mb-3 text-[10px] font-bold uppercase tracking-widest">Discovery</p><p>Trending Drops</p><p className="mt-2">Live Flash Sales</p><p className="mt-2">Curated Categories</p></div>
        <div><p className="mb-3 text-[10px] font-bold uppercase tracking-widest">Customer Care</p><Link className="block" href="/orders">Track Order</Link><Link className="mt-2 block" href="/cart">Cart &amp; Checkout</Link><p className="mt-2">Returns &amp; Refunds</p></div>
        <div><p className="mb-3 text-[10px] font-bold uppercase tracking-widest">Sellers &amp; Partners</p><p>Seller Command Hub</p><p className="mt-2">Merchant Fulfillment</p><p className="mt-2">Apply to Sell</p></div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1440px] flex-wrap justify-between gap-3 border-t border-[#dfdeed] pt-5 text-xs"><span>© 2025 TRENDROP Global Inc. All rights reserved.</span><span>🔒 Encrypted 256-Bit Vault &nbsp; · &nbsp; 🚚 Global Tracked Fulfillment</span></div>
    </footer>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [coupon, setCoupon] = useState("VIRAL20");
  const [discountApplied, setDiscountApplied] = useState(true);
  const [couponMessage, setCouponMessage] = useState("");
  const [notice, setNotice] = useState("");
  const cartCount = useCartCount();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = readCart();
        if (saved.length === 0 && window.localStorage.getItem("trendrop-cart") === null) {
          saveCart(demoCart);
          setItems(demoCart);
        } else {
          setItems(saved);
        }
      } catch (error) {
        console.error("Could not load the cart from browser storage.", error);
        setItems([]);
        setNotice("Cart could not be loaded from this browser.");
      } finally {
        setLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const discount = discountApplied && items.length > 0 ? 4 : 0;
  const tax = Math.max(0, subtotal - discount) * 0.0846;
  const total = Math.max(0, subtotal - discount + tax);

  function updateCart(nextItems: CartItem[]) {
    try {
      saveCart(nextItems);
      setItems(nextItems);
    } catch (error) {
      console.error("Could not save the cart to browser storage.", error);
      setNotice("Cart could not be saved in this browser.");
      window.setTimeout(() => setNotice(""), 2600);
    }
  }

  function changeQuantity(id: string, delta: number) {
    updateCart(items
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  }

  function addRecommendation(product: (typeof recommendations)[number]) {
    try {
      addCartItem({ id: product.id, name: product.name, price: product.price, image: product.image });
      setItems(readCart());
      setNotice(`${product.name} added to your cart.`);
    } catch (error) {
      console.error("Could not add the recommendation to the cart.", error);
      setNotice("Could not add that item right now.");
    }
    window.setTimeout(() => setNotice(""), 2600);
  }

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "VIRAL20") {
      setDiscountApplied(true);
      setCouponMessage("Creator drop code applied — $4.00 saved.");
    } else {
      setDiscountApplied(false);
      setCouponMessage("That creator code isn’t valid. Try VIRAL20.");
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <Header />
      <div className="bg-[#b9082c] px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 text-xs">
          <p><span className="mr-2 inline-flex h-2.5 w-2.5 rounded-full bg-white" /><strong className="uppercase tracking-wide">High Velocity Demand:</strong> <span className="ml-1 text-white/90">2 items in your cart have critically low inventory (only 14 units left). Cart inventory reservation is active.</span></p>
          <span className="rounded-full bg-black/20 px-3 py-1 font-semibold">◴ &nbsp;9:14</span>
        </div>
      </div>
      <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-9">
        <div className="mx-auto mb-7 flex max-w-[860px] items-start">
          {["Shopping Cart", "Shipping Details", "Escrow Payment"].map((label, index) => {
            const step = index + 1;
            return <div className="relative flex-1 text-center" key={label}>
              {index < 2 && <span className={`absolute left-1/2 top-5 h-1 w-full ${checkoutStep > step ? "bg-violet-700" : "bg-[#dce2ff]"}`} />}
              <button aria-current={checkoutStep === step ? "step" : undefined} className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-[#faf8ff] ${checkoutStep === step ? "bg-violet-700 text-white" : checkoutStep > step ? "bg-violet-200 text-violet-900" : "bg-[#dce2ff] text-slate-600"}`} onClick={() => step < checkoutStep && setCheckoutStep(step)} type="button">{step}</button>
              <p className={`mt-2 text-xs font-bold uppercase tracking-wide sm:text-sm ${checkoutStep === step ? "text-violet-700" : "text-slate-600"}`}>{label}</p>
            </div>;
          })}
        </div>

        {checkoutStep === 1 && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(350px,.9fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-5 py-4 shadow-sm"><h1 className="text-lg font-bold">Your Selected Drops <span className="ml-2 rounded-full bg-[#f0e6ff] px-3 py-1 text-sm text-violet-700">{items.length} DROPS</span></h1><span className="text-sm text-slate-600">{loaded ? `${itemCount} items total` : "Loading cart…"}</span></div>
            {!loaded ? <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">Loading your saved cart…</div> : items.length === 0 ? <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm"><span className="text-4xl">🛍️</span><h2 className="mt-4 text-lg font-bold">Your cart is waiting for a drop</h2><p className="mt-2 text-sm text-slate-500">Explore what’s trending and add something you love.</p><Link className="mt-5 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-800" href="/">Explore trending drops</Link></div> : items.map((item, index) => {
              const isAeroGlow = `${item.id} ${item.name}`.toLowerCase().includes("aeroglow");
              return <article className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm" key={item.id}>
                {index === 0 && <span className="absolute right-0 top-0 rounded-bl-xl bg-[#b9082c] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">⚡ −60% Flash Drop</span>}
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link className="relative h-32 w-full shrink-0 overflow-hidden rounded-xl bg-[#eeedfb] sm:h-32 sm:w-32" href={isAeroGlow ? "/products/aeroglow" : "/"}><Image alt={item.name} className="object-cover" fill sizes="(max-width: 640px) 100vw, 128px" src={item.image || demoCart[0].image} unoptimized /></Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{index === 0 ? "NOVATECH STUDIO" : index === 1 ? "PULSETECH LABS" : "GLOWLAB SEOUL"} <span className="ml-1 text-teal-800">✦ Verified</span></p>
                    <Link className="mt-1 block font-bold text-slate-900 hover:text-violet-700" href={isAeroGlow ? "/products/aeroglow" : "/"}>{item.name}</Link>
                    <p className="mt-1 text-sm text-slate-600">{isAeroGlow ? "Color: Cosmic Violet • Version 2.0" : index === 1 ? "Finish: Matte Black • 32-Bit Micro-Chip" : "Free 15ml Barrier Cream Sample Included"}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-lg bg-[#edf0ff] px-2.5 py-1 font-semibold text-teal-800">{isAeroGlow ? "♢ 30-Day Escrow Vault Protection" : "🚚 Ships within 24h • Tracked"}</span>{isAeroGlow ? <span className="px-1 py-1 font-semibold text-rose-700">⚠ Only 4 Units Left</span> : <span className="px-1 py-1 font-medium text-slate-600">In Stock</span>}</div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1 rounded-xl bg-[#f0f1ff] p-1"><button aria-label={`Decrease ${item.name} quantity`} className="h-8 w-8 rounded-lg bg-white font-bold hover:text-violet-700" onClick={() => changeQuantity(item.id, -1)} type="button">−</button><span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} className="h-8 w-8 rounded-lg bg-white font-bold hover:text-violet-700" onClick={() => changeQuantity(item.id, 1)} type="button">+</button></div>
                      <p className="font-bold">${(item.price * item.quantity).toFixed(2)} {item.quantity > 1 && <span className="ml-1 text-xs font-normal text-slate-500">(${item.price.toFixed(2)} each)</span>}</p>
                      <div className="flex gap-3"><button className="text-sm text-slate-600 hover:text-violet-700" onClick={() => setNotice(`${item.name} saved to your wishlist.`)} type="button">☆ Save</button><button aria-label={`Remove ${item.name}`} className="text-sm text-slate-500 hover:text-rose-600" onClick={() => updateCart(items.filter((cartItem) => cartItem.id !== item.id))} type="button">▤ Remove</button></div>
                    </div>
                  </div>
                </div>
              </article>;
            })}
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-bold uppercase tracking-wide text-violet-700">Algorithmic Recommendations</p><h2 className="mt-1 font-bold">Frequently Added with Your Drops</h2></div><p className="text-sm text-slate-600">Ships combined • Save $6 on freight</p></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">{recommendations.map((product) => <article className="flex items-center gap-3 rounded-xl border border-[#e3e1f1] bg-[#f4f3ff] p-3" key={product.id}><Image alt={product.name} className="h-14 w-14 rounded-lg object-cover" height={56} src={product.image} unoptimized width={56} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="truncate text-xs text-slate-600">{product.description}</p><p className="text-sm font-bold">${product.price.toFixed(2)}</p></div><button className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100" onClick={() => addRecommendation(product)} type="button">＋ Add</button></article>)}</div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-20">
            <section className="rounded-2xl bg-white p-5 shadow-md sm:p-6">
              <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-bold">Order Summary</h2><span className="rounded-full bg-cyan-100 px-3 py-1.5 text-sm font-semibold text-slate-800">🔒 Escrow Secured</span></div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-slate-600"><span>Subtotal ({itemCount} items)</span><strong className="text-slate-900">${subtotal.toFixed(2)}</strong></div>
                {discountApplied && items.length > 0 && <div className="flex items-center justify-between rounded-xl bg-[#f3edff] px-3 py-2 text-violet-800"><span>◇ VIRAL20 (Creator Drop)</span><button aria-label="Remove coupon" className="font-bold" onClick={() => { setDiscountApplied(false); setCouponMessage(""); }} type="button">−${discount.toFixed(2)} ×</button></div>}
                <div className="flex justify-between text-slate-600"><span>Estimated Shipping ⓘ</span><strong className="text-teal-800">FREE</strong></div>
                <div className="flex justify-between text-slate-600"><span>Escrow Vault Guarantee</span><strong className="text-teal-800">$0.00 (Covered)</strong></div>
                <div className="flex justify-between text-slate-600"><span>Estimated Sales Tax</span><strong className="text-slate-900">${tax.toFixed(2)}</strong></div>
                <div className="border-t border-slate-200 pt-4"><div className="flex justify-between font-bold"><span>Total Due</span><span>${total.toFixed(2)}</span></div><p className="mt-1 text-xs text-teal-800">You save ${items.length ? (34 + discount).toFixed(2) : "0.00"} on this drop</p></div>
              </div>
              <button className="mt-5 w-full rounded-xl bg-violet-700 px-4 py-3.5 font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50" disabled={!items.length} onClick={() => setCheckoutStep(2)} type="button">🔒 Proceed to Checkout (${total.toFixed(2)})</button>
              <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-slate-500 before:h-px before:flex-1 before:bg-slate-200 after:h-px after:flex-1 after:bg-slate-200">Or Express Checkout</div>
              <div className="grid grid-cols-3 gap-2"><button className="rounded-lg bg-[#20283c] px-2 py-2.5 font-bold text-white" onClick={() => setNotice("Apple Pay express checkout selected.")} type="button">● Pay</button><button className="rounded-lg bg-[#edf0ff] px-2 py-2.5 font-bold" onClick={() => setNotice("Google Pay express checkout selected.")} type="button">G Pay</button><button className="rounded-lg bg-[#063b8c] px-2 py-2.5 font-bold italic text-white" onClick={() => setNotice("PayPal express checkout selected.")} type="button">PayPal</button></div>
              <div className="mt-5 rounded-xl border border-[#e2e0f0] bg-[#f5f4ff] p-3.5"><label className="text-xs font-bold uppercase tracking-wide text-slate-600" htmlFor="coupon">Have a creator code?</label><div className="mt-2 flex gap-2"><input className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm uppercase outline-none focus:border-violet-500" id="coupon" onChange={(event) => setCoupon(event.target.value)} placeholder="E.G. DROPSHIP50" value={coupon} /><button className="rounded-lg bg-[#20243a] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800" onClick={applyCoupon} type="button">Apply</button></div>{couponMessage && <p className={`mt-2 text-xs ${discountApplied ? "text-teal-800" : "text-rose-700"}`} role="status">{couponMessage}</p>}</div>
              <div className="mt-5 space-y-2 border-t border-slate-200 pt-4 text-xs leading-5">
                <p className="rounded-xl bg-[#f5f6ff] p-3"><strong>♢ 256-Bit Escrow Vault:</strong> Funds locked until delivery confirmation.</p><p className="rounded-xl bg-[#f5f6ff] p-3"><strong>↶ Frictionless Free Returns:</strong> Automatic prepaid return labels within 30 days.</p><p className="rounded-xl bg-[#f5f6ff] p-3"><strong>▣ Stripe Financial Rail:</strong> PCI-DSS Level 1 compliance with zero stored card data.</p>
              </div>
            </section>
            <div className="flex items-center gap-4 rounded-2xl bg-[#e9eaff] p-5"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white">♙</span><p><strong className="block">Buyer Protection Standard</strong><span className="text-sm text-slate-600">Payment released to sellers only post-delivery.</span></p></div>
          </aside>
        </div>}

        {checkoutStep === 2 && <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm"><button className="text-sm font-semibold text-violet-700" onClick={() => setCheckoutStep(1)} type="button">← Back to cart</button><h1 className="mt-4 text-xl font-bold">Shipping Details</h1><p className="mt-1 text-sm text-slate-500">Where should your verified drops be delivered?</p>
            <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); setCheckoutStep(3); }}>
              <label className="text-sm font-medium">First name<input autoComplete="given-name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required defaultValue="Alex" /></label><label className="text-sm font-medium">Last name<input autoComplete="family-name" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required defaultValue="Kim" /></label>
              <label className="text-sm font-medium sm:col-span-2">Street address<input autoComplete="street-address" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required placeholder="123 Main Street" /></label>
              <label className="text-sm font-medium">City<input autoComplete="address-level2" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required placeholder="Austin" /></label><label className="text-sm font-medium">ZIP code<input autoComplete="postal-code" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required placeholder="78701" /></label>
              <label className="text-sm font-medium sm:col-span-2">Email for delivery updates<input autoComplete="email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5" required type="email" placeholder="you@example.com" /></label>
              <button className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white hover:bg-violet-800 sm:col-span-2" type="submit">Continue to Escrow Payment · ${total.toFixed(2)}</button>
            </form>
          </div><aside className="h-fit rounded-2xl bg-white p-6 shadow-sm"><h2 className="font-bold">Order Summary</h2><p className="mt-4 flex justify-between text-sm text-slate-600"><span>{itemCount} items</span><strong>${subtotal.toFixed(2)}</strong></p><p className="mt-2 flex justify-between text-sm text-slate-600"><span>Shipping</span><strong>Free</strong></p><p className="mt-4 flex justify-between border-t pt-4 font-bold"><span>Total</span><span>${total.toFixed(2)}</span></p><p className="mt-4 rounded-xl bg-[#f5f4ff] p-3 text-xs leading-5">🔒 Your payment stays in the buyer escrow vault until delivery is verified.</p></aside>
        </section>}

        {checkoutStep === 3 && <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-9"><button className="text-sm font-semibold text-violet-700" onClick={() => setCheckoutStep(2)} type="button">← Back to shipping details</button><div className="mt-6 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 text-2xl">🔒</span><h1 className="mt-4 text-2xl font-bold">Escrow Payment</h1><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Choose a secure payment method to continue. This preview does not submit a payment or create an order.</p></div><div className="mt-6 space-y-3"><button className="flex w-full items-center justify-between rounded-xl border-2 border-violet-600 bg-violet-50 p-4 text-left"><span><strong className="block">Credit or debit card</strong><span className="text-xs text-slate-500">Protected checkout</span></span><span className="text-violet-700">●</span></button><button className="w-full rounded-xl border border-slate-200 p-4 text-left font-semibold hover:bg-slate-50" onClick={() => setNotice("Express wallet selected.")} type="button">Apple Pay / Google Pay</button></div><button className="mt-5 w-full rounded-xl bg-violet-700 px-5 py-3.5 font-bold text-white hover:bg-violet-800" onClick={() => setNotice("Payment is not connected in this preview.")} type="button">Continue securely · ${total.toFixed(2)}</button><p className="mt-3 text-center text-xs text-slate-500">🔒 Secure checkout preview · No payment is processed</p></section>}
      </main>
      <Footer />
      {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl" role="status">{notice}</div>}
      <span className="sr-only" aria-live="polite">{cartCount} items in cart</span>
    </div>
  );
}

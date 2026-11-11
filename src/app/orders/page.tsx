"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCartCount } from "@/lib/cart";

type OrderFilter = "All Orders" | "Active / In-Transit" | "Delivered" | "Cancelled / Returned";

const filters: { label: OrderFilter; count: number }[] = [
  { label: "All Orders", count: 8 },
  { label: "Active / In-Transit", count: 2 },
  { label: "Delivered", count: 5 },
  { label: "Cancelled / Returned", count: 1 },
];

const pastOrders = [
  {
    name: "GlowHydrate Smart UV Bottle",
    order: "#TR-87210",
    seller: "Lumina Lifestyle",
    date: "Delivered Oct 12",
    price: "$18.00",
    carrier: "DHL Tracked",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADbMu6hrFOlQM9IKdIMq1EcU_Z_s-f71d6k252OGDSjjRS8Wy0jbTFTOVkAtO0UtifwaKakMtHgURz7H63YXMhsnDxd88uDAlR1ktMvTaUgWhfYHOaeCePkb2rgQwlsgk2U6ohI0vDYS3cNGlrZ0bNs6RMATI97hxfmpKyDe",
  },
  {
    name: "ClipSound Transparent Earbuds",
    order: "#TR-76192",
    seller: "PulseAudio Labs",
    date: "Delivered Sep 28",
    price: "$34.90",
    carrier: "USPS Ground",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC1MH2m1o8meXSsfKfXqWC6V8Vlkd8I-57BXt-_ZINCYmw1drtYHdyFUcYyPyK_56tMfDahKv1KJKQ69jLWI6zoivuhMPZjLLFQCDJbtQlM5q2gCGAgSlPUFSRcj3_iO862b_R_e5gZCMqH2K3CV5Lt538-QerHxLmMkMvMw",
  },
];

const journey = [
  ["Order Confirmed", "Oct 24, 2:15 PM", "Payment in escrow"],
  ["Vault Verified", "Oct 24, 6:40 PM", "Serial #8912 logged"],
  ["FedEx Express", "Oct 25, 9:10 AM", "Oakland Hub"],
  ["Out for Delivery", "Today, ~4:30 PM", "Austin local courier"],
  ["Escrow Release", "+48h delivery window", "Locked in vault"],
];

function Header() {
  const cartCount = useCartCount();
  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e3ef] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-violet-700" href="/">
            <span className="text-rose-600">♨</span> TRENDROP
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link className="hover:text-violet-700" href="/">Trending Drops</Link>
            <Link className="hover:text-violet-700" href="/">Flash Deals</Link>
            <Link className="hover:text-violet-700" href="/">Categories</Link>
            <Link aria-current="page" className="border-b-2 border-violet-700 py-5 font-bold text-violet-700" href="/orders">Orders</Link>
            <Link className="hover:text-violet-700" href="/account">Account</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden rounded-xl border border-[#e4e2f0] bg-[#f6f5ff] px-3 py-2 text-xs text-slate-500 lg:inline">⌕ &nbsp; Search viral drops &amp; creators...</span>
          <Link aria-label="Shopping cart" className="relative rounded-lg p-2 text-lg text-slate-600 hover:bg-violet-50 hover:text-violet-700" href="/cart">
            ♧<span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">{cartCount}</span>
          </Link>
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

export default function OrdersPage() {
  const [filter, setFilter] = useState<OrderFilter>("All Orders");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);

  const visiblePastOrders = useMemo(
    () => pastOrders.filter((order) => `${order.name} ${order.order} ${order.seller}`.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );
  const activeMatchesQuery = "order tr-98241 aeroglow rgb sunset matrix lamp syncpulse novatech studio nova tech".includes(query.trim().toLowerCase());
  const showActive = (filter === "All Orders" || filter === "Active / In-Transit") && activeMatchesQuery;
  const showDelivered = (filter === "All Orders" || filter === "Delivered") && visiblePastOrders.length > 0;

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#171a2a]">
      <Header />
      <div className="border-b border-violet-100 bg-[#e7e8ff] px-4 py-2.5 text-sm text-slate-700">
        <div className="mx-auto flex max-w-[1370px] flex-wrap items-center justify-between gap-2">
          <p><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-700 text-white">✓</span><strong className="text-violet-800">TRENDROP ESCROW VAULT:</strong> Funds remain locked in buyer escrow until 48 hours post-verified delivery.</p>
          <span className="text-xs">🔒 Zero-Fraud Guarantee &nbsp; · &nbsp; <a className="font-semibold text-violet-800" href="#protection">Vault Policy</a></span>
        </div>
      </div>
      <main className="mx-auto max-w-[1370px] px-4 py-7 sm:px-6 lg:px-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.15em] text-violet-700">Verified Drops Command &nbsp;/&nbsp; <span className="font-normal text-slate-500">Buyer Portal</span></p><h1 className="mt-1 text-lg font-semibold">My Orders &amp; Drop Tracking</h1></div>
          <p className="rounded-full bg-[#f0effa] px-4 py-2 text-sm"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-rose-600" /> <strong>1 Package</strong> arriving before 4:30 PM</p>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-[#f0effb] p-1">
            {filters.map((tab) => <button key={tab.label} className={`shrink-0 rounded-lg px-3 py-2 text-xs transition ${filter === tab.label ? "bg-[#20243a] font-semibold text-white" : "text-slate-600 hover:bg-white"}`} onClick={() => setFilter(tab.label)} type="button">{tab.label} <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${filter === tab.label ? "bg-white/20" : "bg-violet-100 text-violet-700"}`}>{tab.count}</span></button>)}
          </div>
          <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-500 shadow-sm lg:w-[360px]"><span>⌕</span><input aria-label="Search orders" className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0" onChange={(event) => setQuery(event.target.value)} placeholder="Search orders by item name or order ID (#)" value={query} /></label>
        </div>

        {showActive && (
          <section className="mt-7 overflow-hidden rounded-2xl border border-[#ebe9f4] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f5f4ff] px-5 py-4">
              <div className="flex flex-wrap items-center gap-3 text-sm"><strong>Order #TR-98241</strong><button aria-label="Copy order number" className="text-slate-500 hover:text-violet-700" onClick={() => notify("Order number copied.")} type="button">▣</button><span className="hidden text-slate-300 sm:inline">|</span><span className="text-slate-600">Placed Oct 24, 2025</span><strong className="text-violet-700">$56.99</strong><span className="text-slate-600">(2 items)</span></div>
              <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-[#ecebff] px-3 py-1.5 text-xs font-medium text-violet-800">▣ NovaTech Studio <span className="ml-1 rounded bg-white px-2 py-1 text-teal-800">✓ VERIFIED</span></span><span className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-medium text-white">● {receiptConfirmed ? "Delivered" : "Out for Delivery"}</span></div>
            </div>
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">🚚 Fulfillment Journey</h2><p className="text-sm font-semibold text-violet-700">Estimated Delivery: Today by 4:30 PM</p></div>
              <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
                <ol className="relative ml-3 space-y-4 border-l-2 border-violet-100 pl-5">
                  {journey.map(([title, time, note], index) => {
                    const complete = index < 3 || (index === 3 && receiptConfirmed);
                    return <li className="relative flex justify-between gap-3" key={title}><span className={`absolute -left-[1.72rem] top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${complete ? "bg-violet-700 text-white" : "border-2 border-violet-200 bg-white text-violet-400"}`}>{complete ? "✓" : index + 1}</span><div><p className={`text-sm font-semibold ${complete ? "text-slate-800" : "text-slate-500"}`}>{index + 1}. {title}</p><p className="mt-0.5 text-xs text-slate-500">{note}</p></div><span className="shrink-0 text-right text-xs text-slate-500">{time}</span></li>;
                  })}
                </ol>
                <div className="space-y-3">
                  <div className="relative min-h-44 overflow-hidden rounded-xl border border-[#e2e4f3] bg-[radial-gradient(ellipse_at_25%_30%,#e0e5fc_0%,transparent_34%),radial-gradient(ellipse_at_75%_70%,#e5e2fb_0%,transparent_35%),linear-gradient(135deg,#f1f3fc,#e8ebfa)] p-4">
                    <div className="absolute left-[22%] top-[35%] h-24 w-[62%] rotate-[-18deg] rounded-full border-t-2 border-dashed border-violet-500" />
                    <span className="absolute left-[15%] top-[25%] rounded-full bg-white px-2 py-1 text-[10px] shadow">Oakland, CA</span><span className="absolute bottom-[18%] right-[8%] rounded-full bg-white px-2 py-1 text-[10px] shadow">Austin, TX · Destination</span>
                    <span className="absolute left-[49%] top-[42%] flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-white shadow-lg">🚚</span>
                    <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/90 p-3 shadow-sm backdrop-blur"><p className="text-sm font-semibold">Live Telemetry <span className="float-right rounded-full bg-teal-50 px-2 py-1 text-[10px] text-teal-800">Priority Express</span></p><p className="mt-1 text-xs text-slate-600">FedEx #FX-8849201948US · Driver is 4 stops away</p><p className="mt-1 text-xs font-semibold text-violet-700">Courier #710-TX &nbsp; · &nbsp; Est. arrival ~18 mins</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["AeroGlow RGB Sunset Matrix Lamp", "Obsidian Black • Qty: 1", "$19.99", "https://lh3.googleusercontent.com/aida-public/AB6AXuDr3wEokd5RAPE64BpZpzwCOLiH63xbp9Fmn9dy5sVt767jbrx7lRUKIo_eKIeECP943PR_6svpXXyYlr7h8A0O4Q6OEnnpnE0p_0jvjsewUyyejPcmKcOMWVXUIMH3FddJY3ZvXN9CP5HGbCH5_6CIT0o2Woz4qlhUd8ntMd"],
                      ["SyncPulse Neon Bar", "Sound Sync Edition • Qty: 1", "$37.00", "https://lh3.googleusercontent.com/aida-public/AB6AXuAYJY-qwouDqO5xVQS7WrWk-DUjuiZEc1p_5Qte7lH6IQQ_E985jeeI0BoSxoYFqZiiOl5_izNBwjA2e6iubsjDCiDnEmP3lUhLfbYAKWu32lzdD7s_ESWC_JIZu9OhcHTtKM2vVt2GrdB0b-y-cdtyMA30ImqMk8sE_iNc-B"],
                    ].map(([name, description, price, image]) => <div className="flex min-w-0 items-center gap-2 rounded-xl bg-[#f6f5ff] p-2" key={name}><Image alt={name} className="h-12 w-12 rounded-lg object-cover" height={48} src={image} unoptimized width={48} /><div className="min-w-0"><p className="truncate text-xs font-semibold">{name}</p><p className="truncate text-[10px] text-slate-500">{description}</p><p className="text-xs font-semibold text-violet-700">{price} · In Package</p></div></div>)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm text-slate-600">🔒 Escrow Protection Hold: <strong className="text-slate-900">$56.99 held safely</strong></p>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50" onClick={() => notify("Your invoice is ready to view.")} type="button">▤ View Invoice / Receipt</button>
                <button className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50" onClick={() => notify("Seller contact options are ready.")} type="button">☏ Contact Seller</button>
                <button className="rounded-lg border border-rose-400 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50" onClick={() => notify("Issue report opened for order #TR-98241.")} type="button">⚠ Report Issue / Hold Escrow</button>
                <button className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-800 disabled:opacity-60" disabled={receiptConfirmed} onClick={() => { setReceiptConfirmed(true); notify("Receipt confirmed. Escrow remains protected for 48 hours."); }} type="button">{receiptConfirmed ? "✓ Receipt Confirmed" : "✓ Confirm Receipt Early"}</button>
              </div>
            </div>
          </section>
        )}

        {showDelivered && (
          <section className="mt-8">
            <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="font-semibold">Past Orders &amp; Drops</h2><p className="mt-1 text-sm text-slate-500">Archived orders with completed escrows and authentic delivery tokens.</p></div><span className="text-xs font-medium uppercase tracking-widest text-slate-500">5 total completed</span></div>
            <div className="mt-4 space-y-3">
              {visiblePastOrders.map((order) => <article className="flex flex-col gap-4 rounded-xl border border-[#e9e7f2] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between" key={order.order}>
                <div className="flex min-w-0 items-center gap-3"><Image alt={order.name} className="h-14 w-14 rounded-lg object-cover" height={56} src={order.image} unoptimized width={56} /><div className="min-w-0"><p className="truncate text-sm font-semibold">{order.name} <span className="ml-1 rounded-full bg-[#e7efff] px-2 py-1 text-[10px] text-teal-800">✓ {order.date}</span></p><p className="mt-1 text-xs text-slate-600">Order {order.order} · {order.carrier} · Seller: <span className="font-medium text-violet-700">{order.seller}</span></p><p className="mt-1 text-xs font-semibold">{order.price} &nbsp;·&nbsp; <span className="text-teal-800">ESCROW DISBURSED</span></p></div></div>
                <div className="flex flex-wrap gap-2"><button className="rounded-lg bg-[#f2f1ff] px-3 py-2 text-xs font-semibold hover:bg-violet-100" onClick={() => notify(`Invoice opened for ${order.order}.`)} type="button">↓ Invoice</button><button className="rounded-lg bg-[#f2f1ff] px-3 py-2 text-xs font-semibold hover:bg-violet-100" onClick={() => notify(`Review form opened for ${order.name}.`)} type="button">☆ Write Review <span className="text-violet-700">+50 Pts</span></button><button className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-800" onClick={() => notify(`${order.name} added to your cart.`)} type="button">↻ Buy Again</button></div>
              </article>)}
              {visiblePastOrders.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No orders match “{query}”. Try another item name or order ID.</p>}
            </div>
          </section>
        )}

        {filter === "Cancelled / Returned" && <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No cancelled or returned orders to display.</div>}
        {!showActive && !showDelivered && filter !== "Cancelled / Returned" && <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No orders match “{query}”. Try another item name or order ID.</div>}

        <section className="mt-9 grid gap-4 md:grid-cols-3" id="protection">
          {[
            ["✦", "Creator Verification", "Every merchant on TRENDROP undergoes biometric ID and business registry checks before launching drops."],
            ["🔒", "48-Hour Escrow Hold", "Unhappy or damaged item? Freeze seller disbursement with a single click from your tracking page."],
            ["🚀", "Fast-Track Resolution", "Automated mediation helps resolve lost packages and authenticate replacements within 24 hours."],
          ].map(([icon, title, copy]) => <article className="rounded-xl bg-[#f0efff] p-5" key={title}><span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">{icon}</span><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-600">{copy}</p></article>)}
        </section>
      </main>
      <Footer />
      {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl" role="status">{notice}</div>}
    </div>
  );
}

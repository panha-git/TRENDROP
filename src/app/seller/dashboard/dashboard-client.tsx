"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Product = { id: number; name: string; sku: string; category: string; price: number; stock: number; sold: number; velocity: number; icon: string };
type Order = { id: string; date: string; customer: string; location: string; item: string; payment: string; status: string };

const initialProducts: Product[] = [
  { id: 1, name: "Prism RGB Numpad Pro", sku: "NV-PRSM-81", category: "Keyboards & Desk Setup", price: 59, stock: 3, sold: 512, velocity: 38.4, icon: "⌨" },
  { id: 2, name: "AeroGlow MagDock 15W", sku: "NV-MGD-15W", category: "Wireless Chargers", price: 42.5, stock: 7, sold: 824, velocity: 54.1, icon: "◉" },
  { id: 3, name: "HoloGrip Ceramic Mousepad", sku: "NV-HLG-MP3", category: "Desk Surfaces", price: 29.99, stock: 184, sold: 340, velocity: 12.3, icon: "▧" },
  { id: 4, name: "WattPulse OLED 240W Cable", sku: "NV-WPL-240", category: "Cables & Power", price: 19.99, stock: 420, sold: 980, velocity: 8.9, icon: "⌁" },
];

const orders: Order[] = [
  { id: "#TR-8821", date: "Today, 3:42 PM", customer: "Elena Rostova", location: "Brooklyn, NY, USA", item: "Prism RGB Numpad Pro", payment: "Paid", status: "Expedited (Unfulfilled)" },
  { id: "#TR-8820", date: "Today, 2:15 PM", customer: "Marcus Vance", location: "Austin, TX, USA", item: "WattPulse OLED 240W", payment: "Paid", status: "Shipped (In Transit)" },
  { id: "#TR-8819", date: "Today, 1:04 PM", customer: "Liam K. Chen", location: "San Francisco, CA", item: "AeroGlow MagDock 15W", payment: "Captured", status: "Standard (Unfulfilled)" },
  { id: "#TR-8818", date: "Yesterday", customer: "Sophia Martinez", location: "Miami, FL, USA", item: "HoloGrip Ceramic Pad", payment: "Paid", status: "Delivered" },
];

const sectionLinks = [
  { href: "/seller/dashboard", icon: "▦", label: "Home & Overview" },
  { href: "/seller/fulfillment", icon: "⇄", label: "Orders & Fulfillment", badge: "28" },
  { href: "#inventory", icon: "▤", label: "Products & Inventory", badge: "2 low" },
  { href: "#analytics", icon: "⌁", label: "Analytics & Velocity", badge: "● Live" },
  { href: "#affiliates", icon: "✧", label: "Creator Affiliates", badge: "14 Active" },
  { href: "#reviews", icon: "☆", label: "Customers & Reviews", badge: "4.9 ★" },
  { href: "#payouts", icon: "◈", label: "Payouts & Balance" },
];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function SellerDashboardClient() {
  const [products, setProducts] = useState(initialProducts);
  const [range, setRange] = useState("30D");
  const [orderTab, setOrderTab] = useState("All Orders");
  const [productTab, setProductTab] = useState("All Products");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("24.99");
  const [newStock, setNewStock] = useState("12");

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesText = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = productTab === "All Products" || (productTab === "Low Stock" && product.stock < 10) || (productTab === "Live / Active" && product.stock >= 10) || (productTab === "Drafts & Drops" && product.stock === 0);
    return matchesText && matchesTab;
  }), [products, productTab, query]);
  const visibleOrders = orderTab === "Unfulfilled / Urgent" ? orders.filter((order) => order.status.includes("Unfulfilled")) : orderTab === "Shipped" ? orders.filter((order) => order.status.includes("Shipped")) : orderTab === "Returns & Escrow" ? [] : orders;

  const restock = (id: number) => {
    setProducts((current) => current.map((product) => product.id === id ? { ...product, stock: product.stock + 25 } : product));
    setNotice("Inventory count updated in this page only.");
  };

  const addProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newName.trim()) return;
    setProducts((current) => [{ id: Date.now(), name: newName.trim(), sku: `NV-${Date.now().toString().slice(-5)}`, category: "New arrival", price: Number(newPrice) || 0, stock: Number(newStock) || 0, sold: 0, velocity: 0, icon: "✦" }, ...current]);
    setShowAdd(false);
    setNewName("");
    setNotice("Product added to the local dashboard preview. Nothing was saved remotely.");
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-800 bg-[#0a0f1d] text-slate-300 lg:flex">
        <div className="border-b border-slate-800 p-4">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg">✦</span><span><span className="block text-sm font-extrabold text-white">TRENDROP <span className="rounded bg-violet-500/20 px-1 text-[9px] text-violet-300">PRO</span></span><span className="text-[10px] text-slate-400">Seller Command 3.2</span></span></Link>
          <button className="mt-4 flex w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-left hover:bg-slate-800"><span className="grid size-8 place-items-center rounded-lg bg-violet-950 text-lg">🪩</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white">NovaTech Studio</span><span className="text-[9px] text-slate-400">● #US-4820</span></span><span>⌄</span></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 text-xs">
          {sectionLinks.map((item, index) => <a key={item.label} href={item.href} className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${index === 0 ? "bg-violet-600 font-semibold text-white shadow-lg shadow-violet-950/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><span className="flex items-center gap-3"><span className="text-base">{item.icon}</span>{item.label}</span>{item.badge && <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px]">{item.badge}</span>}</a>)}
          <p className="px-3 pt-5 text-[9px] font-semibold uppercase tracking-widest text-slate-500">Preferences</p>
          <Link href="/seller/onboarding" className="flex items-center justify-between rounded-xl px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"><span>♧　KYC & Compliance</span><span className="text-emerald-400">✓</span></Link>
          <a href="#store-settings" className="block rounded-xl px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white">⚙　Store Settings</a>
        </nav>
        <div className="border-t border-slate-800 p-3"><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><p className="text-[9px] uppercase tracking-wider text-slate-400">● Live traffic</p><p className="mt-1 text-xs font-semibold text-white">1,420 Active Viewers <span className="float-right text-emerald-400">+14%</span></p></div><Link href="/seller/fulfillment" className="mt-3 block text-center text-[10px] text-slate-400 hover:text-white">⇄ Orders & Fulfillment</Link></div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <label className="relative min-w-[180px] flex-1 sm:max-w-sm"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, SKUs, customers..." className="w-full rounded-xl border-0 bg-slate-50 py-2 pl-9 pr-3 text-xs ring-1 ring-slate-200 focus:ring-violet-400" /></label>
            <div className="flex items-center gap-2"><span className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700 sm:inline">✓ Verified Merchant</span><span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700 md:inline">● Tier 1 Compliance</span><Link href="/seller/fulfillment" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold hover:border-violet-300 sm:inline">View Fulfillment ↗</Link><button aria-label="Notifications" onClick={() => setNotice("You’re all caught up.")} className="relative rounded-lg border border-slate-200 px-3 py-2">♧<span className="absolute right-2 top-1 size-1.5 rounded-full bg-rose-500" /></button><button onClick={() => setShowAdd(true)} className="rounded-lg bg-violet-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-800">＋ Add Product</button><span className="grid size-8 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">NS</span></div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 text-[10px] lg:hidden">{sectionLinks.slice(0, 3).map((item) => <a key={item.label} href={item.href} className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5 hover:bg-violet-100">{item.label}</a>)}<Link href="/seller/onboarding" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5">KYC & Compliance</Link></nav>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 xl:px-8 xl:py-7">
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-violet-700 to-indigo-500 text-xl text-white">🪩</span><div><h1 className="font-[family-name:var(--font-headline)] text-lg font-bold">NovaTech Studio <span className="rounded-md bg-violet-50 px-2 py-1 align-middle text-[9px] text-violet-700">✓ Verified Merchant</span></h1><p className="mt-1 text-[10px] text-slate-500">⭐ 4.9 (3,420 verified reviews)　·　✓ 99.4% on-time dispatch　·　Store ID: #US-4820</p></div></div>
            <div className="flex gap-2"><button onClick={() => setNotice("Preferences are ready to customize in this preview.")} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium hover:bg-slate-50">☷ Preferences</button><button onClick={() => setNotice("Store settings are not connected in this preview.")} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-medium hover:bg-slate-50">⚙ Store Settings</button></div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Total revenue (30D)", "$28,490.50", "+24.8%", "▣", "text-violet-700"],
              ["Total orders", "1,429", "+18.2%", "▤", "text-blue-700"],
              ["Fulfillment urgent", "28", "Action needed", "⇄", "text-rose-600"],
              ["Average order (AOV)", "$41.80", "+6.4%", "▧", "text-indigo-700"],
              ["Stock alerts", "2 SKUs", "Depleting fast", "⚠", "text-amber-700"],
            ].map(([label, amount, trend, icon, color]) => <article key={label} className={`rounded-2xl border bg-white p-4 shadow-sm ${label === "Fulfillment urgent" ? "border-rose-200" : label === "Stock alerts" ? "border-amber-200" : "border-slate-200"}`}><div className="flex items-center justify-between"><p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><span className={`grid size-7 place-items-center rounded-lg bg-slate-50 ${color}`}>{icon}</span></div><p className="mt-3 text-xl font-bold tracking-tight">{amount}</p><p className={`mt-1 text-[9px] font-semibold ${color}`}>{trend}<span className="ml-1 font-normal text-slate-400">{label === "Fulfillment urgent" ? "orders need attention" : label === "Stock alerts" ? "Est. out of stock < 4 hrs" : "vs last month"}</span></p></article>)}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(280px,.9fr)]">
            <article id="analytics" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-bold">Sales & Viral Velocity Analytics <span className="rounded bg-violet-50 px-2 py-1 text-[9px] font-semibold text-violet-700">● Live sync</span></h2><p className="mt-1 text-[10px] text-slate-500">Track revenue and sales across your social and marketplace channels.</p></div><div className="flex rounded-lg bg-slate-100 p-1">{["7D", "30D", "90D", "Custom"].map((item) => <button key={item} onClick={() => setRange(item)} className={`rounded-md px-2 py-1 text-[9px] ${range === item ? "bg-white font-semibold shadow-sm" : "text-slate-500"}`}>{item}</button>)}</div></div>
              <div className="mt-4 grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-3"><div><p className="text-[9px] uppercase text-slate-500">Creator affiliate sales</p><p className="mt-1 text-sm font-bold text-violet-700">$19,240.00</p><p className="text-[9px] text-slate-500">67.5% share · 14 creators</p></div><div className="border-slate-200 sm:border-l sm:pl-4"><p className="text-[9px] uppercase text-slate-500">Organic marketplace</p><p className="mt-1 text-sm font-bold">$9,250.50</p><p className="text-[9px] text-slate-500">32.5% direct discovery</p></div><div className="border-slate-200 sm:border-l sm:pl-4"><p className="text-[9px] uppercase text-rose-600">Peak drop spike</p><p className="mt-1 text-sm font-bold">$5,240.00 in 3 hrs</p><p className="text-[9px] text-rose-600">Thu drop · @kai_techs</p></div></div>
              <div className="relative mt-3 h-48 overflow-hidden rounded-xl border-b border-slate-100 bg-[linear-gradient(to_bottom,transparent_24%,#f1f5f9_25%,transparent_26%,transparent_49%,#f1f5f9_50%,transparent_51%,transparent_74%,#f1f5f9_75%,transparent_76%)] sm:h-60">
                <svg viewBox="0 0 760 220" preserveAspectRatio="none" className="absolute inset-0 size-full">
                  <defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7c3aed" stopOpacity=".22" /><stop offset="1" stopColor="#7c3aed" stopOpacity="0" /></linearGradient><linearGradient id="orderFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#0284c7" stopOpacity=".18" /><stop offset="1" stopColor="#0284c7" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 180 C58 174 85 143 140 151 S226 177 280 100 S353 39 395 68 S441 148 500 124 S588 91 635 100 S700 51 760 63 L760 220 L0 220Z" fill="url(#salesFill)" />
                  <path d="M0 180 C58 174 85 143 140 151 S226 177 280 100 S353 39 395 68 S441 148 500 124 S588 91 635 100 S700 51 760 63" fill="none" stroke="#6d28d9" strokeWidth="3" />
                  <path d="M0 199 C50 194 83 182 140 185 S240 198 300 180 S391 172 440 187 S530 198 590 184 S691 181 760 172 L760 220 L0 220Z" fill="url(#orderFill)" />
                  <path d="M0 199 C50 194 83 182 140 185 S240 198 300 180 S391 172 440 187 S530 198 590 184 S691 181 760 172" fill="none" stroke="#0284c7" strokeWidth="2" />
                  <line x1="420" y1="25" x2="420" y2="220" stroke="#a78bfa" strokeDasharray="4 5" />
                </svg>
                <div className="absolute left-[49%] top-4 rounded-lg bg-slate-900 px-3 py-1.5 text-[9px] text-white shadow-lg">● TikTok drop peak<br /><b>$5,240.00 / 480 units</b></div>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2 text-[8px] text-slate-400"><span>Day 1</span><span>Day 6</span><span>Day 12</span><span className="font-semibold text-violet-700">Thu (Drop Day)</span><span>Day 20</span><span>Day 25</span><span>Today</span></div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-500"><span><i className="mr-1 inline-block size-2 rounded-full bg-violet-600" />Creator Affiliate & Spark Ads　 <i className="mr-1 inline-block size-2 rounded-full bg-sky-600" />Organic Direct Marketplace</span><span>⟳ Updated 4 mins ago · {range}</span></div>
            </article>
            <div className="space-y-4">
              <article className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="text-xs font-bold">⚠ Critical low stock</h3><p className="mt-1 text-[9px] text-rose-600">2 SKUs depleting fast</p></div><span className="rounded-full bg-rose-50 px-2 py-1 text-[8px] font-bold text-rose-600">URGENT</span></div><div className="mt-3 space-y-2">{products.filter((product) => product.stock < 10).map((product) => <div key={product.id} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2"><span className="grid size-9 place-items-center rounded-lg bg-white text-lg">{product.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{product.name}</p><p className="text-[9px] text-rose-600">Only {product.stock} units left</p></div><button onClick={() => restock(product.id)} className="rounded-md bg-violet-700 px-2 py-1.5 text-[9px] font-semibold text-white hover:bg-violet-800">Restock</button></div>)}</div><button onClick={() => { document.getElementById("inventory")?.scrollIntoView({ behavior: "smooth" }); setProductTab("Low Stock"); }} className="mt-3 w-full text-left text-[9px] font-semibold text-violet-700">View all low stock →</button></article>
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><h3 className="text-xs font-bold">♨ Trending velocity</h3><span className="rounded-full bg-violet-50 px-2 py-1 text-[8px] text-violet-700">TOP 3 VIRAL</span></div><div className="mt-3 space-y-3">{[["1", "AeroGlow MagDock 15W", "824 sold", "48.2k views/hr"], ["2", "Prism RGB Numpad Pro", "512 sold", "31.9k views/hr"], ["3", "HoloGrip Ceramic Pad", "340 sold", "19.4k views/hr"]].map((row) => <div key={row[0]} className="flex items-center gap-2 border-b border-slate-100 pb-2 last:border-0"><span className="text-xs font-bold text-violet-700">{row[0]}</span><div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{row[1]}</p><p className="text-[9px] text-slate-400">◉ {row[3]}</p></div><span className="text-[9px] font-medium">{row[2]}</span></div>)}</div><a href="#inventory" className="mt-2 block text-[9px] text-slate-500">Creator attribution details →</a></article>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Orders & Dispatch Fulfillment <span className="ml-1 rounded bg-rose-50 px-2 py-1 text-[9px] text-rose-600">28 urgent</span></h2><p className="mt-1 text-[10px] text-slate-500">High-density dispatch pipeline with carrier label generation and batch tracking.</p></div><div className="flex gap-2"><button onClick={() => setNotice("Filters are available in the order tabs below.")} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px]">☷ Filters</button><button onClick={() => downloadCsv("trendrop-orders.csv", [["Order", "Date", "Customer", "Item", "Payment", "Status"], ...orders.map((order) => [order.id, order.date, order.customer, order.item, order.payment, order.status])])} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px]">↓ Export CSV</button><Link href="/seller/fulfillment" className="rounded-lg bg-violet-700 px-3 py-2 text-[10px] font-semibold text-white">Open fulfillment →</Link></div></div>
            <div className="mt-4 flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">{["All Orders", "Unfulfilled / Urgent", "Partially Fulfilled", "Shipped", "Returns & Escrow"].map((tab) => <button key={tab} onClick={() => setOrderTab(tab)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[9px] ${orderTab === tab ? "bg-slate-900 font-semibold text-white" : "text-slate-500 hover:bg-slate-100"}`}>{tab}{tab === "All Orders" ? " (1,429)" : tab === "Unfulfilled / Urgent" ? " (28)" : ""}</button>)}</div>
            <div className="overflow-x-auto"><table className="mt-2 w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-[9px] uppercase tracking-wide text-slate-500"><tr>{["Order", "Date / Time", "Customer", "Items / SKUs", "Payment", "Fulfillment status"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 text-[10px]">{visibleOrders.map((order) => <tr key={order.id} className="hover:bg-slate-50"><td className="px-3 py-3 font-semibold text-violet-700">{order.id}</td><td className="px-3 py-3 text-slate-500">{order.date}</td><td className="px-3 py-3"><span className="font-semibold">{order.customer}</span><span className="mt-0.5 block text-[9px] text-slate-400">{order.location}</span></td><td className="px-3 py-3">{order.item}</td><td className="px-3 py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] text-emerald-700">{order.payment}</span></td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[9px] ${order.status.includes("Unfulfilled") ? "bg-rose-50 text-rose-700" : order.status.includes("Shipped") ? "bg-sky-50 text-sky-700" : "bg-emerald-50 text-emerald-700"}`}>{order.status}</span></td></tr>)}</tbody></table>{visibleOrders.length === 0 && <p className="p-6 text-center text-xs text-slate-500">No returns in this sample queue.</p>}</div>
            <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500"><span>Showing {visibleOrders.length} of 1,429 orders</span><Link href="/seller/fulfillment" className="font-semibold text-violet-700">View dispatch queue →</Link></div>
          </section>

          <section id="inventory" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold">Catalog & Inventory Management</h2><p className="mt-1 text-[10px] text-slate-500">Track real-time inventory allocations, update pricing, and audit viral product velocities.</p></div><div className="flex flex-wrap gap-2"><label className="relative"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SKU, name, tags..." className="w-48 rounded-lg border-0 bg-slate-50 py-2 pl-8 pr-2 text-[9px] ring-1 ring-slate-200 focus:ring-violet-400" /></label><button onClick={() => setNotice("Use the product tabs to filter this inventory preview.")} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px]">☷ Filters</button><button onClick={() => downloadCsv("trendrop-inventory.csv", [["Product", "SKU", "Price", "Stock", "Sold", "Velocity"], ...products.map((product) => [product.name, product.sku, product.price, product.stock, product.sold, product.velocity])])} className="rounded-lg border border-slate-200 px-3 py-2 text-[9px]">↓ Export CSV</button></div></div>
            <div className="mt-4 flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">{["All Products", "Live / Active", "Low Stock", "Drafts & Drops"].map((tab) => <button key={tab} onClick={() => setProductTab(tab)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[9px] ${productTab === tab ? "bg-violet-700 font-semibold text-white" : "text-slate-500 hover:bg-slate-100"}`}>{tab}{tab === "All Products" ? " (42)" : tab === "Live / Active" ? " (38)" : tab === "Low Stock" ? " (2)" : " (2)"}</button>)}</div>
            <div className="overflow-x-auto"><table className="mt-2 w-full min-w-[760px] text-left"><thead className="bg-slate-50 text-[9px] uppercase tracking-wide text-slate-500"><tr>{["Product", "SKU", "Unit price", "Stock level", "Sold units", "Velocity", "Actions"].map((heading) => <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 text-[10px]">{visibleProducts.map((product) => <tr key={product.id} className="hover:bg-slate-50"><td className="px-3 py-3"><div className="flex items-center gap-2"><span className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-violet-50 to-slate-100 text-lg">{product.icon}</span><span><span className="block font-semibold">{product.name}</span><span className="text-[9px] text-slate-400">{product.category}</span></span></div></td><td className="px-3 py-3 text-slate-500">{product.sku}</td><td className="px-3 py-3 font-medium">${product.price.toFixed(2)}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[9px] ${product.stock < 10 ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{product.stock < 10 ? `● ${product.stock} left (low)` : `✓ ${product.stock} in stock`}</span></td><td className="px-3 py-3">{product.sold.toLocaleString()}</td><td className={`px-3 py-3 font-semibold ${product.velocity > 30 ? "text-rose-600" : "text-emerald-700"}`}>↗ +{product.velocity}%</td><td className="px-3 py-3"><button onClick={() => restock(product.id)} className={`rounded-md px-2.5 py-1.5 text-[9px] font-semibold ${product.stock < 10 ? "bg-violet-700 text-white" : "border border-slate-200 hover:bg-slate-50"}`}>{product.stock < 10 ? "Restock" : "Edit price"}</button><button aria-label={`More actions for ${product.name}`} onClick={() => setNotice(`${product.name}: item actions are available in this local preview.`)} className="ml-1 px-2 text-slate-500">⋮</button></td></tr>)}</tbody></table>{visibleProducts.length === 0 && <p className="p-6 text-center text-xs text-slate-500">No products match your search.</p>}</div>
            <div className="mt-3 flex justify-between text-[9px] text-slate-500"><span>Showing {visibleProducts.length} of 42 catalog items</span><span>‹　<span className="rounded bg-violet-700 px-2 py-1 text-white">1</span>　2　3　›</span></div>
          </section>
          <p className="pb-3 text-center text-[9px] text-slate-400">Dashboard figures shown for interface preview. Changes remain in this browser session.</p>
        </main>
      </div>
      {showAdd && <div role="dialog" aria-modal="true" aria-labelledby="add-product-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4"><form onSubmit={addProduct} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 id="add-product-title" className="text-base font-bold">Add a product</h2><button type="button" onClick={() => setShowAdd(false)} aria-label="Close dialog" className="text-xl text-slate-400">×</button></div><p className="mt-1 text-xs text-slate-500">Add a product to this local dashboard preview.</p><label className="mt-4 block text-xs font-semibold">Product name<input required value={newName} onChange={(event) => setNewName(event.target.value)} className="mt-1 w-full rounded-lg border-slate-200 text-sm" /></label><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-xs font-semibold">Price<input type="number" min="0" step="0.01" value={newPrice} onChange={(event) => setNewPrice(event.target.value)} className="mt-1 w-full rounded-lg border-slate-200 text-sm" /></label><label className="text-xs font-semibold">Initial stock<input type="number" min="0" value={newStock} onChange={(event) => setNewStock(event.target.value)} className="mt-1 w-full rounded-lg border-slate-200 text-sm" /></label></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowAdd(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-xs">Cancel</button><button className="rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white">Add product</button></div></form></div>}
      {notice && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-xs text-white shadow-xl">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message" className="ml-3 text-slate-300">×</button></div>}
    </div>
  );
}

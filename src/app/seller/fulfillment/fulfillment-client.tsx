"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DispatchOrder = {
  id: string;
  age: string;
  source: string;
  priority: "Express" | "Standard";
  customer: string;
  destination: string;
  product: string;
  sku: string;
  quantity: number;
  deadline: string;
  carrier: string;
  tracking: string;
  status: "Unfulfilled" | "Ready for Courier" | "Dispatched" | "Delivered";
};

const initialOrders: DispatchOrder[] = [
  { id: "#TR-8821", age: "18m ago", source: "TikTok Live Drop", priority: "Express", customer: "Elena Rostova", destination: "Brooklyn, NY 11201", product: "Prism RGB Numpad Pro", sku: "RGB-NP-01", quantity: 2, deadline: "Today, 4:00 PM EST", carrier: "FedEx", tracking: "Pending label", status: "Unfulfilled" },
  { id: "#TR-8820", age: "42m ago", source: "Web Store", priority: "Standard", customer: "Marcus Vance", destination: "Austin, TX 78701", product: "WattPulse OLED 240W", sku: "WP-240-BLK", quantity: 1, deadline: "Tomorrow, 10:00 AM", carrier: "USPS", tracking: "Label ready", status: "Ready for Courier" },
  { id: "#TR-8819", age: "1h 10m ago", source: "Affiliate Link", priority: "Standard", customer: "Liam K. Chen", destination: "San Francisco, CA 94107", product: "AeroGlow MagDock 15W", sku: "AG-MD-15", quantity: 1, deadline: "Today, 6:00 PM PST", carrier: "UPS", tracking: "1Z999AA", status: "Unfulfilled" },
  { id: "#TR-8818", age: "2h 05m ago", source: "Flash Drop", priority: "Express", customer: "Amara Sterling", destination: "Seattle, WA 98101", product: "HyperShift Mouse", sku: "HM-OBS-01", quantity: 1, deadline: "Today, 5:30 PM EST", carrier: "FedEx", tracking: "FX-884202", status: "Dispatched" },
  { id: "#TR-8817", age: "3h 16m ago", source: "Web Store", priority: "Standard", customer: "Nina Patel", destination: "Portland, OR 97201", product: "HoloGrip Ceramic Pad", sku: "HLG-MP3", quantity: 1, deadline: "Tomorrow, 11:30 AM", carrier: "DHL", tracking: "DHL-667810", status: "Delivered" },
];

const tabs = [
  { id: "Urgent Dispatch", count: "28" },
  { id: "Standard Shipping", count: "45" },
  { id: "Ready for Courier", count: "14" },
  { id: "Delivered (sample)", count: "1,382" },
];

function exportOrders(orders: DispatchOrder[]) {
  const headers = ["Order ID", "Customer", "Destination", "Product", "SKU", "Carrier", "Tracking", "Status"];
  const lines = orders.map((order) => [order.id, order.customer, order.destination, order.product, order.sku, order.carrier, order.tracking, order.status]);
  const csv = [headers, ...lines].map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(",")).join("\n");
  const file = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = file;
  link.download = "trendrop-dispatch-queue.csv";
  link.click();
  URL.revokeObjectURL(file);
}

export default function SellerFulfillmentClient() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("Urgent Dispatch");
  const [query, setQuery] = useState("");
  const [carrier, setCarrier] = useState("All Carriers");
  const [deadline, setDeadline] = useState("All Dispatch Deadlines");
  const [selected, setSelected] = useState<string[]>(initialOrders.slice(0, 3).map((order) => order.id));
  const [notice, setNotice] = useState("");
  const [activeOrder, setActiveOrder] = useState<DispatchOrder | null>(null);
  const [scanText, setScanText] = useState("");

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const text = `${order.id} ${order.customer} ${order.destination} ${order.product} ${order.sku} ${order.tracking}`.toLowerCase();
    const queryMatch = text.includes(query.toLowerCase());
    const carrierMatch = carrier === "All Carriers" || order.carrier === carrier;
    const deadlineMatch = deadline === "All Dispatch Deadlines" || (deadline === "Due today" ? order.deadline.toLowerCase().includes("today") : order.deadline.toLowerCase().includes("tomorrow"));
    let tabMatch = true;
    if (activeTab === "Urgent Dispatch") tabMatch = order.priority === "Express" && order.status !== "Delivered";
    if (activeTab === "Standard Shipping") tabMatch = order.priority === "Standard" && order.status !== "Delivered";
    if (activeTab === "Ready for Courier") tabMatch = order.status === "Ready for Courier";
    if (activeTab === "Delivered (sample)") tabMatch = order.status === "Delivered";
    return queryMatch && carrierMatch && deadlineMatch && tabMatch;
  }), [orders, query, carrier, deadline, activeTab]);

  const toggleOne = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  const toggleAll = () => {
    const allVisibleSelected = visibleOrders.length > 0 && visibleOrders.every((order) => selected.includes(order.id));
    setSelected((current) => allVisibleSelected ? current.filter((id) => !visibleOrders.some((order) => order.id === id)) : Array.from(new Set([...current, ...visibleOrders.map((order) => order.id)])));
  };
  const updateStatus = (ids: string[], status: DispatchOrder["status"], success: string) => {
    if (ids.length === 0) {
      setNotice("Select at least one order first.");
      return;
    }
    setOrders((current) => current.map((order) => ids.includes(order.id) ? { ...order, status } : order));
    setSelected([]);
    setNotice(`${ids.length} order${ids.length === 1 ? "" : "s"} ${success}. Changes are local to this page.`);
  };
  const scanOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = orders.find((order) => order.id.toLowerCase() === scanText.trim().toLowerCase() || order.sku.toLowerCase() === scanText.trim().toLowerCase() || order.tracking.toLowerCase() === scanText.trim().toLowerCase());
    if (found) {
      setSelected((current) => Array.from(new Set([...current, found.id])));
      setActiveOrder(found);
      setNotice(`${found.id} found and selected in the queue.`);
    } else {
      setNotice("No matching order, SKU, or tracking code in this sample queue.");
    }
    setScanText("");
  };

  const sidebarLinks = [
    { href: "/seller/dashboard", label: "Home & Overview", icon: "▦" },
    { href: "/seller/fulfillment", label: "Orders & Fulfillment preview", icon: "⇄", active: true },
    { href: "/seller/dashboard#inventory", label: "Products & Inventory", icon: "▤" },
    { href: "/seller/dashboard#analytics", label: "Analytics preview", icon: "⌁" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-slate-800 bg-[#0a0f1d] text-slate-300 lg:flex">
        <div className="border-b border-slate-800 p-4">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg">✦</span><span><span className="block text-sm font-extrabold text-white">TRENDROP</span><span className="text-[10px] text-slate-400">Seller dashboard preview</span></span></Link>
          <div className="mt-4 flex w-full items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-left"><span className="grid size-8 place-items-center rounded-lg bg-violet-950 text-lg">🪩</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-white">Sample store</span><span className="text-[9px] text-slate-400">Demo account</span></span></div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3 text-xs">{sidebarLinks.map((item) => <Link key={item.label} href={item.href} className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition ${item.active ? "bg-violet-600 font-semibold text-white shadow-lg shadow-violet-950/30" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}><span className="flex items-center gap-3"><span className="text-base">{item.icon}</span>{item.label}</span></Link>)}<p className="px-3 pt-5 text-[9px] font-semibold uppercase tracking-widest text-slate-500">Preferences</p><Link href="/seller/onboarding" className="block rounded-xl px-3 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white">♧　Seller application</Link></nav>
        <div className="border-t border-slate-800 p-3"><div className="rounded-xl border border-slate-800 bg-slate-900 p-3"><p className="text-[9px] uppercase tracking-wider text-slate-400">Sample dashboard</p><p className="mt-1 text-xs font-semibold text-white">Metrics are illustrative</p></div><Link href="/seller/dashboard" className="mt-3 block text-center text-[10px] text-slate-400 hover:text-white">← Seller overview</Link></div>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 xl:px-8">
            <label className="relative min-w-[180px] flex-1 sm:max-w-sm"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders, shipments, customers..." className="w-full rounded-xl border-0 bg-slate-50 py-2 pl-9 pr-3 text-xs ring-1 ring-slate-200 focus:ring-violet-400" /></label>
            <div className="flex items-center gap-2"><span className="hidden rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-semibold text-violet-700 sm:inline">Sample seller preview</span><span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold text-slate-600 md:inline">Carrier integration off</span><Link href="/seller/dashboard" className="hidden rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold hover:border-violet-300 sm:inline">Seller dashboard ↗</Link><button aria-label="Notifications" onClick={() => setNotice("Notifications are not connected in this preview.")} className="relative rounded-lg border border-slate-200 px-3 py-2">♧</button><button onClick={() => updateStatus(selected, "Ready for Courier", "updated in the local preview")} className="rounded-lg bg-violet-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-800">⇄ Update selected</button><span className="grid size-8 place-items-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-800">S</span></div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 text-[10px] lg:hidden"><Link href="/seller/dashboard" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5">Overview</Link><Link href="/seller/onboarding" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5">Seller application</Link><Link href="/seller/dashboard#inventory" className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1.5">Inventory</Link></nav>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 xl:px-8 xl:py-7">
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-950" role="note">
            Fulfillment interface preview: every order, customer, shipping status, carrier, and metric below is sample data. Carrier APIs, payment settlement, label printing, and actual fulfillment are not connected.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><div><Link href="/seller/dashboard" className="hover:text-violet-700">Seller Hub</Link><span className="mx-2">/</span><span>Orders & Dispatch</span><span className="mx-2">/</span><span className="font-semibold text-slate-800">Batch Fulfillment</span></div><span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-800">Sample queue</span></div>
          <section className="flex flex-wrap items-start justify-between gap-4">
            <div><h1 className="font-[family-name:var(--font-headline)] text-xl font-bold tracking-tight sm:text-2xl">Sample order fulfillment</h1><p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">Static interface preview; label issuance, carriers, and shipment hand-off are not connected.</p></div>
            <div className="flex flex-wrap gap-2"><button onClick={() => setNotice("Manifest downloads are not available in this preview.")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:border-violet-300">↓ Manifest unavailable</button><button onClick={() => document.getElementById("scan-input")?.focus()} className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-xs font-semibold text-violet-700 shadow-sm hover:bg-violet-50">▦ Find sample order</button><button onClick={() => setNotice("Label printing is not connected.")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:border-violet-300">▣ Print labels unavailable</button></div>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide">Sample priority queue</p><p className="mt-4 text-xl font-bold">28 <span className="text-sm font-normal">example orders</span></p></div><span className="text-xl text-violet-700">ϟ</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span>Illustrative priority timing</span><span className="text-lg text-violet-700">→</span></div></article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide">Sample dispatch metrics</p><p className="mt-4 text-xl font-bold">420 <span className="text-sm font-normal">example shipments</span></p></div><span className="text-sm font-bold text-slate-500">Demo</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span>Sample on-time rate</span><span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600">Illustrative</span></div></article>
            <article className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-violet-700">Payments</p><p className="mt-4 text-xl font-bold">Not connected</p></div><span className="text-violet-700">◈</span></div><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs"><span>Payment and settlement status unavailable</span><span className="font-semibold text-slate-500">Preview</span></div></article>
          </section>

          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center sm:p-5">
            <div className="flex items-start gap-3"><span className="mt-1 text-xl text-violet-700">✣</span><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-sm font-bold">Carrier integrations</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600">Not connected</span><span className="text-[10px] font-bold text-slate-500">Preview only</span></div><p className="mt-1 max-w-3xl text-[10px] leading-5 text-slate-500">Carrier names and tracking values below are examples; no carrier APIs, shipping rates, or labels are connected.</p></div></div>
            <form onSubmit={scanOrder} className="flex gap-2"><label className="relative flex-1"><span className="absolute left-3 top-2.5 text-slate-500">▦</span><input id="scan-input" value={scanText} onChange={(event) => setScanText(event.target.value)} placeholder="Scan SKU / Shipping Barcode" className="w-full rounded-lg border-slate-200 py-2 pl-9 text-xs focus:border-violet-400 focus:ring-violet-400" /></label><button className="rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-700">Find</button></form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-2">{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-w-fit items-center gap-2 rounded-xl px-3 py-2.5 text-[10px] sm:px-4 sm:text-xs ${activeTab === tab.id ? "bg-violet-700 font-semibold text-white shadow-md shadow-violet-200" : "text-slate-600 hover:bg-slate-50"}`}>{tab.id}<span className={activeTab === tab.id ? "text-violet-100" : "text-slate-400"}>{tab.count}</span></button>)}<span className="hidden items-center px-3 text-[10px] text-slate-500 md:flex">Static sample queue</span></div>

            <div className="flex flex-wrap items-center gap-2 py-4">
              <label className="relative min-w-[180px] flex-1 sm:max-w-xs"><span className="absolute left-3 top-2 text-slate-400">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, customer, or item..." className="w-full rounded-lg border-slate-200 py-2 pl-8 text-[10px] focus:border-violet-400 focus:ring-violet-400" /></label>
              <select aria-label="Filter by carrier" value={carrier} onChange={(event) => setCarrier(event.target.value)} className="rounded-lg border-slate-200 py-2 text-[10px] focus:border-violet-400 focus:ring-violet-400"><option>All Carriers</option><option>FedEx</option><option>USPS</option><option>UPS</option><option>DHL</option></select>
              <select aria-label="Filter by dispatch deadline" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="rounded-lg border-slate-200 py-2 text-[10px] focus:border-violet-400 focus:ring-violet-400"><option>All Dispatch Deadlines</option><option>Due today</option><option>Due tomorrow</option></select>
              <span className="ml-auto text-[10px] text-slate-500">Selected <b className="text-slate-800">{selected.length}</b> order{selected.length === 1 ? "" : "s"}</span>
              <button onClick={() => setNotice("Label printing is not connected.")} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] hover:bg-slate-50">▣ Print labels unavailable</button>
              <button onClick={() => updateStatus(selected, "Dispatched", "updated in the local preview")} className="rounded-lg bg-violet-700 px-3 py-2 text-[10px] font-semibold text-white hover:bg-violet-800">⇄ Update sample status</button>
              <button onClick={() => exportOrders(visibleOrders)} className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] hover:bg-slate-50">↓ Export CSV</button>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[940px] text-left"><thead className="border-y border-slate-100 text-[9px] uppercase tracking-wide text-slate-500"><tr><th className="w-10 px-3 py-3"><input type="checkbox" aria-label="Select all visible orders" checked={visibleOrders.length > 0 && visibleOrders.every((order) => selected.includes(order.id))} onChange={toggleAll} className="rounded border-slate-300 text-violet-700 focus:ring-violet-500" /></th>{["Order ID & time", "Customer & destination", "Items & SKUs", "Shipping tier & SLA", "Carrier & tracking", "Status", "Actions"].map((item) => <th key={item} className="px-3 py-3 font-semibold">{item}</th>)}</tr></thead>
                <tbody className="divide-y divide-slate-100 text-[10px]">{visibleOrders.map((order) => <tr key={order.id} className={`transition hover:bg-violet-50/40 ${selected.includes(order.id) ? "bg-violet-50/30" : ""}`}><td className="px-3 py-4"><input type="checkbox" aria-label={`Select ${order.id}`} checked={selected.includes(order.id)} onChange={() => toggleOne(order.id)} className="rounded border-slate-300 text-violet-700 focus:ring-violet-500" /></td><td className="px-3 py-4"><button onClick={() => setActiveOrder(order)} className="font-bold text-violet-700 hover:underline">{order.id}</button><p className="mt-1 text-slate-500">{order.age} · {order.source}</p><p className={`mt-1 font-semibold ${order.priority === "Express" ? "text-amber-600" : "text-slate-600"}`}>{order.priority === "Express" ? "ϟ " : ""}{order.priority}</p></td><td className="px-3 py-4"><p className="font-semibold">{order.customer}</p><p className="mt-1 text-slate-500">⌖ {order.destination}</p></td><td className="px-3 py-4"><div className="flex items-center gap-2"><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-50 to-slate-100 text-lg">{order.priority === "Express" ? "⌨" : "▧"}</span><div><p className="font-semibold">{order.product}</p><p className="mt-1 font-mono text-[9px] text-slate-500">SKU: {order.sku} · Qty: {order.quantity}</p></div></div></td><td className="px-3 py-4"><p className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center font-semibold">{order.deadline}</p><p className={`mt-1 ${order.priority === "Express" ? "font-semibold text-amber-600" : "text-slate-500"}`}>{order.priority === "Express" ? "Sample dispatch timing" : "Example dispatch timing"}</p></td><td className="px-3 py-4"><span className="rounded border border-slate-200 px-2 py-1 font-semibold">{order.carrier}</span><p className="mt-2 font-mono text-violet-700">{order.tracking}</p></td><td className="px-3 py-4"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold ${order.status === "Unfulfilled" ? "bg-amber-50 text-amber-800" : order.status === "Ready for Courier" ? "bg-sky-50 text-sky-800" : order.status === "Dispatched" ? "bg-violet-50 text-violet-800" : "bg-emerald-50 text-emerald-800"}`}>{order.status}</span></td><td className="px-3 py-4"><button onClick={() => order.status === "Unfulfilled" ? updateStatus([order.id], "Ready for Courier", "updated in the local preview") : setActiveOrder(order)} className="whitespace-nowrap rounded-lg border border-slate-200 px-2.5 py-1.5 text-[9px] font-semibold hover:border-violet-300 hover:text-violet-700">{order.status === "Unfulfilled" ? "Update sample status" : "View sample details"}</button></td></tr>)}</tbody></table>
            </div>

            <div className="space-y-3 md:hidden">{visibleOrders.map((order) => <article key={order.id} className={`rounded-xl border p-3 ${selected.includes(order.id) ? "border-violet-300 bg-violet-50/50" : "border-slate-200"}`}><div className="flex items-start gap-3"><input type="checkbox" aria-label={`Select ${order.id}`} checked={selected.includes(order.id)} onChange={() => toggleOne(order.id)} className="mt-1 rounded border-slate-300 text-violet-700 focus:ring-violet-500" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><button onClick={() => setActiveOrder(order)} className="text-xs font-bold text-violet-700">{order.id}</button><span className="rounded-full bg-slate-100 px-2 py-1 text-[9px]">{order.status}</span></div><p className="mt-1 text-[10px] font-semibold">{order.customer} · {order.destination}</p><p className="mt-1 text-[10px] text-slate-600">{order.product} · Qty {order.quantity}</p><div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-500"><span>{order.carrier} · {order.deadline}</span><button onClick={() => order.status === "Unfulfilled" ? updateStatus([order.id], "Ready for Courier", "prepared for courier") : setActiveOrder(order)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold">Details / label</button></div></div></div></article>)}</div>
            {visibleOrders.length === 0 && <p className="p-8 text-center text-xs text-slate-500">No orders match the selected filters.</p>}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[9px] text-slate-500"><span>Showing {visibleOrders.length} of {activeTab === "Urgent Dispatch" ? "28 urgent" : "1,429"} shipments</span><span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">● Thermal printer: Zebra ZD421 Online (Tray 1)</span><div className="flex items-center gap-2"><button className="rounded-lg border border-slate-200 px-2 py-1.5">Previous</button><button className="rounded-lg bg-violet-700 px-2.5 py-1.5 text-white">1</button><button className="rounded-lg border border-slate-200 px-2.5 py-1.5">2</button><button className="rounded-lg border border-slate-200 px-2.5 py-1.5">3</button><button className="rounded-lg border border-slate-200 px-2 py-1.5">Next</button></div></div>
          </section>
          <p className="pb-3 text-center text-[9px] text-slate-400">Sample dispatch queue for this interface preview. Status changes stay in this browser session.</p>
        </main>
      </div>

      {activeOrder && <div role="dialog" aria-modal="true" aria-labelledby="order-drawer-title" className="fixed inset-0 z-40 flex justify-end bg-slate-950/30"><button aria-label="Close order details" onClick={() => setActiveOrder(null)} className="absolute inset-0 cursor-default" /><aside className="relative z-10 h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl sm:p-6"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-violet-700">Order details</p><h2 id="order-drawer-title" className="mt-1 text-lg font-bold">{activeOrder.id}</h2></div><button onClick={() => setActiveOrder(null)} aria-label="Close details" className="text-2xl text-slate-400">×</button></div><div className="mt-5 rounded-xl bg-slate-50 p-4"><p className="text-sm font-semibold">{activeOrder.customer}</p><p className="mt-1 text-xs text-slate-500">{activeOrder.destination}</p><p className="mt-4 text-xs font-semibold">{activeOrder.product}</p><p className="mt-1 font-mono text-[10px] text-slate-500">{activeOrder.sku} · Quantity {activeOrder.quantity}</p></div><div className="mt-4 space-y-3 text-xs"><p className="flex justify-between"><span className="text-slate-500">Shipping service</span><b>{activeOrder.carrier} {activeOrder.priority}</b></p><p className="flex justify-between"><span className="text-slate-500">Dispatch deadline</span><b>{activeOrder.deadline}</b></p><p className="flex justify-between"><span className="text-slate-500">Tracking</span><b className="text-violet-700">{activeOrder.tracking}</b></p><p className="flex justify-between"><span className="text-slate-500">Current status</span><b>{activeOrder.status}</b></p></div><div className="mt-6 space-y-2"><button onClick={() => { updateStatus([activeOrder.id], "Ready for Courier", "prepared for courier"); setActiveOrder(null); }} className="w-full rounded-xl bg-violet-700 px-4 py-3 text-xs font-semibold text-white">▣ Generate Shipping Label</button><button onClick={() => { updateStatus([activeOrder.id], "Dispatched", "handed to courier"); setActiveOrder(null); }} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold hover:bg-slate-50">⇄ Mark Handed to Courier</button><button onClick={() => setActiveOrder(null)} className="w-full rounded-xl px-4 py-2 text-xs text-slate-500 hover:bg-slate-50">Close details</button></div></aside></div>}
      {notice && <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-xs text-white shadow-xl">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message" className="ml-3 text-slate-300">×</button></div>}
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCartCount } from "@/lib/cart";

const initialCategories = ["Tech & Gadgets", "Desk Setups & Studio", "Viral TikTok Tagged"];
const extraCategories = ["Streetwear & Kicks", "Mech Keyboards"];

function Header() {
  const cartCount = useCartCount();
  return (
    <header className="sticky top-0 z-30 border-b border-[#e5e3ef] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
        <div className="flex items-center gap-8">
          <Link className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-violet-700" href="/"><span className="text-rose-600">♨</span> TRENDROP</Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link className="hover:text-violet-700" href="/">Trending Drops</Link><Link className="hover:text-violet-700" href="/">Flash Deals</Link><Link className="hover:text-violet-700" href="/">Categories</Link><Link className="hover:text-violet-700" href="/orders">Orders</Link><Link aria-current="page" className="border-b-2 border-violet-700 py-5 font-bold text-violet-700" href="/account">Account</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden rounded-xl border border-[#e4e2f0] bg-[#f6f5ff] px-3 py-2 text-xs text-slate-500 lg:inline">⌕ &nbsp; Search viral drops &amp; creators...</span>
          <Link aria-label="Shopping cart" className="relative rounded-lg p-2 text-lg text-slate-600 hover:bg-violet-50 hover:text-violet-700" href="/cart">♧<span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold text-white">{cartCount}</span></Link>
          <Link className="flex items-center gap-2 text-sm font-semibold text-slate-700" href="/account"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-700 text-xs text-white">JD</span><span className="hidden sm:inline">Jordan Diaz</span></Link>
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

function Panel({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return <section className={`rounded-2xl bg-white p-5 shadow-sm sm:p-6 ${className}`} id={id}>{children}</section>;
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("Profile & Personal Info");
  const [firstName, setFirstName] = useState("Jordan");
  const [lastName, setLastName] = useState("Diaz");
  const [email, setEmail] = useState("jordan.diaz@example.com");
  const [phone, setPhone] = useState("+1 (512) •••-8921");
  const [birthday, setBirthday] = useState("November 14, 1998");
  const [categories, setCategories] = useState(initialCategories);
  const [notifications, setNotifications] = useState({ instant: true, weekly: true, restock: true });
  const [connections, setConnections] = useState({ tiktok: true, instagram: false, discord: true });
  const [notice, setNotice] = useState("");

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showNotice("Profile changes saved in this session.");
  }

  function toggleCategory(category: string) {
    setCategories((current) => current.includes(category) ? current.filter((value) => value !== category) : [...current, category]);
  }

  function goToTab(tab: string, id: string) {
    setActiveTab(tab);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tabs = [
    ["Profile & Personal Info", "personal-details"],
    ["Saved Addresses", "shipping-address"],
    ["Payment Methods & Wallets", "payment-method"],
    ["Saved Drops / Wishlist", "drop-preferences"],
    ["Security & Notifications", "security-sessions"],
  ];

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#171a2a]">
      <Header />
      <main className="mx-auto max-w-[1370px] px-4 pb-8 pt-7 sm:px-6 lg:px-0">
        <section className="relative overflow-hidden rounded-3xl border border-white bg-gradient-to-br from-white via-white to-[#f3f0ff] p-5 shadow-sm sm:p-7">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full bg-violet-100/70 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-700 to-fuchsia-500 text-xl font-bold text-white ring-4 ring-violet-100 sm:h-20 sm:w-20">JD</div>
              <div><h1 className="text-xl font-bold">{firstName} {lastName} <span className="ml-1 rounded-full bg-[#f1e7ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-700">VIP Member · Tier 2</span></h1><p className="mt-1 text-sm font-medium text-violet-700">@jordandiaz_drops <span className="mx-1 text-slate-300">•</span> <span className="text-slate-600">Member since March 2024</span></p><p className="mt-2 text-sm text-slate-600">⌖ Austin, TX <span className="ml-2 rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-teal-800">✓ Verified Drop Hunter</span></p></div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[["DROPS CLAIMED", "18", "♨"], ["TOTAL SAVED", "$420", "USD"], ["DROP POINTS", "1,250", "≈ $12.50 reward"], ["ACTIVE VOUCHERS", "3", "●"]].map(([label, value, note]) => <div className="min-w-[110px] rounded-xl border border-slate-100 bg-white/90 p-3" key={label}><p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-lg font-bold text-slate-900">{value} <span className="text-[10px] font-normal text-violet-700">{note}</span></p></div>)}
            </div>
          </div>
        </section>

        <nav aria-label="Account settings" className="mt-5 flex gap-1 overflow-x-auto rounded-xl bg-[#eceeff] p-1">
          {tabs.map(([label, id], index) => <button aria-current={activeTab === label ? "page" : undefined} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:px-4 ${activeTab === label ? "bg-violet-700 text-white shadow-sm" : "text-slate-600 hover:bg-white"}`} key={label} onClick={() => goToTab(label, id)} type="button"><span>{["♙", "⌖", "▣", "♡", "◇"][index]}</span>{label}{index === 1 && <span className="rounded-full bg-white/30 px-1.5">2</span>}{index === 3 && <span className="rounded-full bg-white/30 px-1.5">14</span>}</button>)}
        </nav>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-5">
            <Panel id="personal-details">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">♙ Personal Details</h2><p className="mt-1 text-sm text-slate-600">Manage your identity and high-speed checkout contact defaults.</p></div><button className="rounded-lg bg-[#f1efff] px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100" onClick={() => showNotice("Personal details are ready to edit.")} type="button">Edit All</button></div>
              <form className="mt-5 space-y-3" onSubmit={saveProfile}>
                <div className="grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">First name<input className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-violet-500 focus:outline-none" onChange={(event) => setFirstName(event.target.value)} required value={firstName} /></label><label className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Last name<input className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-violet-500 focus:outline-none" onChange={(event) => setLastName(event.target.value)} required value={lastName} /></label></div>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">Primary email address <span className="float-right rounded-full bg-cyan-50 px-2 py-0.5 text-[9px] text-teal-800">✓ Verified</span><span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3"><span>✉</span><input className="min-w-0 flex-1 border-0 px-0 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:ring-0" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /><button className="shrink-0 text-[10px] font-semibold normal-case text-violet-700 hover:underline" onClick={() => showNotice("Email verification link requested.")} type="button">Change</button></span></label>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">Mobile phone (fast drop SMS alerts) <span className="float-right rounded-full bg-violet-50 px-2 py-0.5 text-[9px] text-violet-700">🔒 2FA Active</span><span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 px-3"><span>▯</span><input className="min-w-0 flex-1 border-0 px-0 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none focus:ring-0" onChange={(event) => setPhone(event.target.value)} value={phone} /><button className="shrink-0 text-[10px] font-semibold normal-case text-violet-700 hover:underline" onClick={() => showNotice("Phone update options opened.")} type="button">Update</button></span></label>
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">Birthday <span className="float-right text-[9px] text-rose-700">♙ Free VIP voucher every year</span><input className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium normal-case tracking-normal text-slate-900 focus:border-violet-500 focus:outline-none" onChange={(event) => setBirthday(event.target.value)} value={birthday} /></label>
                <div className="flex justify-end pt-1"><button className="rounded-lg bg-violet-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-800" type="submit">Save Profile Changes</button></div>
              </form>
            </Panel>

            <Panel id="drop-preferences">
              <h2 className="font-semibold">⚙ Drop Algorithm &amp; Preferences</h2><p className="mt-1 text-sm text-slate-600">Configure which viral drops reach your discovery feed and instant priority queue.</p>
              <div className="mt-4"><p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">Subscribed drop categories</p><div className="flex flex-wrap gap-2">{[...initialCategories, ...extraCategories].map((category, index) => {const selected = categories.includes(category);return <button className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${selected ? "bg-violet-700 text-white" : "bg-[#eceeff] text-slate-700 hover:bg-violet-100"}`} key={category} onClick={() => toggleCategory(category)} type="button">{["▣", "▤", "↗", "♧", "⌘"][index]} &nbsp;{category} <span className="ml-1">{selected ? "×" : "+"}</span></button>;})}</div></div>
              <div className="mt-4 rounded-xl bg-[#f4f3ff] p-4"><h3 className="mb-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">High-velocity drop notifications</h3>
                {([
                  ["instant", "Instant SMS for Flash Live Drops", "Push notifications 3 minutes prior to restricted countdown windows."],
                  ["weekly", "Weekly Curated Creator Drop Summary", "Digest of high-velocity releases from creators you follow."],
                  ["restock", "Restock Alerts for Favorited Wishlist Drops", "Immediate trigger when cancelled or overstock orders re-enter inventory."],
                ] as const).map(([key, title, copy]) => <div className="flex items-center justify-between gap-4 py-2" key={key}><div><p className="text-xs font-semibold">{title}</p><p className="mt-0.5 text-[10px] leading-4 text-slate-500">{copy}</p></div><button aria-checked={notifications[key]} aria-label={title} className={`relative h-5 w-9 shrink-0 rounded-full transition ${notifications[key] ? "bg-violet-700" : "bg-slate-300"}`} onClick={() => setNotifications((current) => ({ ...current, [key]: !current[key] }))} role="switch" type="button"><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${notifications[key] ? "left-[18px]" : "left-0.5"}`} /></button></div>)}
              </div>
            </Panel>

            <Panel>
              <h2 className="font-semibold">✣ Connected Creator Channels</h2><p className="mt-1 text-sm text-slate-600">Connect handles to unlock exclusive influencer drop gates and creator codes.</p>
              <div className="mt-4 space-y-2">{([
                ["tiktok", "TT", "TikTok Profile", "@jordandiaz_creative"],
                ["instagram", "IG", "Instagram", "Sync to unlock stories-only private drops"],
                ["discord", "DC", "Discord Community", "JordanD#9941 • VIP Role Active"],
              ] as const).map(([key, badge, label, detail]) => <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f4f3ff] p-3" key={key}><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">{badge}</span><div><p className="text-xs font-semibold">{label}</p><p className="mt-0.5 text-[10px] text-slate-500">{detail}</p></div></div><button className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${connections[key] ? "border border-violet-200 bg-violet-100 text-violet-800" : "bg-violet-700 text-white hover:bg-violet-800"}`} onClick={() => {setConnections((current) => ({ ...current, [key]: !current[key] }));showNotice(connections[key] ? `${label} disconnected.` : `${label} connected for this session.`);}} type="button">{connections[key] ? "✓ CONNECTED" : "Connect Account"}</button></div>)}</div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel className="border border-[#343b58] bg-gradient-to-br from-[#20283e] to-[#30274e] text-white">
              <div className="flex items-center justify-between"><span className="rounded-full bg-violet-700 px-3 py-1 text-[9px] font-bold uppercase tracking-wide">✦ Drop Pass Active</span><span className="rounded-full bg-white/10 px-2 py-1 text-[9px] text-slate-200">#DP-9921-X2</span></div>
              <h2 className="mt-4 text-lg font-bold">Tier 2: Explorer</h2><p className="text-xs text-slate-300">80% progress to unlock Tier 3 Influencer status.</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-rose-400" /></div><div className="mt-2 flex justify-between text-[10px] text-slate-300"><span>Tier 2 (1,000 pts)</span><span className="font-bold text-fuchsia-200">250 pts left to Tier 3</span></div>
              <div className="mt-4 rounded-xl bg-white/10 p-3"><p className="mb-2 text-[9px] font-bold uppercase tracking-wide text-slate-300">Active VIP Privileges</p><ul className="space-y-1.5 text-xs"><li>✓ 15-Minute Early Access to Live Drops</li><li>✓ Free Express Escrow Shipping Globally</li><li>✓ Exclusive Creator Collab Whitelist</li></ul></div>
              <button className="mt-4 w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-slate-900 hover:bg-violet-50" onClick={() => showNotice("Your 1,250 drop points are available to redeem.")} type="button">▣ Redeem Drop Points ($12.50)</button>
            </Panel>

            <Panel id="payment-method">
              <div className="flex items-center justify-between"><h2 className="font-semibold">▣ Default Payment Method</h2><button className="text-xs font-semibold text-violet-700 hover:underline" onClick={() => showNotice("Add payment method form opened.")} type="button">Add New</button></div>
              <div className="mt-4 rounded-xl bg-gradient-to-br from-violet-700 via-purple-600 to-rose-600 p-4 text-white shadow-md">
                <div className="flex justify-between text-[9px] font-bold uppercase"><span>◉ Escrow Protected</span><span className="rounded-full bg-white/20 px-2 py-0.5">Default</span></div><p className="mt-5 text-lg tracking-[.18em]">•••• &nbsp;•••• &nbsp;•••• &nbsp;4242</p><div className="mt-3 flex justify-between text-[9px]"><span>Cardholder<br /><strong>JORDAN DIAZ</strong></span><span>Expires<br /><strong>08/28</strong></span><span className="self-end text-sm font-bold italic">Mastercard</span></div>
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4f3ff] p-3 text-xs"><span><strong>▣ Apple Pay (Express Checkout)</strong><br /><span className="text-[10px] text-slate-500">Linked to Wallet ID •••• 9012</span></span><button className="text-[10px] font-semibold hover:text-violet-700" onClick={() => showNotice("Wallet management options opened.")} type="button">Manage</button></div>
            </Panel>

            <Panel id="shipping-address">
              <div className="flex items-center justify-between"><h2 className="font-semibold">🚚 Default Shipping Address</h2><button className="text-xs font-semibold text-violet-700 hover:underline" onClick={() => showNotice("You have 2 saved addresses.")} type="button">Manage (2)</button></div>
              <div className="mt-3 rounded-xl bg-[#f4f3ff] p-4"><div className="flex items-center justify-between"><p className="text-xs font-bold">Home Studio <span className="ml-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] text-violet-700">PRIMARY</span></p><span className="text-teal-800">✦</span></div><p className="mt-2 text-[10px] leading-5 text-slate-600">Jordan Diaz<br />410 Brazos St, Suite 700<br />Austin, TX 78701<br />United States</p><div className="mt-3 flex items-center justify-between border-t border-white pt-3 text-[10px]"><span className="text-teal-800">✓ USPS / FedEx Signature on File</span><button className="font-semibold text-violet-700 hover:underline" onClick={() => showNotice("Address editing is available in this session.")} type="button">Edit</button></div></div>
            </Panel>

            <Panel id="security-sessions">
              <div className="flex items-center justify-between"><h2 className="font-semibold">◇ Security &amp; Device Sessions</h2><span className="rounded-full bg-[#e6ebff] px-2 py-1 text-[9px] font-semibold text-violet-800">Strong Grade</span></div>
              <div className="mt-4 flex items-start justify-between gap-3"><div><p className="text-xs font-semibold">Master Password</p><p className="text-[10px] text-slate-500">Last updated 45 days ago</p></div><button className="text-[10px] font-semibold text-violet-700 hover:underline" onClick={() => showNotice("Password change form opened.")} type="button">Change</button></div>
              <div className="mt-3 flex items-start justify-between gap-3 border-t border-slate-100 pt-3"><div><p className="text-xs font-semibold">Two-Factor Authentication</p><p className="text-[10px] text-teal-800">Hardware &amp; Authenticator App Enabled</p></div><span className="text-teal-800">♢</span></div>
              <div className="mt-4 rounded-xl bg-[#f4f3ff] p-3"><p className="text-xs font-semibold"><span className="mr-1 inline-block h-2 w-2 rounded-full bg-rose-500" /> Chrome on macOS (Austin, TX) <span className="float-right text-[9px] text-teal-800">CURRENT SESSION</span></p><p className="mt-1 text-[10px] text-slate-500">IP: 172.56.21.•• (Cloudflare Zero-Trust)</p><p className="mt-1 text-right text-[10px] text-slate-500">Active now</p></div>
              <button className="mt-4 w-full text-center text-[10px] font-semibold text-rose-700 hover:underline" onClick={() => showNotice("Other devices have been signed out for this session.")} type="button">Log Out of All Other Devices</button>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
      {notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl" role="status">{notice}</div>}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { addCartItem, useCartCount } from "@/lib/cart";

const products = [
  {
    name: "AeroGlow RGB Audio Lamp",
    category: "Tech & Audio",
    seller: "NovaTech Studio",
    rating: "4.8",
    sold: "5.1k sold",
    price: 19.99,
    was: 49.99,
    views: "8.4M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQGtIX--YWc1UxC7238Qpoal4j-SInU7Pz1SMuAjQQYIs7afvmIX8-GhaK9WMLgWxO5Aoq1hhh_X2aHy0WiIVmjZVshNznmf3hCm9w6diDKS3zOZhcAE6uwCBUA77QT-nrFsJ9ewT1kT2mBiBjcamVZxyVBSI-C_mxk4QzJNRcMqBYzz0jXLPBs0uqlNij_VK90cudFSKnZs_jxVHH7TAG7ulxnCWnhYkkNdCywew",
    discount: "−60% OFF",
  },
  {
    name: "GlassSkin Pept-Hydrate Mist",
    category: "Beauty & Glow",
    seller: "GlowLab Seoul",
    rating: "4.9",
    sold: "12.8k sold",
    price: 16.5,
    was: 30,
    views: "19.8M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_PfByL0qTHTGbpi3Vf0Rio-KyZzLojeQLI4LCK1IMSU4-seje84ssF5XPxt8n0f_3PMp_Jmz4-hu7WVNBA61LTHNmUDsnRLprMJkOMmPQ8d2Te1IfoWhBu7-4oT9vS2ptiqy6U6qWCsCmilmm9vgym8IPTnrmRuFUDa03KL5Z-_s2apsclELjcbShIwrGz7yef8LuJawiHFHz8IgRjnc81vpEUQpdSieZJAcQdk4",
    discount: "−45% OFF",
  },
  {
    name: "GlowHydrate Smart UV Bottle",
    category: "Wellness",
    seller: "HydroPulse Tech",
    rating: "4.7",
    sold: "3.4k sold",
    price: 18,
    was: 30,
    views: "4.2M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQN_wDYKS0RB3x80D4aYWpMqsrzVXSlWdlhc2ZRFUDXrSttwMuF7cTZjy-Bi8FUBaP9jCiVPTI4fvkTF7zJfPlby_oMGJ5He8BGcVF4F33XDhXwK-MngibMK9PZLX_hiDZrtFtLG2omeA8Od5clVTiwfPome2OQxizB--PKpEWfZPV7b7JyWuDdF6qAW9TFu9XaHqFzYMfuORMAUkCypmUGYmBd4FUagDQrEPP6TI",
    discount: "−40% OFF",
  },
  {
    name: "ClipSound Transparent Earbuds",
    category: "Tech & Audio",
    seller: "PulseAudio Inc",
    rating: "4.9",
    sold: "9.2k sold",
    price: 34.9,
    was: 56,
    views: "11.3M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlBXshVRAXGwiLg7plkgZ2WTik7O3SYD5hy3INVnTFfXKzatccZb6zNIrW8H3Rsx7iNoRck0aF-ylQQZk6LqS16qIJHyOlzsLpSkdVfi4leITDJzt37xnbQZaHv73TeG6wQHiRtD5RJRLj6FXJhmlJvZg7YFgg2bGqKfX_-R3ZaIkKYaJiLNARI30PArxHDoRvyunhZ9cgTu3Q0zEKpBAYXmR_9mNZhjDBYoAn1Vo",
    discount: "−38% OFF",
  },
];

const deals = [
  { title: "ChronoPulse V2 Ring", price: "$69.00", oldPrice: "$219", time: "03:14", image: products[2].image, discount: "−68% OFF" },
  { title: "CloudMist Flame Unit", price: "$24.50", oldPrice: "$49", time: "04:20", image: products[1].image, discount: "−50% OFF" },
  { title: "RetroWave 4K Cam", price: "$48.00", oldPrice: "$110", time: "01:52", image: products[3].image, discount: "−55% OFF" },
  { title: "Lumina MagSafe Stand", price: "$29.99", oldPrice: "$56", time: "02:30", image: products[0].image, discount: "−46% OFF" },
];

const studios = [
  {
    name: "Kira Vex • CyberDrop",
    stats: "2.4M Followers  •  99.8% Trust",
    images: [products[3].image, products[0].image, products[2].image],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Min-Jun Seoul Glow",
    stats: "1.8M Followers  •  99.4% Trust",
    images: [products[1].image, products[2].image, products[0].image],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Chloe Cozy Atelier",
    stats: "3.1M Followers  •  99.9% Trust",
    images: [products[0].image, products[3].image, products[1].image],
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=80",
  },
];

const categories = [
  "All Drops",
  "Viral TikTok",
  "Flash Steals",
  "Tech & Audio",
  "K-Beauty Glow",
  "Desk Setup",
  "Creator Merch",
];

function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`h-[1em] w-[1em] shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {name === "bolt" && <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />}
      {name === "search" && <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>}
      {name === "notifications" && <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>}
      {name === "shopping_bag" && <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>}
      {name === "person" && <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>}
      {name === "arrow_forward" && <><path d="M4 12h15m-6-6 6 6-6 6" /></>}
      {name === "timer" && <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M9 2h6m-3 0v3" /></>}
      {name === "favorite" && <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.8 2.4Z" />}
      {name === "verified" && <><path d="m12 3 2.4 1.4 2.8-.1 1.1 2.6 2.2 1.7-.7 2.7.7 2.7-2.2 1.7-1.1 2.6-2.8-.1L12 20l-2.4-1.4-2.8.1-1.1-2.6-2.2-1.7.7-2.7-.7-2.7 2.2-1.7 1.1-2.6 2.8.1L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>}
      {name === "shopping_cart" && <><circle cx="9" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2 3h2l2.5 12h12l3-9H5" /></>}
      {name === "play_arrow" && <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />}
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Drops");
  const cartCount = useCartCount();
  const [savedProducts, setSavedProducts] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.seller}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        category === "All Drops" ||
        category === "Viral TikTok" ||
        category === "Flash Steals" ||
        product.category.toLowerCase().includes(category.toLowerCase().replace("k-beauty glow", "beauty"));
      return matchesSearch && matchesCategory;
    });
  }, [category, query]);

  function addToCart(name: string) {
    const product = products.find((item) => item.name === name) ?? products[0];
    const deal = deals.find((item) => item.title === name);
    addCartItem({
      id: name.toLowerCase().replaceAll(" ", "-"),
      name,
      price: deal ? Number(deal.price.slice(1)) : product.price,
      image: deal?.image ?? product.image,
    });

    setNotice(`${name} added to your cart.`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function toggleSaved(name: string) {
    setSavedProducts((saved) =>
      saved.includes(name) ? saved.filter((item) => item !== name) : [...saved, name],
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)] backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-5 xl:gap-8">
            <Link className="group flex shrink-0 items-center gap-2" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-rose-500 text-white shadow-sm shadow-purple-500/25 transition group-hover:scale-105">
                <Icon className="text-[22px]" name="bolt" />
              </span>
              <span className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-slate-900">TRENDROP</span>
            </Link>
            <label className="hidden min-w-0 max-w-lg flex-1 items-center rounded-full border border-slate-200/80 bg-slate-50 px-3 py-2 text-sm shadow-sm transition focus-within:border-purple-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-500/10 md:flex">
              <Icon className="mr-2 text-[18px] text-slate-400" name="search" />
              <input
                aria-label="Search drops"
                className="w-full min-w-0 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search viral drops, #SunsetLamp, TikTok hits..."
                value={query}
              />
              <span className="hidden whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold text-slate-600 lg:inline-flex">#SunsetLamp</span>
              <span className="ml-1.5 rounded-full border border-purple-200/60 bg-purple-50 px-2 py-0.5 text-[9px] font-bold tracking-wider text-purple-700">HOT</span>
            </label>
          </div>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-xs font-semibold text-slate-600 xl:flex">
            <a className="border-b-2 border-purple-600 py-2 font-bold text-purple-700" href="#browse-feed">🔥 Trending Drops</a>
            <a className="py-2 transition hover:text-slate-900" href="#kinetic-flash">⚡ Flash Steals</a>
            <a className="py-2 transition hover:text-slate-900" href="#browse-feed">Tech &amp; Gadgets</a>
            <a className="py-2 transition hover:text-slate-900" href="#browse-feed">Beauty &amp; Glow</a>
            <a className="py-2 transition hover:text-slate-900" href="#creator-merch">Creator Merch</a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link className="hidden items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-slate-800 sm:inline-flex" href="/seller/onboarding">
              Become a Seller <Icon className="text-[14px]" name="arrow_forward" />
            </Link>
            <button aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100" type="button" onClick={() => setNotice("You are all caught up.")}>
              <Icon className="text-[18px]" name="notifications" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-600" />
            </button>
            <Link aria-label={`Cart (${cartCount} items)`} className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100" href="/cart">
              <Icon className="text-[18px]" name="shopping_bag" />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white">{cartCount}</span>
            </Link>
            <Link aria-label="Account" className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl border border-purple-200/80 bg-purple-50 text-purple-700 transition hover:border-purple-300" href="/account">
              <Icon className="text-[18px]" name="person" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-9 px-4 pb-14 pt-24 sm:px-6 lg:space-y-12 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-20 -top-32 h-96 w-96 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/20">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> #Drop 488 Live
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200/60 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                    <Icon className="text-[15px]" name="bolt" /> TikTok Velocity Synced
                  </span>
                  <span className="ml-auto hidden text-xs font-medium uppercase tracking-wider text-slate-400 sm:inline-block">Escrow-guaranteed 48hr dispatch</span>
                </div>
                <h1 className="mb-4 font-[family-name:var(--font-headline)] text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl">
                  Where Viral Culture<br />
                  <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Drops First.</span>
                </h1>
                <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  Curated social anomalies, vetted creator drops, and escrow-guaranteed 48hr dispatch directly to your doorstep.
                </p>
                <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                      <Icon className="text-[22px]" name="timer" />
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Batch expires in</span>
                      <span className="font-[family-name:var(--font-headline)] text-base font-bold text-slate-900">04:28:19</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[["04", "Hours"], ["28", "Mins"], ["19", "Secs"]].map(([value, unit]) => (
                      <span className="flex min-w-[52px] flex-col items-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm" key={unit}>
                        <span className={`font-[family-name:var(--font-headline)] text-lg font-bold ${unit === "Secs" ? "text-rose-600" : "text-purple-700"}`}>{value}</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400">{unit}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a className="inline-flex items-center gap-3 rounded-xl bg-purple-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700" href="#browse-feed">
                    Shop Viral Drops <Icon className="text-[16px]" name="arrow_forward" />
                  </a>
                  <Link className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-200" href="/seller/dashboard">
                    <span className="text-purple-600">◎</span> Creator Labs
                  </Link>
                  <div className="flex items-center gap-2 pl-1">
                    <div className="flex -space-x-2">
                      {studios.map((studio) => (
                        <Image alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" height={28} key={studio.name} src={studio.avatar} unoptimized width={28} />
                      ))}
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-[9px] font-bold text-purple-700">+48k</span>
                    </div>
                    <span className="text-[10px] leading-tight text-slate-500"><strong className="text-slate-800">48,200+ drops secured</strong><br />Verified escrow since this week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[440px] rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.08)] lg:col-span-5 lg:max-w-none">
              <Link className="group block" href="/products/aeroglow">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-950">
                  <Image alt="AeroGlow Halo 360 sunset lamp projecting a vivid ambient glow" className="object-cover transition duration-500 group-hover:scale-105" fill priority sizes="(max-width: 1024px) 100vw, 40vw" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdkAuob26NOhzAWBwPUCT4rKwNnD8tW0M_iu9I0zUVn_hEskozhMzDU3T9IEqK285kp6sqHIzFXblbbeX64Eou0k4l5e_FqgIEIg_5WDi49gOn7TqQBxBerfOnuVAFBWS0P0ZEhwIBPfqPtHLTDqOORCGU2keirjCiCbXclPqEntzeUpVNMgBMHnRhJnOu-5UOhIzYrhuts4SsronvlYJDRFz9wrpGDZmTztPunD8" unoptimized />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-rose-600 shadow-sm">🔥 #1 VIRAL TIKTOK THIS WEEK</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/85 px-2 py-1 text-[9px] font-bold text-white"><Icon name="play_arrow" />18.4k watching</span>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">−62% OFF</span>
                </div>
                <div className="pt-3">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-purple-700">Smart Living · Drop #09</span>
                    <span className="flex items-center gap-1 text-slate-500"><span className="text-amber-500">★</span><strong className="text-slate-900">4.9</strong> (3,420 reviews)</span>
                  </div>
                  <h2 className="mt-1 font-[family-name:var(--font-headline)] text-sm font-bold text-slate-900">AeroGlow Halo 360° Sunset Matrix</h2>
                  <p className="mt-1 text-[10px] leading-relaxed text-slate-500">App-controlled optical projection sphere. Viral ambient bedroom aesthetic upgraded for 80+ top interior creators.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-slate-900">$19.99</span>
                    <span className="text-[10px] text-slate-400 line-through">$54.00</span>
                    <span className="text-[10px] font-bold text-rose-600">Save $34.01</span>
                  </div>
                  <div className="mt-2 flex justify-between text-[9px] text-slate-500"><span>Claimed: 84%</span><span className="font-semibold text-rose-600">84% claimed — 16 units remain</span></div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full w-[84%] rounded-full bg-gradient-to-r from-rose-500 to-rose-600" /></div>
                </div>
              </Link>
              <div className="mt-3 flex gap-2">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-rose-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700" onClick={() => addToCart("AeroGlow Halo 360°")} type="button">
                  <Icon className="text-[14px]" name="bolt" /> Claim Instant Drop
                </button>
                <Link aria-label="View product details" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50" href="/products/aeroglow">→</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm" id="kinetic-flash">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 text-xs font-semibold text-slate-900"><span className="text-rose-600">●</span>⚡ Kinetic Flash Deals — 15m Lightning Window <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600">ENDS IN 14:18</span></h2>
            <span className="text-[9px] text-slate-500">↻ Live inventory decrement synced across 4 node clusters</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal) => (
              <button className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 text-left transition hover:border-purple-200 hover:bg-purple-50/40" key={deal.title} onClick={() => addToCart(deal.title)} type="button">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image alt="" className="object-cover" fill sizes="48px" src={deal.image} unoptimized />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1"><span className="truncate text-[10px] font-bold text-slate-900">{deal.title}</span><span className="font-mono text-[8px] text-slate-400">{deal.time}</span></span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[9px]"><span className="font-bold text-slate-900">{deal.price}</span><span className="text-slate-400 line-through">{deal.oldPrice}</span><span className="ml-auto text-[8px] font-bold text-rose-600">{deal.discount}</span></span>
                  <span className="mt-1 block h-1 overflow-hidden rounded-full bg-slate-200"><span className="block h-full w-3/4 rounded-full bg-rose-500" /></span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-5" id="browse-feed">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((item, index) => (
              <button
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-[10px] font-semibold transition ${
                  category === item
                    ? "border-purple-600 bg-purple-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:bg-purple-50"
                }`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {index === 0 ? "▦" : ["", "♨", "⚡", "♬", "✧", "▣", "♙"][index]} {item}
              </button>
            ))}
            <label className="ml-auto hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-500 sm:flex">
              Sort: <select className="bg-transparent font-semibold text-purple-700 outline-none" defaultValue="TikTok Velocity"><option>TikTok Velocity</option><option>Most Popular</option><option>Price: Low to High</option></select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => {
              const saved = savedProducts.includes(product.name);
              return (
                <article className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition duration-300 hover:border-purple-200 hover:shadow-xl" key={product.name}>
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                    <Link aria-label={`View ${product.name}`} className="absolute inset-0 z-0" href="/products/aeroglow" />
                    <Image alt={product.name} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={product.image} unoptimized />
                    <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
                      <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">{product.discount}</span>
                      <span className="flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-medium text-white shadow-sm"><Icon className="text-[10px] text-rose-400" name="play_arrow" />{product.views} Views</span>
                    </div>
                    <button aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} aria-pressed={saved} className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:text-rose-500 ${saved ? "text-rose-500" : "text-slate-600"}`} onClick={() => toggleSaved(product.name)} type="button">
                      <Icon className="text-[16px]" name="favorite" />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-purple-700"><Icon className="text-[13px]" name="verified" />{product.seller}</div>
                      <Link className="line-clamp-1 font-[family-name:var(--font-headline)] text-sm font-bold text-slate-900 transition group-hover:text-purple-700" href="/products/aeroglow">{product.name}</Link>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs"><span className="text-amber-500">★</span><span className="font-bold text-slate-900">{product.rating}</span><span className="text-slate-300">•</span><span className="text-slate-500">{product.sold}</span></div>
                    </div>
                    <div className="pt-3">
                      <div className="mb-2.5 flex items-baseline gap-2"><span className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-slate-900">${product.price.toFixed(2)}</span><span className="text-xs text-slate-400 line-through">${product.was.toFixed(2)}</span></div>
                      <button className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-purple-600 hover:text-white active:scale-[0.98]" onClick={() => addToCart(product.name)} type="button">
                        <Icon className="text-[16px]" name="shopping_cart" />Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {visibleProducts.length === 0 && (
              <p className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No drops match your search. Try another keyword or category.</p>
            )}
          </div>
        </section>

        <section className="space-y-4" id="creator-merch">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">♧ Stripe KYC verified influencer stores</span>
              <h2 className="font-[family-name:var(--font-headline)] text-xl font-extrabold text-slate-900">Verified Creator Studios</h2>
            </div>
            <Link className="text-[10px] font-semibold text-purple-700 hover:text-purple-900" href="/seller/dashboard">Explore All 240+ Studios <span aria-hidden="true">→</span></Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {studios.map((studio) => (
              <article className="rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm" key={studio.name}>
                <div className="mb-3 flex items-center gap-2.5">
                  <Image alt="" className="h-9 w-9 rounded-full object-cover" height={36} src={studio.avatar} unoptimized width={36} />
                  <div><h3 className="text-xs font-bold text-slate-900">{studio.name}</h3><p className="text-[9px] text-slate-500">{studio.stats}</p></div>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-1.5">
                  {studio.images.map((image, index) => <div className="relative h-16 overflow-hidden rounded-lg bg-slate-100" key={`${studio.name}-${index}`}><Image alt={`${studio.name} product ${index + 1}`} className="object-cover" fill sizes="120px" src={image} unoptimized /></div>)}
                </div>
                <div className="flex gap-2">
                  <Link className="flex flex-1 items-center justify-center rounded-lg bg-purple-600 py-2 text-[10px] font-bold text-white transition hover:bg-purple-700" href="/seller/dashboard">Visit Store</Link>
                  <button className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-200" onClick={() => setNotice(`Following ${studio.name}.`)} type="button">Follow</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[9px] shadow-sm">
          <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-900"><span className="text-purple-600">◉</span>Live Global Drop Feed</span>
          <span><strong className="text-slate-900">● Alex M. (Austin, TX)</strong> bought <span className="text-purple-700">AeroGlow Halo 360°</span> <span className="text-slate-400">12s ago</span></span>
          <span><strong className="text-slate-900">● Elena S. (Berlin)</strong> claimed <span className="text-purple-700">ChronoPulse Smart Ring</span> <span className="text-slate-400">34s ago</span></span>
          <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 font-semibold text-slate-600"><span className="text-teal-600">♙</span>Stripe Escrow Protected</span>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-slate-100 pb-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-2">
              <Link className="flex items-center gap-2 font-[family-name:var(--font-headline)] text-lg font-extrabold text-slate-900" href="/"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-700 to-rose-500 text-white"><Icon name="bolt" /></span>TRENDROP</Link>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500">The next-generation viral drop marketplace. Synchronizing TikTok creator experiments, verified merchant safety, and zero-friction global checkout.</p>
              <div className="flex flex-wrap gap-2"><span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[9px] font-semibold text-slate-700">♙ 256-Bit Escrow Vault</span><span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[9px] font-semibold text-slate-700">⚡ Fast-Track Dispatches</span></div>
            </div>
            {[
              ["Discover", ["Live Drop Feed", "Viral Gadgets", "Beauty & Cosmetics", "Creator Collaborations"], "/"],
              ["Seller Hub", ["Seller Portal Onboarding", "Creator Merchant Studio", "Merchant Verification", "Instant Payouts Guarantee"], "/seller/dashboard"],
              ["Trust & Legal", ["Buyer Protection Guarantee", "Refund & Dispute Center", "Privacy Policy", "Terms of Service"], "/orders"],
            ].map(([title, links, href]) => (
              <div className="flex flex-col gap-3" key={title as string}>
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900">{title}</h2>
                {(links as string[]).map((link) => <Link className="text-xs text-slate-500 transition hover:text-slate-900" href={href as string} key={link}>{link}</Link>)}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 pt-6 text-[9px] text-slate-500 md:flex-row">
            <span>© 2025 TRENDROP Global Inc. Powered by high-velocity social commerce architecture.</span>
            <div className="flex gap-5"><Link href="/cart">♙ Encrypted Checkout</Link><Link href="/orders">▣ Global Tracked Drops</Link></div>
          </div>
        </div>
      </footer>

      {notice && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg" role="status">{notice}</div>}
    </div>
  );
}

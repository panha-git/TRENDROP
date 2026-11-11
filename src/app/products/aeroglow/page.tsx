"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCartItem, addCartItems, useCartCount } from "@/lib/cart";
import { getProductById, products } from "@/lib/catalog";

const productImages = [
  {
    alt: "AeroGlow sunset lamp projecting a violet halo",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkAuob26NOhzAWBwPUCT4rKwNnD8tW0M_iu9I0zUVn_hEskozhMzDU3T9IEqK285kp6sqHIzFXblbbeX64Eou0k4l5e_FqgIEIg_5WDi49gOn7TqQBxBerfOnuVAFBWS0P0ZEhwIBPfqPtHLTDqOORCGU2keirjCiCbXclPqEntzeUpVNMgBMHnRhJnOu-5UOhIzYrhuts4SsronvlYJDRFz9wrpGDZmTztPunD8",
  },
  {
    alt: "AeroGlow lamp in a warm ambient room",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuUhJU_MoiGrajzccVgm-TzElkSiDIZ9_xQFSwFD3tOs181Tmn4INWqgee3QxVHrU0V-OHwFR5jTYK0xLP0aKeXsIRJ4r2QUe58I-5IBUjX3pWYWl8jgTogTremS9C_PfNRFImCFh1heKji06st5SzuWlBf40AlWclvO522hr4gqQS8xR5gwB_aMxN5rK7TyMSwqKTvxHaBtq2TLAk2mVeqEB3f2851YX2EbO6DBM",
  },
  {
    alt: "AeroGlow sunset lamp product detail",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDteypFxQ79T8Jzb-A6rSIedKTK76j9YpdV57jam-oVwsbDB0UGwUGL_13idhHTXxc-LOz-SUyQqaeDtsVGIQTvLMOiJJ7sm-EQdCyRrPEj8F61FkHsQyH8esNgSDyeiRMA2LvQGYAWfuGjZaEExZ2WTSAkN0zOqL1cdAFD9WWyKB_L8lHnXFuyFQEIGJ-IvYR4jc4KIhYIL26NgPi0oIoyspB_-IZwzvm9rNlBn50",
  },
  {
    alt: "AeroGlow RGB lamp setup",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnglfQyX6C2JX2f2glAEdfx4JCjF9jT7Y_hVHzrhVbjLP5Ircn5clvYqgJdHOGE3B2eU-_TvCMFZGqZ7EfDMepGcr75Ww1DDwocR4dDWEIegByjWAIXgB5oEKTNFUVZzlwvzxYkJbPCWLClMluJ-QIvcuf0fZhdeNsHbmd-9o2QDwIgpWV4cwC1Cu0uwGUiHIbnbAqZn1_2ZmSS6u2tT_cfIgSSNHe-2jc8WxxfFI",
  },
  {
    alt: "AeroGlow lamp accessories and packaging",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA13YLU6Pmev1NgIWh2jc32TC3Hdyo2rGovwRn-SGAkPPmrNLCP3rykCWNTcG-hhPK6IejfPHdNWbCq9iVXIDVauCDeeF47bq9hgh5xyemuRvwkyeKqlrtupaabI7KItdzligvQXmu49V2FP-bApPoxyovPirgm7hH9yIrjvi-AM3cwVeul6gPkaHd2Ra7eI6PISReiZ2MUqZHuR23THLtT282uQ-eQC-EAU_YqCuw",
  },
  {
    alt: "Video preview of the AeroGlow sunset lamp",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5TrAC5IPvjcQoqkQl14DmPR6TRzRiS2Rqe79ZI0PdjfuDz1euWmqaVuSqgfiJTjw00Anqz6LJ9QtWhe4HG4L0y51ShXFQ2xZYfEKZbf1S4D8-2BiGYtT5kLxTtHlMUuvBFTlYOcUr0ldu2t_am5QUIuj3NbZuyz2rWS8xHtU-O1wXrD5FKGkwvY9Dz0_weJiSlUZXkDWH8eu4osmCHloI_gZegHNfcld-v8rh0eA",
  },
];

const variants = [
  { name: "Sunset Violet", label: "Violet", color: "from-purple-600 to-pink-500" },
  { name: "Solar Amber", label: "Amber", color: "from-amber-400 to-orange-500" },
  { name: "Aurora Mint", label: "Mint", color: "from-emerald-400 to-teal-500" },
  { name: "Deep Ocean", label: "Ocean", color: "from-blue-500 to-indigo-700" },
];

const detailTabs = [
  "Description",
  "Specifications",
  "Customer Reviews (sample)",
  "Seller Information",
] as const;

const specificationRows = [
  ["Projection", "4K crystal aperture optics, 360° swivel"],
  ["Color range", "16 million RGB colors"],
  ["Power input", "USB-C fast input (5V/2A, 10W max)"],
  ["Chassis", "Aircraft-grade matte aluminum alloy"],
  ["LED lifespan", "50,000+ hours continuous run"],
  ["In the box", "Lamp, 24-key RF remote, USB-C cable, quick-start guide"],
];

const recommendations = [
  {
    category: "Ambient Aromatherapy",
    name: "AromaMist Volcano Diffuser",
    price: "$24.99",
    oldPrice: "$35.00",
    badge: "-30%",
    image: productImages[2].src,
    badgeClass: "bg-red-500",
  },
  {
    category: "Sound Reactive",
    name: "SyncPulse Neon Flow Bar",
    price: "$18.50",
    oldPrice: "$28.00",
    badge: "VIRAL",
    image: productImages[3].src,
    badgeClass: "bg-amber-500",
  },
  {
    category: "Studio Grip",
    name: "Carbon Fiber Telescopic Stand",
    price: "$14.99",
    oldPrice: "$22.00",
    badge: "UPGRADE",
    image: productImages[4].src,
    badgeClass: "bg-purple-600",
  },
  {
    category: "GaN Technology",
    name: "65W Multi-Port Fast Hub",
    price: "$21.99",
    oldPrice: "$32.00",
    badge: "POWER",
    image: productImages[4].src,
    badgeClass: "bg-teal-600",
  },
];

function Icon({
  children,
  className = "",
}: {
  children: string;
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
      {children === "local_fire_department" && (
        <path d="M12 22a7 7 0 0 0 7-7c0-3.5-2.5-5.5-3-9-2 1.5-2.5 3-2.5 4.5C10 9 9 6.5 9.5 3 6 6 5 9.5 5 13a7 7 0 0 0 7 9Z" />
      )}
      {children === "search" && <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>}
      {children === "notifications" && <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>}
      {children === "shopping_bag" && <><path d="M5 8h14l1 13H4L5 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>}
      {children === "chevron_right" && <path d="m9 18 6-6-6-6" />}
      {children === "local_shipping" && <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7" /><circle cx="7.5" cy="18.5" r="1.5" /><circle cx="17.5" cy="18.5" r="1.5" /></>}
      {children === "bolt" && <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />}
      {children === "verified" && <><path d="m12 3 2.4 1.4 2.8-.1 1.1 2.6 2.2 1.7-.7 2.7.7 2.7-2.2 1.7-1.1 2.6-2.8-.1L12 20l-2.4-1.4-2.8.1-1.1-2.6-2.2-1.7.7-2.7-.7-2.7 2.2-1.7 1.1-2.6 2.8.1L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>}
      {children === "zoom_in" && <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5M10.8 8v5.6M8 10.8h5.6" /></>}
      {(children === "favorite" || children === "favorite_border") && <path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.8 2.4Z" fill={children === "favorite" ? "currentColor" : "none"} />}
      {children === "share" && <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.5-4.4M8.2 13.2l7.5 4.4" /></>}
      {children === "play_arrow" && <path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none" />}
      {children === "play_circle" && <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" /></>}
      {children === "chat_bubble" && <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2v-6a7.5 7.5 0 1 1 17-3.5Z" />}
      {children === "star" && <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" stroke="none" />}
      {children === "storefront" && <><path d="M3 10v10h18V10M2 10l2-7h16l2 7" /><path d="M2 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6" /></>}
      {children === "trending_up" && <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>}
      {children === "security" && <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>}
      {children === "lock" && <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>}
      {children === "credit_card" && <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M6 15h4" /></>}
      {children === "sell" && <><path d="M20 13 13 20 3 10V3h7l10 10Z" /><circle cx="7.5" cy="7.5" r="1" /></>}
      {children === "library_add" && <><path d="M4 5h12v14H4zM8 2h12v14" /><path d="M10 12h4M12 10v4" /></>}
      {children === "verified_user" && <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>}
      {children === "sentiment_very_satisfied" && <><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 3 4 3 4-3 4-3M9 9h.01M15 9h.01" /></>}
      {children === "wb_sunny" && <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>}
      {children === "graphic_eq" && <path d="M4 10v4m4-8v12m4-10v8m4-14v20m4-13v6" />}
      {children === "screen_rotation_alt" && <><path d="M4 7V3m0 0h4M4 3l5 5M20 17v4m0 0h-4m4 0-5-5" /><rect x="8" y="7" width="8" height="10" rx="1" /></>}
      {children === "check_circle" && <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>}
      {children === "thumb_up" && <><path d="M7 10v11H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3Zm0 0 5-8a3 3 0 0 1 2 3l-1 5h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7" /></>}
      {children === "payments" && <><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 9h.01M18 15h.01" /></>}
    </svg>
  );
}

function RatingStars({ size = "text-[15px]" }: { size?: string }) {
  return (
    <span className="flex text-amber-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Icon
          key={index}
          className={`${size} leading-none`}
        >
          star
        </Icon>
      ))}
    </span>
  );
}

export default function ProductPage() {
  const router = useRouter();
  const product = getProductById("aeroglow-rgb-sunset-lamp")!;
  const bundleProducts = [
    product,
    ...products.filter(
      (item) =>
        item.id === "glassskin-pept-hydrate-mist" ||
        item.id === "clipsound-transparent-earbuds",
    ),
  ];
  const bundleTotal = bundleProducts.reduce((sum, item) => sum + item.price, 0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(variants[0].name);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof detailTabs)[number]>(
    detailTabs[0],
  );
  const cartCount = useCartCount();
  const [notice, setNotice] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const total = product.price * quantity;

  function addToCart(amount = quantity) {
    try {
      addCartItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          variant: selectedVariant,
        },
        amount,
      );
    } catch (error) {
      console.error("Could not add AeroGlow to the cart.", error);
      setNotice("Could not add this product. Please try again.");
      window.setTimeout(() => setNotice(""), 3000);
      return false;
    }
    setNotice(`${amount} AeroGlow ${amount === 1 ? "lamp" : "lamps"} added to your cart.`);
    window.setTimeout(() => setNotice(""), 3000);
    return true;
  }

  function handleCheckout() {
    if (addToCart()) {
      router.push("/cart");
    }
  }

  function addBundleToCart() {
    try {
      addCartItems(
        bundleProducts.map((item) => ({
          item: {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            ...(item.id === product.id ? { variant: selectedVariant } : {}),
          },
          quantity: 1,
        })),
      );
      setNotice("The three selected products were added to your cart.");
    } catch (error) {
      console.error("Could not add the product bundle to the cart.", error);
      setNotice("Could not add the bundle. Please try again.");
    }
    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-[family-name:var(--font-body)] text-slate-800">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-100 bg-white/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-8">
            <Link
              className="flex shrink-0 items-center gap-2 font-[family-name:var(--font-headline)] text-2xl tracking-tight"
              href="/"
              aria-label="Trendrop home"
            >
              <Icon className="text-[28px] text-red-500">local_fire_department</Icon>
              <span className="font-extrabold text-slate-900">
                TREND<span className="text-violet-600">ROP</span>
              </span>
            </Link>
            <div className="hidden max-w-lg flex-1 xl:flex">
              <label className="flex w-full items-center rounded-full border border-slate-200/80 bg-slate-50 px-4 py-2 shadow-inner transition focus-within:border-violet-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-600/20">
                <Icon className="mr-2 text-[20px] text-slate-400">search</Icon>
                <input
                  aria-label="Search products"
                  className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  placeholder="Search viral drops, creator brands, TikTok trends..."
                />
                <span className="ml-2 whitespace-nowrap rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  #ViralGlow
                </span>
                <span className="ml-1.5 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                  HOT
                </span>
              </label>
            </div>
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <Link className="flex items-center gap-1 text-sm font-semibold text-slate-900" href="/">
              Trending Drops <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            </Link>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/#browse-feed">Viral Gadgets</Link>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/#browse-feed">Beauty &amp; Glow</Link>
            <Link className="text-sm font-medium text-slate-600 transition hover:text-slate-900" href="/#creator-merch">Creator Merch</Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              className="hidden items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 md:inline-flex"
              href="/seller/onboarding"
            >
              <Icon className="text-[18px] text-amber-300">verified</Icon>
              <span>Become a Seller</span>
            </a>
            <button
              aria-label="Notifications"
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              type="button"
            >
              <Icon className="text-[22px]">notifications</Icon>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link
              aria-label={`Cart, ${cartCount} items`}
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              href="/cart"
            >
              <Icon className="text-[22px]">shopping_bag</Icon>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </Link>
            <Link aria-label="Account" href="/account" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-xs font-semibold text-white shadow-sm">
              JD
            </Link>
          </div>
        </div>
      </header>

      <main className="min-h-screen w-full pt-20">
        <section className="border-b border-slate-100 bg-white px-6 py-3.5 md:px-10">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-medium text-slate-500">
              <a className="transition hover:text-violet-600" href="#">Tech &amp; Gadgets</a>
              <Icon className="text-[14px] text-slate-400">chevron_right</Icon>
              <a className="transition hover:text-violet-600" href="#">Ambient Lighting</a>
              <Icon className="text-[14px] text-slate-400">chevron_right</Icon>
              <span className="max-w-[220px] truncate font-semibold text-slate-900 md:max-w-md">AeroGlow RGB Sunset Lamp</span>
            </nav>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span>482 shoppers viewing right now</span>
              </div>
              <span className="hidden text-slate-300 sm:inline">•</span>
              <div className="hidden items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 sm:flex">
                <Icon className="text-[15px] text-teal-600">local_shipping</Icon>
                <span>In Stock — Dispatches within 24h from California</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-10">
          <div className="grid grid-cols-12 items-start gap-8 lg:gap-10">
            <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
              <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-5">
                <div className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-950">
                  <Image
                    alt={productImages[selectedImage].alt}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    fill
                    id="mainProductView"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    src={productImages[selectedImage].src}
                    unoptimized
                  />
                  <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                      <Icon className="text-[15px] text-amber-400">local_fire_department</Icon>
                      <span>#1 VIRAL ON TIKTOK (14.2M VIEWS)</span>
                    </div>
                    <div className="flex w-fit items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                      <Icon className="text-[14px]">bolt</Icon>
                      <span>FLASH DEAL ENDS IN <span className="font-mono">02:44:13</span></span>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <button aria-label="Zoom image" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md transition hover:scale-105" type="button">
                      <Icon className="text-[20px]">zoom_in</Icon>
                    </button>
                    <button
                      aria-label={isFavorite ? "Remove from wishlist" : "Save to wishlist"}
                      aria-pressed={isFavorite}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition hover:scale-105 ${isFavorite ? "text-red-500" : "text-slate-700"}`}
                      onClick={() => setIsFavorite((favorite) => !favorite)}
                      type="button"
                    >
                      <Icon className="text-[20px]">{isFavorite ? "favorite" : "favorite_border"}</Icon>
                    </button>
                    <button aria-label="Share product" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:scale-105" type="button">
                      <Icon className="text-[20px]">share</Icon>
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-slate-200/50 bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-sm">
                    <Icon className="text-[14px] text-violet-600">verified</Icon>
                    <span>4K Crystal Aperture Optics</span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2 sm:gap-3">
                  {productImages.map((image, index) => (
                    <button
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={selectedImage === index}
                      className={`group relative aspect-square overflow-hidden rounded-xl bg-slate-100 p-0.5 transition-all ${
                        selectedImage === index
                          ? "ring-2 ring-violet-600"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      key={image.src}
                      onClick={() => setSelectedImage(index)}
                      type="button"
                    >
                      <Image alt={image.alt} className="h-full w-full rounded-lg object-cover" fill sizes="(max-width: 1024px) 16vw, 8vw" src={image.src} unoptimized />
                      {index === 5 && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-white">
                          <Icon className="text-[24px]">play_circle</Icon>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <article className="flex flex-col items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-900 sm:w-36">
                  <Image
                    alt="Creator video review preview"
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, 144px"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9KzXoMfu_Scqorz7OvQ54-kAfcQYT_AjOmHuGydADLz6m-pIEMgU296gnK4OaTbP_DErO1f7lbaDXyF-3IYze45ptbUvnHoMLRBAh2RJQ38jkbTRQWa7M1AT04z8skc5t4iSS9SgUAl3TlnQUVIj-n7VDSdzaUsXggcmmxBnZZ-7Bu-wTZaaMcTncxil5nw3tNvymUWxFe9E_5sf8Xu-49-f0SONrzALr9LXc-I"
                    unoptimized
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-violet-600 shadow">
                      <Icon className="text-[18px]">play_arrow</Icon>
                    </span>
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-white">0:28</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">@maya.techvibes</span>
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">Top Creator Review</span>
                    <span className="ml-auto flex items-center gap-0.5 text-[11px] font-semibold text-teal-600">
                      <Icon className="text-[13px]">verified</Icon> Verified Buyer
                    </span>
                  </div>
                  <p className="text-xs italic leading-snug text-slate-600">
                    “Turned my dull room into a golden hour movie set in 3 seconds. The wireless app presets and color transition range are unreal.”
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Icon className="text-[13px] text-red-500">favorite</Icon>142.8K likes</span>
                    <span className="flex items-center gap-1"><Icon className="text-[13px]">chat_bubble</Icon>1,209</span>
                    <span className="flex items-center gap-1 font-medium text-slate-500"><Icon className="text-[13px] text-amber-500">star</Icon>5.0 Rating</span>
                  </div>
                </div>
              </article>

              <article className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 font-[family-name:var(--font-headline)] text-xl font-bold text-white shadow-md shadow-violet-600/20">NT</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-[family-name:var(--font-headline)] text-lg font-bold text-slate-900">{product.seller}</h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/10 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                        <Icon className="text-[14px]">storefront</Icon> Sample seller
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5 font-semibold text-amber-600"><Icon className="text-[14px] text-amber-500">star</Icon>{product.rating} sample rating</span>
                      <span>•</span>
                      <span className="text-slate-600">Shipping not connected</span>
                    </div>
                  </div>
                </div>
                <a className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto" href="#seller">
                  Visit Store <Icon className="text-[16px]">storefront</Icon>
                </a>
              </article>
            </div>

            <aside className="col-span-12 lg:sticky lg:top-24 lg:col-span-5">
              <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-7">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-amber-700">
                      <Icon className="text-[14px] text-amber-600">trending_up</Icon>
                      #1 Trending in Gadgets
                    </span>
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <RatingStars />
                      <span className="font-bold text-slate-900">{product.rating}</span>
                      <span className="hidden text-slate-400 sm:inline">(sample rating)</span>
                    </div>
                  </div>
                  <h1 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-[26px]">
                    {product.name}
                  </h1>
                  <p className="text-xs leading-relaxed text-slate-500">
                    App + 24-Key Wireless RF Remote Control • 360° Axis Swivel • Aircraft-grade Matte Aluminum Alloy
                  </p>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                    <span className="font-[family-name:var(--font-headline)] text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">${product.price.toFixed(2)}</span>
                    <span className="text-base font-medium text-slate-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                    <span className="rounded-md border border-teal-200/60 bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-600">Sample catalog price</span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">USD</span>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-900">
                  Sample marketplace listing. Live inventory, shipping, and taxes are not connected.
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Color: <span className="font-semibold text-violet-600">{selectedVariant}</span></span>
                    <span className="text-xs text-slate-500">Availability not connected</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {variants.map((variant) => {
                      const selected = variant.name === selectedVariant;
                      return (
                        <button
                          aria-pressed={selected}
                          className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-all ${
                            selected
                              ? "border-violet-600/20 bg-violet-600/5 ring-2 ring-violet-600"
                              : "border-slate-200/80 bg-slate-50 hover:bg-slate-100"
                          }`}
                          key={variant.name}
                          onClick={() => setSelectedVariant(variant.name)}
                          type="button"
                        >
                          <span className={`h-6 w-6 rounded-full bg-gradient-to-tr ${variant.color} shadow-sm`} />
                          <span className={`text-[11px] ${selected ? "font-bold text-slate-800" : "font-medium text-slate-700"}`}>{variant.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-2.5">
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Quantity</span>
                    <span className="text-[10px] text-slate-500">Maximum 99 per option</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      aria-label="Decrease quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      type="button"
                    >−</button>
                    <span aria-live="polite" className="w-5 text-center text-sm font-bold text-slate-900">{quantity}</span>
                    <button
                      aria-label="Increase quantity"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                      disabled={quantity >= 99}
                      onClick={() => setQuantity((value) => Math.min(99, value + 1))}
                      type="button"
                    >+</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-1">
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-4 font-[family-name:var(--font-headline)] text-base font-bold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700 hover:shadow-violet-600/40 active:scale-[0.99]"
                    onClick={handleCheckout}
                    type="button"
                  >
                    <Icon className="text-[20px]">bolt</Icon>
                    Buy now · continue to order preview (${total.toFixed(2)})
                  </button>
                  <button
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 font-[family-name:var(--font-headline)] text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    onClick={() => addToCart()}
                    type="button"
                  >
                    <Icon className="text-[18px]">shopping_bag</Icon>
                    Add to Cart
                  </button>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
                  Checkout saves an unpaid order preview. No payment is taken, and shipping has not been arranged.
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] px-6 py-6 md:px-10">
          <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.03)] sm:p-8">
            <div aria-label="Product details" className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 sm:gap-6" role="tablist">
              {detailTabs.map((tab) => (
                <button
                  aria-selected={activeTab === tab}
                  className={`whitespace-nowrap border-b-2 pb-3 font-[family-name:var(--font-headline)] text-sm transition sm:text-base ${
                    activeTab === tab
                      ? "border-violet-600 font-bold text-violet-600"
                      : "border-transparent font-medium text-slate-500 hover:text-slate-900"
                  }`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Description" && (
              <div className="flex flex-col gap-6" role="tabpanel">
                <div className="flex flex-col gap-3">
                  <h2 className="font-[family-name:var(--font-headline)] text-lg font-bold text-slate-900 sm:text-xl">Cinematic Studio Sunsets Right From Your Desk</h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    The AeroGlow RGB Sunset Projector elevates any living space into an immersive visual sanctuary. Combining high-density optical crystal lenses with 16-million spectrum LED arrays, AeroGlow recreates authentic Golden Hour sunlight gradients, twilight purples, and calming cosmic hues with surgical chromatic accuracy.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["palette", "16M Dynamic Colors", "Switch seamlessly between Sunset Amber, Cyber Magenta, Aurora Green, and 16 million custom shades via iOS & Android app.", "bg-purple-100 text-violet-600"],
                    ["wb_sunny", "Circadian Wake & Sleep", "Program automatic sunrise simulations to wake up energized and gradual dusk fades for melatonin regulation.", "bg-amber-50 text-amber-600"],
                    ["graphic_eq", "Music Sync Pulse", "Built-in acoustic sensor pulses light dynamically to your Spotify playlist, video streams, or TikTok audio.", "bg-teal-50 text-teal-600"],
                    ["screen_rotation_alt", "360° Axis Freedom", "Durable reinforced swivel hinge allows 360-degree horizontal panning and 180-degree vertical projection.", "bg-rose-50 text-rose-600"],
                  ].map(([icon, title, description, colors]) => (
                    <article className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-4" key={title}>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}><Icon className="text-[20px]">{icon}</Icon></span>
                      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                      <p className="text-xs text-slate-500">{description}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Specifications" && (
              <div className="flex flex-col gap-4" role="tabpanel">
                <h2 className="font-[family-name:var(--font-headline)] text-lg font-bold text-slate-900">Technical Specifications &amp; Engineering</h2>
                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                  {specificationRows.map(([label, value]) => (
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4" key={label}>
                      <span className="text-xs font-semibold text-slate-500">{label}</span>
                      <span className="text-right text-sm font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Customer Reviews (sample)" && (
              <div className="flex flex-col gap-6" role="tabpanel">
                <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:flex-row">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="font-[family-name:var(--font-headline)] text-4xl font-extrabold text-slate-900">4.9</div>
                      <RatingStars />
                      <div className="mt-1 text-xs font-medium text-slate-500">1,840 verified reviews</div>
                    </div>
                    <div className="hidden h-14 w-px bg-slate-200 sm:block" />
                    <div className="w-44 space-y-1 text-xs text-slate-500">
                      {[["5★", "92%"], ["4★", "6%"], ["3★", "2%"]].map(([label, width]) => (
                        <div className="flex items-center gap-2" key={label}>
                          <span>{label}</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-amber-400" style={{ width }} /></span><span className="text-[11px] font-semibold text-slate-700">{width}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50" onClick={() => setNotice("Sign in to write a verified review.")} type="button">Write a Review</button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    ["KL", "Kassandra L.", "Los Angeles, CA • 2 days ago", "Insane build quality for under $20!", "Arrived in 2 days to San Diego, setup in literally 45 seconds. The color intensity is way higher than cheap knockoffs, and the borosilicate glass lens produces a razor-sharp halo gradient. The remote and app work flawlessly together.", "38"],
                    ["DW", "David W.", "Austin, TX • 5 days ago", "Transformed my livestream studio aesthetic", "I bought the Sunset Violet and the mood it creates on camera is cinema grade. The 360 swivel lets me project right against my acoustic foam backdrop. Definitely grabbing two more for my creative workspace.", "24"],
                  ].map(([initials, name, location, headline, review, helpful]) => (
                    <article className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm" key={name}>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-violet-600">{initials}</span>
                            <span><span className="block text-xs font-bold text-slate-900">{name}</span><span className="text-[10px] text-slate-400">{location}</span></span>
                          </div>
                          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-700"><Icon className="mr-1 align-middle text-[12px]">check_circle</Icon>Verified Purchase</span>
                        </div>
                        <RatingStars size="text-[16px]" />
                        <h3 className="text-xs font-bold text-slate-900">{headline}</h3>
                        <p className="text-xs leading-relaxed text-slate-600">{review}</p>
                      </div>
                      <div className="flex items-center gap-2 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                        <span>Was this helpful?</span><button className="flex items-center gap-1 font-semibold hover:text-violet-600" type="button"><Icon className="text-[14px]">thumb_up</Icon>{helpful}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Seller Information" && (
              <div className="flex flex-col gap-5" id="seller" role="tabpanel">
                <div className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white">NT</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-bold text-slate-900">{product.seller}</h2><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">Sample seller</span></div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">Seller profile, inventory, and fulfillment details are not connected in this sample catalog.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    ["Dispatch Speed", "Not connected"],
                    ["Customer Rating", `${product.rating} sample rating`],
                    ["Buyer Protection", "No payment protection integration"],
                  ].map(([label, value]) => <div className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-white p-4 shadow-sm" key={label}><span className="text-[11px] font-semibold uppercase text-slate-400">{label}</span><span className="text-sm font-bold text-slate-900">{value}</span></div>)}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1440px] border-t border-slate-200/80 px-6 py-10 md:px-10">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-violet-600">Product bundle</span>
                <h2 className="font-[family-name:var(--font-headline)] text-2xl font-extrabold text-slate-900">Add a bundle to your cart</h2>
              </div>
              <p className="text-xs text-slate-500">Sample catalog prices; no bundle discount is applied.</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] lg:flex-row">
              <div className="flex flex-1 flex-wrap items-center justify-center gap-3 sm:gap-4">
                {bundleProducts.map((bundleProduct, index) => (
                  <div className="contents" key={bundleProduct.id}>
                    {index > 0 && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">+</span>}
                    <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:w-auto">
                      <Image alt={bundleProduct.name} className="h-16 w-16 shrink-0 rounded-xl object-cover" height={64} src={bundleProduct.image} unoptimized width={64} />
                      <div><span className={`block text-[11px] font-bold ${index === 0 ? "text-violet-600" : "text-slate-500"}`}>{bundleProduct.category}</span><span className="block max-w-[160px] truncate text-xs font-bold text-slate-900">{bundleProduct.name}</span><span className="text-xs font-extrabold text-slate-900">${bundleProduct.price.toFixed(2)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex w-full shrink-0 flex-col items-center gap-3 border-t border-slate-200/80 pt-4 lg:w-auto lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div className="text-center lg:text-right">
                  <span className="font-[family-name:var(--font-headline)] text-2xl font-extrabold text-slate-900">${bundleTotal.toFixed(2)}</span>
                  <span className="block text-xs text-slate-500">Total of these three items</span>
                </div>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-[family-name:var(--font-headline)] text-xs font-bold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 sm:w-auto" onClick={addBundleToCart} type="button"><Icon className="text-[18px]">library_add</Icon>Add all 3 to cart</button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2 lg:grid-cols-4">
              {recommendations.map((product) => (
                <article className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md" key={product.name}>
                  <div className="flex flex-col gap-3">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                      <Image alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 1024px) 50vw, 25vw" src={product.image} unoptimized />
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${product.badgeClass}`}>{product.badge}</span>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-violet-600">{product.category}</div>
                      <h3 className="line-clamp-1 text-sm font-bold text-slate-900">{product.name}</h3>
                      <div className="mt-1 flex items-center gap-2"><span className="text-sm font-bold text-slate-900">{product.price}</span><span className="text-xs text-slate-400 line-through">{product.oldPrice}</span></div>
                    </div>
                  </div>
                  <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-xs font-bold text-slate-800 transition hover:bg-violet-600 hover:text-white" onClick={() => addToCart(1)} type="button"><Icon className="text-[16px]">add</Icon>Add Combo</button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-10 border-b border-slate-100 pb-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <Link className="flex items-center gap-2 font-[family-name:var(--font-headline)] text-xl" href="/">
                <Icon className="text-2xl text-red-500">local_fire_department</Icon>
                <span className="font-extrabold text-slate-900">TREND<span className="text-violet-600">ROP</span></span>
              </Link>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500">The high-velocity viral drops ecosystem. Real-time creator merchandise, kinetic trending items, verified merchant safety, and zero-friction checkout.</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"><Icon className="text-[15px] text-teal-600">verified_user</Icon>256-Bit Escrow Vault</span>
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"><Icon className="text-[15px] text-violet-600">bolt</Icon>Instant Drop API</span>
              </div>
            </div>
            {[
              ["Discover", "Live Drop Feed", "Viral Gadgets", "Beauty & Cosmetics", "Creator Collaborations"],
              ["Seller Hub", "Seller Portal Onboarding", "Creator Merchant Studio", "Merchant Verification", "Fast Payouts Guarantee"],
              ["Trust & Legal", "Buyer Protection Guarantee", "Refund & Dispute Center", "Privacy Policy", "Terms of Service"],
            ].map(([title, ...links]) => (
              <div className="flex flex-col gap-3" key={title}>
                <h2 className="font-[family-name:var(--font-headline)] text-sm font-bold text-slate-900">{title}</h2>
                {links.map((link) => <a className="text-xs text-slate-500 transition hover:text-slate-900" href="#" key={link}>{link}</a>)}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-slate-500 md:flex-row">
            <p>© 2025 TRENDROP Global Inc. Powered by Stripe Connect &amp; Shopify-grade escrow infrastructure.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><Icon className="text-[16px] text-teal-600">lock</Icon>Encrypted Checkout</span>
              <span className="flex items-center gap-1.5"><Icon className="text-[16px] text-violet-600">local_shipping</Icon>Global Tracked Drops</span>
            </div>
          </div>
        </div>
      </footer>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}

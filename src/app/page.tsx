"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { addCartItem, useCartCount } from "@/lib/cart";
import { products, type CatalogProduct } from "@/lib/catalog";

const deals = [
  "chronopulse-v2-ring",
  "cloudmist-flame-unit",
  "retrowave-4k-cam",
  "lumina-magsafe-stand",
].flatMap((id) => {
  const product = products.find((item) => item.id === id);
  return product ? [product] : [];
});

const studios = [
  {
    name: "Kira Vex • CyberDrop",
    images: [products[3].image, products[0].image, products[2].image],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Min-Jun Seoul Glow",
    images: [products[1].image, products[2].image, products[0].image],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  },
  {
    name: "Chloe Cozy Atelier",
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

  function addToCart(product: CatalogProduct) {
    try {
      addCartItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      setNotice(`${product.name} added to your cart.`);
    } catch (error) {
      console.error("Could not add the product to the cart.", error);
      setNotice("Could not add this product. Please try again.");
    }
    window.setTimeout(() => setNotice(""), 2600);
  }

  function toggleSaved(name: string) {
    setSavedProducts((saved) =>
      saved.includes(name) ? saved.filter((item) => item !== name) : [...saved, name],
    );
  }

  return (
    <div className="min-h-screen bg-app-background text-primary">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-subtle-border bg-surface/90">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-5 xl:gap-8">
            <Link className="group flex shrink-0 items-center gap-2" href="/">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition">
                <Icon className="text-[22px]" name="bolt" />
              </span>
              <span className="font-[family-name:var(--font-headline)] text-xl font-extrabold tracking-tight text-white">TRENDROP</span>
            </Link>
            <label className="hidden min-w-0 max-w-lg flex-1 items-center rounded-xl border border-subtle-border bg-elevated px-3 py-2.5 text-sm transition focus-within:border-accent md:flex">
              <Icon className="mr-2 text-[18px] text-secondary" name="search" />
              <input
                aria-label="Search drops"
                className="w-full min-w-0 bg-transparent text-sm font-medium text-white outline-none placeholder:text-secondary"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products and categories"
                value={query}
              />
            </label>
          </div>

          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-xs font-semibold text-secondary xl:flex">
            <a className="border-b-2 border-accent py-2 font-bold text-accent-light" href="#browse-feed">Trending Drops</a>
            <a className="py-2 transition hover:text-primary" href="#kinetic-flash">Featured</a>
            <a className="py-2 transition hover:text-primary" href="#browse-feed">Tech &amp; Gadgets</a>
            <a className="py-2 transition hover:text-primary" href="#browse-feed">Beauty &amp; Glow</a>
            <a className="py-2 transition hover:text-primary" href="#creator-merch">Creator Merch</a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link className="hidden items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent sm:inline-flex" href="/seller/onboarding">
              Become a Seller <Icon className="text-[14px]" name="arrow_forward" />
            </Link>
            <button aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-elevated hover:text-white" type="button" onClick={() => setNotice("Notifications are not connected yet.")}>
              <Icon className="text-[18px]" name="notifications" />
            </button>
            <Link aria-label={`Cart (${cartCount} items)`} className="relative flex h-9 w-9 items-center justify-center rounded-lg text-secondary transition hover:bg-elevated hover:text-white" href="/cart">
              <Icon className="text-[18px]" name="shopping_bag" />
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">{cartCount}</span>
            </Link>
            <Link aria-label="Account" className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-subtle-border bg-elevated text-accent-light transition hover:border-accent-border" href="/account">
              <Icon className="text-[18px]" name="person" />
            </Link>
          </div>
        </div>
        <label className="flex items-center gap-2 border-t border-subtle-border px-4 py-2.5 md:hidden">
          <Icon className="text-[18px] text-secondary" name="search" />
          <input
            aria-label="Search products"
            className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-secondary"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products and categories"
            value={query}
          />
        </label>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-8 px-4 pb-14 pt-32 sm:px-6 md:pt-24 lg:space-y-10 lg:px-8">
        <section className="commerce-card relative overflow-hidden p-5 sm:p-8 lg:p-10">
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-between lg:col-span-7">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-md border border-accent-border bg-accent-muted px-2.5 py-1 text-xs font-semibold text-accent-light">
                    TRENDROP marketplace
                  </span>
                  <span className="text-xs text-secondary">Product discovery</span>
                </div>
                <h1 className="mb-4 font-[family-name:var(--font-headline)] text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl">
                  Discover products<br />
                  <span className="text-accent-light">worth sharing.</span>
                </h1>
                <p className="mb-6 max-w-xl text-sm leading-relaxed text-secondary sm:text-base">
                  Explore the TRENDROP catalog, find creator collections, and add products to your cart.
                </p>
                <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-subtle-border bg-elevated p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-muted text-accent-light">
                      <Icon className="text-[22px]" name="shopping_bag" />
                    </span>
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-secondary">Browse the catalog</span>
                      <span className="font-[family-name:var(--font-headline)] text-base font-bold text-primary">Shop by category</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["Tech & Audio", "Beauty & Glow", "Wellness"].map((item) => (
                      <span className="rounded-md border border-subtle-border bg-surface px-2.5 py-1.5 text-secondary" key={item}>{item}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a className="commerce-button-primary inline-flex items-center gap-3 px-4 py-3 text-xs font-bold" href="#browse-feed">
                    Shop Viral Drops <Icon className="text-[16px]" name="arrow_forward" />
                  </a>
                  <Link className="commerce-button-secondary inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold" href="/seller/dashboard">
                    <span className="text-accent-light">◎</span> Creator Labs
                  </Link>
                </div>
              </div>
            </div>

            <div className="commerce-card mx-auto w-full max-w-[440px] p-3 lg:col-span-5 lg:max-w-none">
              <Link className="group block" href="/products/aeroglow">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-950">
                  <Image alt="AeroGlow Halo 360 sunset lamp projecting a vivid ambient glow" className="object-cover transition duration-500 group-hover:scale-105" fill priority sizes="(max-width: 1024px) 100vw, 40vw" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdkAuob26NOhzAWBwPUCT4rKwNnD8tW0M_iu9I0zUVn_hEskozhMzDU3T9IEqK285kp6sqHIzFXblbbeX64Eou0k4l5e_FqgIEIg_5WDi49gOn7TqQBxBerfOnuVAFBWS0P0ZEhwIBPfqPtHLTDqOORCGU2keirjCiCbXclPqEntzeUpVNMgBMHnRhJnOu-5UOhIzYrhuts4SsronvlYJDRFz9wrpGDZmTztPunD8" unoptimized />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-semibold text-white">Featured product</span>
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-lg bg-accent px-2 py-1 text-[10px] font-extrabold text-white">{products[0].discount}</span>
                </div>
                <div className="pt-3">
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-accent-light">{products[0].category}</span>
                    <span className="text-xs text-secondary">Sample catalog</span>
                  </div>
                  <h2 className="mt-1 font-[family-name:var(--font-headline)] text-sm font-bold text-primary">{products[0].name}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-secondary">View product details and available options.</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-primary">${products[0].price.toFixed(2)}</span>
                    <span className="text-[10px] text-secondary line-through">${products[0].compareAtPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-secondary">Sample price</span>
                  </div>
                </div>
              </Link>
              <div className="mt-3 flex gap-2">
                <button className="commerce-button-primary flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold" onClick={() => addToCart(products[0])} type="button">
                  <Icon className="text-[14px]" name="shopping_cart" /> Add to Cart
                </button>
                <Link aria-label="View product details" className="flex h-9 w-9 items-center justify-center rounded-lg border border-subtle-border text-secondary transition hover:bg-elevated" href="/products/aeroglow">→</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="commerce-card p-4 sm:p-5" id="kinetic-flash">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-subtle-border pb-3">
            <h2 className="commerce-section-heading">Featured products</h2>
            <span className="text-xs text-secondary">Sample catalog · prices in USD</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((product) => (
              <button className="flex min-w-0 items-center gap-3 rounded-lg border border-subtle-border bg-elevated p-2.5 text-left transition hover:border-accent-border hover:bg-accent-muted focus-visible:outline-2 focus-visible:outline-purple-400" key={product.id} onClick={() => addToCart(product)} type="button">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-elevated">
                  <Image alt="" className="object-cover" fill sizes="56px" src={product.image} unoptimized />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-primary">{product.name}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs"><span className="font-bold text-primary">${product.price.toFixed(2)}</span><span className="text-secondary line-through">${product.compareAtPrice.toFixed(2)}</span></span>
                  <span className="mt-1 block text-[10px] text-secondary">Add to cart</span>
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
                    ? "border-accent bg-accent text-white"
                    : "border-subtle-border bg-elevated text-secondary hover:border-accent-border hover:bg-accent-muted"
                }`}
                key={item}
                onClick={() => setCategory(item)}
                type="button"
              >
                {index === 0 ? "▦" : ["", "♨", "⚡", "♬", "✧", "▣", "♙"][index]} {item}
              </button>
            ))}
            <label className="ml-auto hidden items-center gap-2 rounded-lg border border-subtle-border bg-elevated px-3 py-2 text-xs text-secondary sm:flex">
              Sort: <select className="bg-transparent font-semibold text-accent-light outline-none" defaultValue="TikTok Velocity"><option>TikTok Velocity</option><option>Most Popular</option><option>Price: Low to High</option></select>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleProducts.map((product) => {
              const saved = savedProducts.includes(product.name);
              return (
                <article className="commerce-card group flex flex-col justify-between p-3 transition duration-200 hover:border-accent-border" key={product.name}>
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-lg border border-subtle-border bg-elevated">
                    <Link aria-label={`View ${product.name}`} className="absolute inset-0 z-0" href={`/products/${product.slug}`} />
                    <Image alt={product.name} className="object-cover transition-transform duration-500 group-hover:scale-105" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" src={product.image} unoptimized />
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-slate-950/85 px-2 py-1 text-[10px] font-semibold text-white">{product.discount}</span>
                    <button aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`} aria-pressed={saved} className={`absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-subtle-border bg-surface/90 transition hover:text-accent-light ${saved ? "text-accent-light" : "text-secondary"}`} onClick={() => toggleSaved(product.name)} type="button">
                      <Icon className="text-[16px]" name="favorite" />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-1 text-xs text-secondary">{product.seller}</div>
                      <Link className="line-clamp-1 font-[family-name:var(--font-headline)] text-sm font-bold text-primary transition group-hover:text-accent-light" href={`/products/${product.slug}`}>{product.name}</Link>
                      <div className="mt-1.5 flex items-center gap-1.5 text-xs"><span className="text-amber-500">★</span><span className="font-semibold text-primary">{product.rating}</span><span className="text-secondary">sample rating</span></div>
                    </div>
                    <div className="pt-3">
                      <div className="mb-2.5 flex items-baseline gap-2"><span className="font-[family-name:var(--font-headline)] text-lg font-extrabold text-primary">${product.price.toFixed(2)}</span><span className="text-xs text-secondary line-through">${product.compareAtPrice.toFixed(2)}</span></div>
                      <button className="commerce-button-secondary flex w-full items-center justify-center gap-1.5 py-2.5 text-xs font-semibold" onClick={() => addToCart(product)} type="button">
                        <Icon className="text-[16px]" name="shopping_cart" />Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
            {visibleProducts.length === 0 && (
              <p className="commerce-card col-span-full p-8 text-center text-sm text-secondary">No products match your search. Try another keyword or category.</p>
            )}
          </div>
        </section>

        <section className="space-y-4" id="creator-merch">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">Creator collections</span>
              <h2 className="commerce-section-heading mt-1">Featured creator collections</h2>
            </div>
            <Link className="text-sm font-semibold text-accent-light hover:text-accent-light" href="/seller/dashboard">Explore creator tools <span aria-hidden="true">→</span></Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {studios.map((studio) => (
              <article className="commerce-card p-3.5" key={studio.name}>
                <div className="mb-3 flex items-center gap-2.5">
                  <Image alt="" className="h-9 w-9 rounded-full object-cover" height={36} src={studio.avatar} unoptimized width={36} />
                  <div><h3 className="text-sm font-semibold text-primary">{studio.name}</h3><p className="text-xs text-secondary">Sample creator collection</p></div>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-1.5">
                  {studio.images.map((image, index) => <div className="relative h-16 overflow-hidden rounded-lg bg-elevated" key={`${studio.name}-${index}`}><Image alt={`${studio.name} product ${index + 1}`} className="object-cover" fill sizes="120px" src={image} unoptimized /></div>)}
                </div>
                <div className="flex gap-2">
                  <Link className="commerce-button-primary flex flex-1 items-center justify-center py-2 text-xs font-semibold" href="/seller/dashboard">Visit store</Link>
                  <button className="commerce-button-secondary px-3 py-2 text-xs font-semibold" onClick={() => setNotice(`Following ${studio.name}.`)} type="button">Follow</button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="commerce-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
          <span className="font-semibold text-primary">Catalog preview</span>
          <span className="text-secondary">Product ratings and comparison prices are sample data.</span>
          <span className="text-secondary">Checkout saves an unpaid order preview; payment and shipping are not connected.</span>
        </section>
      </main>

      <footer className="border-t border-subtle-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 border-b border-subtle-border pb-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-3 lg:col-span-2">
              <Link className="flex items-center gap-2 font-[family-name:var(--font-headline)] text-lg font-extrabold text-primary" href="/"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white"><Icon name="bolt" /></span>TRENDROP</Link>
              <p className="max-w-sm text-sm leading-relaxed text-secondary">Discover products, creator collections, and a simple cart experience.</p>
              <div className="flex flex-wrap gap-2"><span className="rounded-md border border-subtle-border bg-elevated px-2.5 py-1.5 text-xs font-medium text-secondary">Sample catalog</span><span className="rounded-md border border-subtle-border bg-elevated px-2.5 py-1.5 text-xs font-medium text-secondary">No payment integration</span></div>
            </div>
            {[
              ["Discover", ["All products", "Tech & Audio", "Beauty & Cosmetics", "Creator Collections"], "/"],
              ["Seller Hub", ["Seller onboarding", "Seller dashboard", "Creator tools", "Store management"], "/seller/onboarding"],
              ["Account", ["My account", "My orders", "Cart & checkout", "Registration"], "/account"],
            ].map(([title, links, href]) => (
              <div className="flex flex-col gap-3" key={title as string}>
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-primary">{title}</h2>
                {(links as string[]).map((link) => <Link className="text-xs text-secondary transition hover:text-primary" href={href as string} key={link}>{link}</Link>)}
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-between gap-3 pt-6 text-[9px] text-secondary md:flex-row">
            <span>© 2026 TRENDROP</span>
            <div className="flex gap-5"><Link href="/cart">Cart &amp; checkout</Link><Link href="/orders">My orders</Link></div>
          </div>
        </div>
      </footer>

      {notice && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-surface px-5 py-3 text-sm font-medium text-white shadow-lg" role="status">{notice}</div>}
    </div>
  );
}

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  seller: string;
  price: number;
  compareAtPrice: number;
  rating: string;
  sold: string;
  views: string;
  image: string;
  discount: string;
  variants?: string[];
};

export const products: CatalogProduct[] = [
  {
    id: "aeroglow-rgb-sunset-lamp",
    slug: "aeroglow",
    name: "AeroGlow RGB Smart Sunset Lamp & Halo Projection",
    category: "Tech & Audio",
    seller: "NovaTech Studio",
    price: 19.99,
    compareAtPrice: 49.99,
    rating: "4.9",
    sold: "5.1k sold",
    views: "8.4M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkAuob26NOhzAWBwPUCT4rKwNnD8tW0M_iu9I0zUVn_hEskozhMzDU3T9IEqK285kp6sqHIzFXblbbeX64Eou0k4l5e_FqgIEIg_5WDi49gOn7TqQBxBerfOnuVAFBWS0P0ZEhwIBPfqPtHLTDqOORCGU2keirjCiCbXclPqEntzeUpVNMgBMHnRhJnOu-5UOhIzYrhuts4SsronvlYJDRFz9wrpGDZmTztPunD8",
    discount: "−60% OFF",
    variants: ["Sunset Violet", "Solar Amber", "Aurora Mint", "Deep Ocean"],
  },
  {
    id: "glassskin-pept-hydrate-mist",
    slug: "glassskin-mist",
    name: "GlassSkin Pept-Hydrate Mist",
    category: "Beauty & Glow",
    seller: "GlowLab Seoul",
    price: 16.5,
    compareAtPrice: 30,
    rating: "4.9",
    sold: "12.8k sold",
    views: "19.8M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_PfByL0qTHTGbpi3Vf0Rio-KyZzLojeQLI4LCK1IMSU4-seje84ssF5XPxt8n0f_3PMp_Jmz4-hu7WVNBA61LTHNmUDsnRLprMJkOMmPQ8d2Te1IfoWhBu7-4oT9vS2ptiqy6U6qWCsCmilmm9vgym8IPTnrmRuFUDa03KL5Z-_s2apsclELjcbShIwrGz7yef8LuJawiHFHz8IgRjnc81vpEUQpdSieZJAcQdk4",
    discount: "−45% OFF",
  },
  {
    id: "glowhydrate-smart-uv-bottle",
    slug: "glowhydrate-bottle",
    name: "GlowHydrate Smart UV Bottle",
    category: "Wellness",
    seller: "HydroPulse Tech",
    price: 18,
    compareAtPrice: 30,
    rating: "4.7",
    sold: "3.4k sold",
    views: "4.2M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQN_wDYKS0RB3x80D4aYWpMqsrzVXSlWdlhc2ZRFUDXrSttwMuF7cTZjy-Bi8FUBaP9jCiVPTI4fvkTF7zJfPlby_oMGJ5He8BGcVF4F33XDhXwK-MngibMK9PZLX_hiDZrtFtLG2omeA8Od5clVTiwfPome2OQxizB--PKpEWfZPV7b7JyWuDdF6qAW9TFu9XaHqFzYMfuORMAUkCypmUGYmBd4FUagDQrEPP6TI",
    discount: "−40% OFF",
  },
  {
    id: "clipsound-transparent-earbuds",
    slug: "clipsound-earbuds",
    name: "ClipSound Transparent Earbuds",
    category: "Tech & Audio",
    seller: "PulseAudio Inc",
    price: 34.9,
    compareAtPrice: 56,
    rating: "4.9",
    sold: "9.2k sold",
    views: "11.3M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlBXshVRAXGwiLg7plkgZ2WTik7O3SYD5hy3INVnTFfXKzatccZb6zNIrW8H3Rsx7iNoRck0aF-ylQQZk6LqS16qIJHyOlzsLpSkdVfi4leITDJzt37xnbQZaHv73TeG6wQHiRtD5RJRLj6FXJhmlJvZg7YFgg2bGqKfX_-R3ZaIkKYaJiLNARI30PArxHDoRvyunhZ9cgTu3Q0zEKpBAYXmR_9mNZhjDBYoAn1Vo",
    discount: "−38% OFF",
  },
  {
    id: "chronopulse-v2-ring",
    slug: "chronopulse-ring",
    name: "ChronoPulse V2 Ring",
    category: "Wellness",
    seller: "HydroPulse Tech",
    price: 69,
    compareAtPrice: 219,
    rating: "4.7",
    sold: "1.2k sold",
    views: "3.8M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQN_wDYKS0RB3x80D4aYWpMqsrzVXSlWdlhc2ZRFUDXrSttwMuF7cTZjy-Bi8FUBaP9jCiVPTI4fvkTF7zJfPlby_oMGJ5He8BGcVF4F33XDhXwK-MngibMK9PZLX_hiDZrtFtLG2omeA8Od5clVTiwfPome2OQxizB--PKpEWfZPV7b7JyWuDdF6qAW9TFu9XaHqFzYMfuORMAUkCypmUGYmBd4FUagDQrEPP6TI",
    discount: "−68% OFF",
  },
  {
    id: "cloudmist-flame-unit",
    slug: "cloudmist-flame-unit",
    name: "CloudMist Flame Unit",
    category: "Beauty & Glow",
    seller: "GlowLab Seoul",
    price: 24.5,
    compareAtPrice: 49,
    rating: "4.8",
    sold: "2.3k sold",
    views: "6.1M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_PfByL0qTHTGbpi3Vf0Rio-KyZzLojeQLI4LCK1IMSU4-seje84ssF5XPxt8n0f_3PMp_Jmz4-hu7WVNBA61LTHNmUDsnRLprMJkOMmPQ8d2Te1IfoWhBu7-4oT9vS2ptiqy6U6qWCsCmilmm9vgym8IPTnrmRuFUDa03KL5Z-_s2apsclELjcbShIwrGz7yef8LuJawiHFHz8IgRjnc81vpEUQpdSieZJAcQdk4",
    discount: "−50% OFF",
  },
  {
    id: "retrowave-4k-cam",
    slug: "retrowave-4k-cam",
    name: "RetroWave 4K Cam",
    category: "Tech & Audio",
    seller: "PulseAudio Inc",
    price: 48,
    compareAtPrice: 110,
    rating: "4.8",
    sold: "2.1k sold",
    views: "7.4M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDlBXshVRAXGwiLg7plkgZ2WTik7O3SYD5hy3INVnTFfXKzatccZb6zNIrW8H3Rsx7iNoRck0aF-ylQQZk6LqS16qIJHyOlzsLpSkdVfi4leITDJzt37xnbQZaHv73TeG6wQHiRtD5RJRLj6FXJhmlJvZg7YFgg2bGqKfX_-R3ZaIkKYaJiLNARI30PArxHDoRvyunhZ9cgTu3Q0zEKpBAYXmR_9mNZhjDBYoAn1Vo",
    discount: "−55% OFF",
  },
  {
    id: "lumina-magsafe-stand",
    slug: "lumina-magsafe-stand",
    name: "Lumina MagSafe Stand",
    category: "Tech & Audio",
    seller: "NovaTech Studio",
    price: 29.99,
    compareAtPrice: 56,
    rating: "4.8",
    sold: "1.8k sold",
    views: "5.6M",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdkAuob26NOhzAWBwPUCT4rKwNnD8tW0M_iu9I0zUVn_hEskozhMzDU3T9IEqK285kp6sqHIzFXblbbeX64Eou0k4l5e_FqgIEIg_5WDi49gOn7TqQBxBerfOnuVAFBWS0P0ZEhwIBPfqPtHLTDqOORCGU2keirjCiCbXclPqEntzeUpVNMgBMHnRhJnOu-5UOhIzYrhuts4SsronvlYJDRFz9wrpGDZmTztPunD8",
    discount: "−46% OFF",
  },
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

"use client";

import { useSyncExternalStore } from "react";
import { getProductById } from "@/lib/catalog";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
};

const storageKey = "trendrop-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem(storageKey);

  if (!savedCart) {
    return [];
  }

  let parsedCart: unknown;

  try {
    parsedCart = JSON.parse(savedCart);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Saved cart data is invalid JSON.", error);
      return [];
    }

    throw error;
  }

  if (!Array.isArray(parsedCart)) {
    console.error("Saved cart data is not a list.");
    return [];
  }

  return parsedCart.flatMap((item): CartItem[] => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      typeof item.id !== "string" ||
      !("quantity" in item) ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99
    ) {
      return [];
    }

    const product = getProductById(item.id);
    if (!product) {
      return [];
    }

    const variant =
      "variant" in item && typeof item.variant === "string"
        ? item.variant
        : undefined;
    if (variant && !product.variants?.includes(variant)) {
      return [];
    }

    return [{
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product.image,
      ...(variant ? { variant } : {}),
    }];
  });
}

export function saveCart(cart: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(cart));
  window.dispatchEvent(new Event("trendrop-cart-change"));
}

export function addCartItems(
  entries: Array<{ item: Omit<CartItem, "quantity">; quantity: number }>,
) {
  const validatedEntries = entries.map(({ item, quantity }) => {
    const product = getProductById(item.id);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("This product or quantity is not available.");
    }
    if (item.variant && !product.variants?.includes(item.variant)) {
      throw new Error("This product option is not available.");
    }
    return { product, variant: item.variant, quantity };
  });
  const cart = readCart();

  const increments = new Map<string, number>();
  for (const { product, variant, quantity } of validatedEntries) {
    const key = `${product.id}:${variant ?? ""}`;
    increments.set(key, (increments.get(key) ?? 0) + quantity);
  }
  for (const [key, increment] of increments) {
    const existingQuantity = cart.find(
      (cartItem) => `${cartItem.id}:${cartItem.variant ?? ""}` === key,
    )?.quantity ?? 0;
    if (existingQuantity + increment > 99) {
      throw new Error("A cart item cannot exceed a quantity of 99.");
    }
  }

  for (const { product, variant, quantity } of validatedEntries) {
    const existingItem = cart.find(
      (cartItem) =>
        cartItem.id === product.id && cartItem.variant === variant,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
        ...(variant ? { variant } : {}),
      });
    }
  }

  saveCart(cart);

  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
}

export function addCartItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  return addCartItems([{ item, quantity }]);
}

function getCartCount() {
  return readCart().reduce((total, item) => total + item.quantity, 0);
}

function subscribeToCart(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("trendrop-cart-change", listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("trendrop-cart-change", listener);
  };
}

export function useCartCount() {
  return useSyncExternalStore(subscribeToCart, getCartCount, () => 0);
}

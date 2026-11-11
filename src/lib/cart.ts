"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
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

  return parsedCart.filter(
    (item): item is CartItem =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string" &&
      "name" in item &&
      typeof item.name === "string" &&
      "price" in item &&
      typeof item.price === "number" &&
      Number.isFinite(item.price) &&
      "quantity" in item &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      "image" in item &&
      typeof item.image === "string",
  );
}

export function saveCart(cart: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(cart));
  window.dispatchEvent(new Event("trendrop-cart-change"));
}

export function addCartItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = readCart();
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  saveCart(cart);

  return cart.reduce((total, cartItem) => total + cartItem.quantity, 0);
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

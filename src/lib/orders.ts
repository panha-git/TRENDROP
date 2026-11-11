export type OrderReference = {
  id: string;
  accessToken: string;
};

const storageKey = "trendrop-order-access";

export function readOrderReferences(): OrderReference[] {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Saved order references are invalid JSON.", error);
      return [];
    }
    throw error;
  }

  if (!Array.isArray(parsed)) {
    console.error("Saved order references are not a list.");
    return [];
  }

  return parsed.filter(
    (item): item is OrderReference =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string" &&
      /^[a-f\d]{24}$/i.test(item.id) &&
      "accessToken" in item &&
      typeof item.accessToken === "string" &&
      /^[a-f\d]{64}$/i.test(item.accessToken),
  );
}

export function saveOrderReference(reference: OrderReference) {
  const references = readOrderReferences().filter(
    (saved) => saved.id !== reference.id,
  );
  window.localStorage.setItem(
    storageKey,
    JSON.stringify([reference, ...references]),
  );
}

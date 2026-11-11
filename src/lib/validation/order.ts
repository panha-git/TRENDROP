import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(99),
        variant: z.string().optional(),
      }),
    )
    .min(1)
    .max(30)
    .superRefine((items, context) => {
      const quantities = new Map<string, number>();
      items.forEach((item, index) => {
        const key = `${item.productId}:${item.variant ?? ""}`;
        const total = (quantities.get(key) ?? 0) + item.quantity;
        quantities.set(key, total);
        if (total > 99) {
          context.addIssue({
            code: "custom",
            message: "A product option cannot exceed a quantity of 99.",
            path: [index, "quantity"],
          });
        }
      });
    }),
  shippingAddress: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(254),
    address: z.string().trim().min(4).max(200),
    city: z.string().trim().min(1).max(100),
    region: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().min(2).max(20),
    country: z.string().trim().min(2).max(80),
  }),
});

export const orderLookupSchema = z.object({
  accessToken: z.string().regex(/^[a-f0-9]{64}$/i),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

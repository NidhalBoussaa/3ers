import { z } from "zod";

/** Shared between the form (client) and /api/orders (server). */
export const OrderRequestSchema = z.object({
  partner1: z.string().trim().min(1, "Ce prénom manque").max(60),
  partner2: z.string().trim().min(1, "Ce prénom manque").max(60),
  weddingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choisissez la date de votre mariage"),
  language: z.enum(["fr", "ar", "en", "all"]),
  tier: z.enum(["essentiel", "prestige", "indecis"]).default("indecis"),
  email: z.email("Cette adresse ne semble pas valide").max(200),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — humans never see it, bots fill it.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type OrderRequest = z.infer<typeof OrderRequestSchema>;

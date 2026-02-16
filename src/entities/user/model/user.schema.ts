import { z } from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  image: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z
    .object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .optional(),
  company: z
    .object({
      name: z.string().optional(),
      title: z.string().optional(),
    })
    .optional(),
});

export const userLiteSchema = z.object({
  id: z.number(),
  username: z.string(),
  image: z.string().optional(),
});

export const usersLiteResponseSchema = z.object({
  users: z.array(userLiteSchema),
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserLiteSchema = z.infer<typeof userLiteSchema>;

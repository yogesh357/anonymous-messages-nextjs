import {  z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be atleast 2 character long")
    .max(36, "Username must not conatin more that 36 character long")
    .regex(/^[a-zA-Z0-9_]{3,16}$/, "Username must not conatin special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "password must be at least 6 characters" })
})
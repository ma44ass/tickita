import { z } from "zod";

export const createworkSpaceSchema = z.object({
    name: z.string().trim().min(1, "required"),

});
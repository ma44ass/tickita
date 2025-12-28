import { Hono } from "hono";
import {deleteCookie, setCookie} from "hono/cookie";
import {zValidator} from "@hono/zod-validator";


import { loginSchema, registerSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "@/features/constants";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
    .get(
        "/current",
        sessionMiddleware,
        (c) => {
            const user = c.get("user");

            return c.json({data: user});
        }
    )
    .post(
        "/login",
        zValidator("json", loginSchema),
        async (c) => {
            const {email, password} = c.req.valid("json");
            // console.log({email, password});

            const {account} = await createAdminClient();
            const session = await account.createEmailPasswordSession({
                email,
                password,
             });

            setCookie(c, AUTH_COOKIE, session.secret, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 30,
            });

            return c.json({success: true});
    }
)
.post(
    "/register",
    zValidator("json", registerSchema),
    async (c) => {
        const { name, email, password} = c.req.valid("json");
        // console.log({name, email, password});

        const {account} = await createAdminClient();
        await account.create({
        userId: ID.unique(),
        email,
        password,
        name
        });

          const session = await account.createEmailPasswordSession({
            email,
            password
        });

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30,
        });

        return c.json({success: true});
    }
)
.post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");
    deleteCookie(c, AUTH_COOKIE);
    await account.deleteSessions()

    return c.json({success: true});
})

export default app;


import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createworkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
    .post(
        "/",
        zValidator("json", createworkSpaceSchema),
        sessionMiddleware,
        async (c) => {
            const tablesDB = c.get("TablesDB");
            const user = c.get("user");

            const {name} = c.req.valid("json");

            const workspace = await tablesDB.createRow({
                databaseId:DATABASE_ID,
                tableId:WORKSPACES_ID,
                rowId:ID.unique(),
                data:{
                  NAME: name,
                  userId: user.$id,
                },
            });

            return c.json({data : workspace});
        }
    );

export default app;

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query, Models } from "node-appwrite"; 

import { createworkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";

const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const tablesDB = c.get("TablesDB");
        const user = c.get("user");

        const workspaces = await (tablesDB as unknown as {
            listRows: (params: {
                databaseId: string;
                tableId: string;
                queries?: string[];
            }) => Promise<Models.DocumentList<Models.Document>>;
        }).listRows({
            databaseId: DATABASE_ID,
            tableId: WORKSPACES_ID,
            queries: [
                Query.equal("userId", user.$id),
                Query.orderDesc("$createdAt")
            ]
        });

        return c.json({ data: workspaces });
    })
    .post(
        "/",
        zValidator("form", createworkSpaceSchema),
        sessionMiddleware,
        async (c) => {
            const tablesDB = c.get("TablesDB");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");

            let uploadedImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile({
                    bucketId: IMAGES_BUCKET_ID,
                    fileId: ID.unique(),
                    file: image,
                });

                const arrayBuffer = await storage.getFilePreview({
                    bucketId: IMAGES_BUCKET_ID,
                    fileId: file.$id,
                });

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

          
            const workspace = await (tablesDB as unknown as {
                createRow: (params: {
                    databaseId: string;
                    tableId: string;
                    rowId: string;
                    data: Record<string, unknown>;
                }) => Promise<Models.Document>;
            }).createRow({
                databaseId: DATABASE_ID,
                tableId: WORKSPACES_ID,
                rowId: ID.unique(),
                data: {
                    name: name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                },
            });

            return c.json({ data: workspace });
        }
    );

export default app;
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query, Models } from "node-appwrite"; 

import { createworkSpaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";

import { MemberRole } from "@/features/auth/members/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
   .get("/", sessionMiddleware, async (c) => {
    const tablesDB = c.get("TablesDB");
    const user = c.get("user");

    // 1. Define the Table-specific response structure
    interface TableResponse<T> {
        rows: T[];
        total: number;
    }

    interface Member {
        $id: string;
        userId: string;
        workspaceId: string;
        role: string;
    }

    // 2. Fetch members using the TableResponse type
    const members = await (tablesDB as unknown as {
        listRows: (params: {
            databaseId: string;
            tableId: string;
            queries?: string[];
        }) => Promise<TableResponse<Member>>; // Use TableResponse here!
    }).listRows({
        databaseId: DATABASE_ID,
        tableId: MEMBERS_ID,
        queries: [
            Query.equal("userId", user.$id),
        ]
    });

    if (members.total === 0) {
        return c.json({ data: { rows: [], total: 0 } });
    }

    
    const workspaceIds = members.rows.map((member) => member.workspaceId);

    const workspaces = await (tablesDB as unknown as {
        listRows: (params: {
            databaseId: string;
            tableId: string;
            queries?: string[];
        }) => Promise<TableResponse<Models.Document>>; 
    }).listRows({
        databaseId: DATABASE_ID,
        tableId: WORKSPACES_ID,
        queries: [
            Query.orderDesc("$createdAt"),
            Query.contains("$id", workspaceIds),
        ],
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
                    inviteCode : generateInviteCode(6),
                },
            });

            await (tablesDB as unknown as {
                createRow: (params: {
                    databaseId: string;
                    tableId: string;
                    rowId: string;
                    data: Record<string, unknown>;
                }) => Promise<Models.Document>;
            }).createRow({
                databaseId: DATABASE_ID,
                tableId: MEMBERS_ID,
                rowId: ID.unique(),
                data: {
                    userId: user.$id,
                    workspaceId : workspace.$id,
                    role: MemberRole.ADMIN
                },
            });

            return c.json({ data: workspace });
        }
    );

export default app;
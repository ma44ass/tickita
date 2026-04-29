import {useQuery} from "@tanstack/react-query";
import {client} from "@/lib/rpc";

interface Workspace {
    $id: string;
    name: string;
    userId: string;
    imageUrl?: string;
}

// 2. Define the structure of your 1.8.8 helper response
interface WorkspacesResponse {
    rows: Workspace[];
    total: number;
}

export const useGetWorkspaces = () => {
    const query = useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await client.api.workspaces.$get();

            if(!response.ok){
               throw new Error("Failed to fetch workspaces");
            }

            const {data} = await response.json();
            
            return (data as unknown) as WorkspacesResponse;;
        },
    });

    return query;
};
import { useQuery } from "@tanstack/react-query";
import { Advocate, ApiResponse } from "@/types";

const queryKey = {
    advocates: "advocates"
}

export const useFetchAdvocates = () => {
    return useQuery<Advocate[]>({
        queryKey: [queryKey.advocates], 
        queryFn: async () => {
            try {
                const response = await fetch("/api/advocates");
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json() as ApiResponse<Advocate[]>;
                
                if (data.error) {
                    throw new Error(data.error);
                }
                
                return data.data || [];
            } catch (error) {
                console.error("Error fetching advocates:", error);
                throw error;
            }
        }
    });
};
import "server-only";
import createClient from "@/supabase/clients/server";
import { Json, TablesUpdate } from "@/supabase/types/database.types";


export async function updateRoom(id: number, data: TablesUpdate<"rooms">) {
    const supabase = await createClient();
    const res = await supabase
        .from("rooms")
        .update(data)
        .eq("id", id)
        .select()
        .single()

    if (res.error) console.error(res.error);
    return res
}
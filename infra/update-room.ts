import "server-only";
import createClient from "@/supabase/clients/server";
import { Json, TablesUpdate } from "@/supabase/types/database.types";


export async function updateRoom(data: TablesUpdate<"rooms">) {
    const supabase = createClient();
    const res = await supabase
        .from("rooms")
        .update(data)
        .select()
        .single()

    if (res.error) console.error(res.error);
    return res
}
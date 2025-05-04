import "server-only";
import createClient from "@/supabase/clients/server";

export async function getActivitySnapshot(roomId: number) {
    const supabase = await createClient();
    const res = await supabase
        .from("rooms")
        .select("activity_snapshot")
        .eq("id", roomId)
        .single();

    if (res.error) console.error(res.error);
    return res;
}
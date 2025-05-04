import "server-only";
import createClient from "@/supabase/clients/server";


export async function getRoomId(roomCode: string) {
    const supabase = await createClient();
    const res = await supabase
        .from("rooms")
        .select("id")
        .eq("room_code", roomCode)
        .eq("open", true)
        .single();

    if (res.error) console.error(res.error);
    return res;
}
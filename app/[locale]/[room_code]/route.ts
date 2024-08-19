import { redirect } from "@/app/_intl/intlNavigation";
import { fetchRoomCreator } from "@/app/api/_actions/room3";
import { fetchUser } from "@/app/api/_actions/user";

export async function GET(request: Request, { params }: { params: { room_code: string } }) {
    const { data, error: roomCreatorErr } = await fetchRoomCreator(params.room_code)
    const roomCreatorId = data?.created_by
    const {user, error} = await fetchUser()
    const isTeacher = roomCreatorId === user?.id

    if (isTeacher) {
        redirect(`/room/${params.room_code}`)
    } else {
        redirect(`/classroom/${params.room_code}`)
    }
}
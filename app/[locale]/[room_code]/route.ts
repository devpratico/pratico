import { redirect } from "@/app/_intl/intlNavigation";

export async function GET(request: Request, { params }: { params: { room_code: string } }) {
    redirect(`/room/${params.room_code}`)
}
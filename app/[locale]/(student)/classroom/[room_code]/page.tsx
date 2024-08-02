import StudentCanvas from './_components/StudentCanvas'
import { fetchUser, fetchNames } from '@/app/api/_actions/user'
import { redirect } from '@/app/_intl/intlNavigation'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchRoomByCode } from '@/app/api/_actions/room3'


export default async function StudentViewPage({ params }: { params: { room_code: string } }) {
    const { user, error } = await fetchUser()
    if (error) throw error
    if (!user) throw new Error('No user')

    const { first_name, last_name } = await fetchNames(user.id)

    if (!first_name || !last_name) {
        const nextUrl = `/classroom/${params.room_code}`
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString())
        return null
    }

    const canvasUser: CanvasUser = {
        id: user.id,
        name: `${first_name} ${last_name}`,
        color: getRandomColor(),
    }

    //const room = await fetchRoomByCode(params.room_code)
    //const snapshot = room?.capsule_snapshot || undefined

    const { data, error: roomError } = await fetchRoomByCode(params.room_code)
    if (roomError) throw roomError
    const snapshot = data?.capsule_snapshot || undefined as any

    return (
        <StudentCanvas user={canvasUser} snapshot={snapshot} />
    )
}
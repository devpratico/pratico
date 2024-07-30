import StudentCanvas from './_components/StudentCanvas'
import { fetchUser, fetchNames } from '@/app/api/_actions/user'
import { redirect } from '@/app/_intl/intlNavigation'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchRoomByCode } from '@/app/api/_actions/room3'
import { RoomProvider } from '@/app/_hooks/useRoom'
import { PresencesProvider } from '@/app/_hooks/usePresences'


// TODO: Simplify that mess? No need to use a server component to fetch data to pass to client components

export default async function StudentViewPage({ params }: { params: { room_code: string } }) {
    const userId = (await fetchUser()).id
    const { first_name, last_name } = await fetchNames(userId)

    if (!first_name || !last_name) {
        const nextUrl = `/classroom/${params.room_code}`
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString())
        return null
    }

    const user: CanvasUser = {
        id: userId,
        name: `${first_name} ${last_name}`,
        color: getRandomColor(),
    }

    const room = await fetchRoomByCode(params.room_code)
    const snapshot = room?.capsule_snapshot || undefined

    return (
        <main style={{ height: '100dvh', backgroundColor:'black' }}>
            <RoomProvider>
                <PresencesProvider>
                    <StudentCanvas user={user} snapshot={snapshot} />
                </PresencesProvider>
            </RoomProvider>
        </main>
    )
}
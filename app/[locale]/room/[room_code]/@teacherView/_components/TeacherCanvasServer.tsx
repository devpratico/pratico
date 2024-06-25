import TeacherCanvasClient from "./TeacherCanvasClient";
import { fetchUser, fetchNames } from '@/app/[locale]/_actions/user'
//import { redirect } from '@/app/_intl/intlNavigation'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { getRandomColor } from '@/app/_utils/codeGen'
import { fetchRoomByCode } from '../../_actions/actions'


interface TeacherCanvasServerProps {
    roomCode: string
}

export default async function TeacherCanvasServer({ roomCode }: TeacherCanvasServerProps) {

    const userId = (await fetchUser()).id
    const { first_name, last_name } = await fetchNames(userId)

    let name = `${first_name} ${last_name}`

    if (!first_name || !last_name) {
        /*
        const nextUrl = `/room/${params.room_code}`
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString())
        return null
        */
       name = 'Formateur'
    }



    const user: CanvasUser = {
        id: userId,
        name: name,
        //color: 'var(--brand)' // Doesn't work on first load, maybe because css variables are not loaded yet
        color:'#674ACF'
    }

    const room = await fetchRoomByCode(roomCode)
    const snapshot = room?.capsule_snapshot || undefined


    return <TeacherCanvasClient user={user} roomId={room.id} snapshot={snapshot} />
}
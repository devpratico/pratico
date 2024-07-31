import TeacherCanvasClient from "./TeacherCanvasClient";
import { fetchUser, fetchNames } from '@/app/api/_actions/user'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { fetchRoomByCode } from '@/app/api/_actions/room3'
import { Room } from "@/app/api/_actions/room2";
import { Suspense } from "react";
import logger from "@/app/_utils/logger";
import { Callout, Flex, Spinner } from "@radix-ui/themes";
import { TriangleAlert } from "lucide-react";


interface TeacherCanvasServerProps {
    roomCode: string
}

async function TeacherCanvasS({ roomCode }: TeacherCanvasServerProps) {
    const userId = (await fetchUser()).id
    const { first_name, last_name } = await fetchNames(userId)

    let name = `${first_name} ${last_name}`
    if (!first_name || !last_name) { name = 'Animateur' }
    const user: CanvasUser = { id: userId, name: name += ' ⭐️', color:'#674ACF'}

    
    let room: Room | undefined = undefined
    
    try {
         room = await fetchRoomByCode(roomCode)
    } catch (error) {
        logger.error('react:component', 'TeacherCanvasS', error)
    }

    if (!room) {
        return (
            <Flex align='center' justify='center' width='100%'>
                <Callout.Root variant='surface'>
                    <Callout.Icon>
                        <TriangleAlert />
                    </Callout.Icon>
                    <Callout.Text>
                        Pas de session en cours pour cette capsule
                    </Callout.Text>
                </Callout.Root>
            </Flex> 
        )
    }


    const snapshot = room?.capsule_snapshot || undefined

    return <TeacherCanvasClient user={user} roomId={room.id} snapshot={snapshot} />
}


export default function TeacherCanvas({ roomCode }: TeacherCanvasServerProps) {
    return (
        <Suspense fallback={
            <Flex align='center' justify='center' width='100%'>
                <Spinner />
            </Flex>
        }>
            <TeacherCanvasS roomCode={roomCode} />
        </Suspense>
    )
}
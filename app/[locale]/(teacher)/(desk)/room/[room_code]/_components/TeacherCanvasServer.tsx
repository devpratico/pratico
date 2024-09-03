import TeacherCanvasClient from "./TeacherCanvasClient";
import { fetchUser, fetchNames } from '@/app/api/_actions/user'
import { CanvasUser } from '@/app/[locale]/_components/canvases/Canvas'
import { fetchOpenRoomByCode, Room } from '@/app/api/_actions/room'
import { Suspense } from "react";
import logger from "@/app/_utils/logger";
import { Callout, Flex, Spinner } from "@radix-ui/themes";
import { TriangleAlert } from "lucide-react";
import { randomUUID } from "crypto";


interface TeacherCanvasServerProps {
    roomCode: string
}

async function TeacherCanvasS({ roomCode }: TeacherCanvasServerProps) {
    logger.log('react:component', 'Rendering server component', 'TeacherCanvasS')
    const { user, error } = await fetchUser()
    const { first_name, last_name } = user ? await fetchNames(user.id) : { first_name: null, last_name: null }

    let name = `${first_name} ${last_name}`
    if (!first_name || !last_name) { name = 'Animateur' }
    const canvasUser: CanvasUser = {
        id: user?.id || randomUUID() as string,
        name: name += ' ⭐️',
        color:'#674ACF'
    }

    
    let room: Room | undefined = undefined
    
    try {
        const { data, error: roomError } = await fetchOpenRoomByCode(roomCode)
        if (data) room = data as Room
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

    return <TeacherCanvasClient user={canvasUser} roomId={room.id} snapshot={snapshot} />
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
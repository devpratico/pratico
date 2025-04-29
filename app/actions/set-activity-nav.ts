"use server"
import { setActivityNav } from "@/core/application/set-activity-nav"
import { ServerActionRes } from "./utils"


export async function setActivityNavAction(prevState: ServerActionRes, formData: FormData): Promise<ServerActionRes> {
    const roomId = formData.get("roomId") as string
    const navigation = formData.get("navigation") as "animateur" | "libre"

    const { error } = await setActivityNav({
        roomId: Number(roomId),
        navigation,
    })

    if (error) {
        console.error(error)
        return { error }
    }

    return { error: null }
}
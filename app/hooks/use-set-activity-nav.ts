"use client"
import { setActivityNavAction } from "../actions/set-activity-nav"
import { useServerAction } from "./use-server-action"

function useSetActivityNav(roomId: number) {
    const [res, action, isPending] = useServerAction(setActivityNavAction)
    const formData = new FormData()
    formData.append("roomId", roomId.toString())

    const set = (navigation: "animateur" | "libre") => {
        formData.set("navigation", navigation)
        action(formData)
    }

    return { set, res, isPending }
}

export { useSetActivityNav }
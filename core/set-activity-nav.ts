import { getActivitySnapshot } from "@/infrastructure/get-activity-snapshot";
import { updateRoom } from "@/infrastructure/update-room";


async function setActivityNav(args: {
    roomId: number,
    navigation: "animateur" | "libre",
}): Promise<{error: Error | null}> {
    const { roomId, navigation } = args;

    const { data, error } = await getActivitySnapshot(roomId);
    if (error) {
        console.error(error);
        return { error };
    }

    const activitySnapshot = data.activity_snapshot as any // TODO: use zod
    if (!activitySnapshot) return { error: new Error("No activity snapshot found") };

    if (activitySnapshot.navigation === navigation) {
        console.warn("Navigation is already set to the desired value");
        return { error: null };
    }

    const updatedSnapshot = {
        ...activitySnapshot,
        navigation,
    };

    const { error: updateError } = await updateRoom({
        id: roomId,
        activity_snapshot: updatedSnapshot,
    });

    if (updateError) {
        console.error(updateError);
        return { error: updateError };
    }

    return { error: null };
}

export { setActivityNav };
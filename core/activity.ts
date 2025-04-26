import { fetchActivitySnapshot } from "@/infrastructure/fetch-activity-snapshot";
import { updateRoom } from "@/infrastructure/update-room";
import { PollSnapshot } from "@/domain/entities/activities/poll";
import { QuizSnapshot } from "@/domain/entities/activities/quiz";

export async function setNav(args: {
    roomId: number,
    navigation: "animateur" | "libre",
}): Promise<{error: Error | null}> {
    const { roomId, navigation } = args;

    const { data, error } = await fetchActivitySnapshot(roomId);
    if (error) {
        console.error(error);
        return { error };
    }

    const activitySnapshot = data.activity_snapshot as PollSnapshot | QuizSnapshot;
    if (!activitySnapshot) return { error: new Error("No activity snapshot found") };

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
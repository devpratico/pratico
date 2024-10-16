import { FullscreenProvider } from "@/app/(frontend)/_hooks/useFullscreen";
import ActivityCard from "./_components/ActivityCard";
import TeacherCanvas from "./_components/TeacherCanvasServer";
import TeacherScreenView from "./_components/TeacherScreenView";


export default function Page({ params: { room_code } }: { params: { room_code: string } }) {

    return (
        <>
				<TeacherScreenView room_code={room_code} />		
				<TeacherCanvas roomCode={room_code} />

				{/* Activity Card, that automatically opens when an activity is running */}
				<ActivityCard />
		
        </>
    )
}
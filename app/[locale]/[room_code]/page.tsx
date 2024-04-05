import CanvasST from "@/app/_components/desk/CanvasST/CanvasST";
import TLToolbar from "@/app/_components/desk/custom-ui/TLToolbar/TLToolbar";
import DeskLayout from "@/app/_components/layouts/DeskLayout/DeskLayout";


// TODO: use intercepting routes or something to handle if the connected user is the owner of the room

export default async function RoomPage() {
    return (
        <DeskLayout
            toolBar={<TLToolbar />}
            canvas={<CanvasST />}
        />
    )
}
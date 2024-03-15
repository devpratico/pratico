'use server'
import CanvasST from "@/components/desk/CanvasST/CanvasST";
import TLToolbar from "@/components/desk/custom-ui/TLToolbar/TLToolbar";
import DeskLayout from "@/components/layouts/DeskLayout/DeskLayout";


// TODO: use intercepting routes or something to handle if the connected user is the owner of the room

export default async function RoomPage() {
    return (
        <DeskLayout
            toolBar={<TLToolbar />} // Client component
            canvas={<CanvasST />}   // Client component
        />
    )

}
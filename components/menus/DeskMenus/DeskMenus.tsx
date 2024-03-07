import Participants from "../participants/Participants/Participants";

/**
 * This groups all the menus we need for the desk.
 * The menus are the dialogs that appear when you click on a button in the desk.
 * For example, clicking on the "participants" button will open a dialog with the list of participants.
 */
export default function DeskMenus() {
    return (
        <>
            <Participants />
        </>
    )
}
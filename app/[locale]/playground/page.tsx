import { formatDate } from "@/app/_utils/utils_functions";
import { AttendanceInfoType } from "../(teacher)/(dashboard)/reports/[room_id]/page";
import AttendanceToPDF from "../(teacher)/(dashboard)/reports/_components/AttendanceToPDF";

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
		
	const attendances: AttendanceInfoType[] = [{
		first_name: "Pierre-Louis",
		last_name: "Calvet Doublet de Persan de Bandeville",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "Edmond",
		last_name: "Dantès",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "Ryan",
		last_name: "Reynolds",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "Angele",
		last_name: "Van Laeken",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		last_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	}]
	return (<>
	
		<AttendanceToPDF attendances={attendances} sessionDate={(new Date()).toString()} capsuleTitle="Une capsule inexistante" user={{first_name: "Johanna", last_name: "Courtois"}}/>
	</>);
};
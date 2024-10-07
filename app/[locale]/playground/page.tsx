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
	},
	{
		first_name: "0Pierre-Louis",
		last_name: "Calvet Doublet de Persan de Bandeville",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "0Edmond",
		last_name: "Dantès",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "0Ryan",
		last_name: "Reynolds",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "0Angele",
		last_name: "Van Laeken",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "0AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		last_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "1Pierre-Louis",
		last_name: "Calvet Doublet de Persan de Bandeville",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "1Edmond",
		last_name: "Dantès",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "1Ryan",
		last_name: "Reynolds",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "1Angele",
		last_name: "Van Laeken",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "1AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		last_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "2Pierre-Louis",
		last_name: "Calvet Doublet de Persan de Bandeville",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "2Edmond",
		last_name: "Dantès",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "2Ryan",
		last_name: "Reynolds",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "2Angele",
		last_name: "Van Laeken",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "2AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		last_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "3Pierre-Louis",
		last_name: "Calvet Doublet de Persan de Bandeville",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "3Edmond",
		last_name: "Dantès",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "3Ryan",
		last_name: "Reynolds",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "3Angele",
		last_name: "Van Laeken",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	},
	{
		first_name: "3AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		last_name: "AnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellementAnticonsitutionnellement",
		connexion: formatDate(new Date().toString(), undefined, "hour")
	}]
	return (<>
	
		<AttendanceToPDF attendances={attendances} sessionDate={(new Date()).toString()} capsuleTitle="Une capsule inexistante" user={{first_name: "Johanna", last_name: "Courtois"}}/>
	</>);
};
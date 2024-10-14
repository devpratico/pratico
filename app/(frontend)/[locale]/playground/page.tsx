import AttendanceToPDF from "../(teacher)/(dashboard)/reports/_components/AttendanceToPDF";

export default async function PlayGround () {
	if (process.env.NODE_ENV === 'production') {
		return (null);
	}
	const date = new Date();
	const user = {
		first_name: "Earl",
		last_name: "Hickey",
		organization: {
			name: "The Comapny",
			address: "123 place du radeau, TREEEJHIK Cedex"
		}
	}
	const attendance = [{
		first_name: "Johanna",
		last_name: "Courtois",
		connexion: date.toDateString()
	}];

	return (<>
		<AttendanceToPDF attendances={attendance} sessionDate={date.toISOString()} capsuleTitle="Hola que tal ?" user={{userInfo: user, roomId: "1234"}}/>
	</>)
};
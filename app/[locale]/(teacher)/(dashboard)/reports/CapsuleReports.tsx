import Thumbnail from "@/app/[locale]/_components/Thumbnail";
import logger from "@/app/_utils/logger";
import { Box, Callout, Card, Heading, Inset, Text } from "@radix-ui/themes";
import { TLEditorSnapshot } from "tldraw";
import { CapsuleType } from "./page";
import { fetchAttendance } from "@/app/api/_actions/attendance";

export default async function CapsuleReports ({ capsule, userId }:{ capsule: CapsuleType, userId: string }) {

	const capsuleId = capsule.id;
	const title = capsule.title;
	// const created_at = new Date(capsule.created_at); ---> if we want to use it someday
	const snap = capsule.tld_snapshot?.[0] as TLEditorSnapshot | undefined;
	logger.debug("react:component", "CapsuleReports capsule:", capsule);

	return (
		<>
			{/* <Box maxWidth="240px"> */}
				<Card size="2">
					<Inset clip="padding-box" side="top" pb="current">
						<Thumbnail snapshot={snap} scale={0.07}/>
					{/* <img
						src={snapshot.toString()}
						alt="Bold typography"
						style={{
						display: 'block',
						objectFit: 'cover',
						width: '100%',
						height: 140,
						backgroundColor: 'var(--gray-5)',
						}}
					/> */}
					</Inset>
					<Heading>{title === 'Sans titre' ? 'Capsule sans titre' : title}</Heading>
					<Callout.Text size="3">
						Derniere session: 
						
					</Callout.Text>
				</Card>
				{/* </Box> */}
		</>
	);

};
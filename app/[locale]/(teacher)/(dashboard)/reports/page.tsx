import { Container, Section, Heading, Callout, Grid, Box, Link, ScrollArea } from '@radix-ui/themes';
import CapsuleReports from './_components/CapsuleReports';
import { fetchUser } from '@/app/api/_actions/user';
import { fetchCapsulesData } from '@/app/api/_actions/capsule';
import { Json } from '@/supabase/types/database.types';
import logger from '@/app/_utils/logger';

// TYPE
export type CapsuleType = {
	created_at: string;
	created_by: string | null;
	id: string;
	title: string | null;
	tld_snapshot: Json[] | null;
};

export default async function ReportsPage() {
	const { user, error } = await fetchUser();
	if (!user || error)
	{
		logger.error("next:page", "ReportsPage", !user ? "User not found" : `error: ${error}`);
		return (<></>);
	}
    let capsules: CapsuleType[] = [];
    if (user) {
        const { data, error } = await fetchCapsulesData(user.id);
        if (data) {
			capsules = data;
		}
    }
    return (
		<ScrollArea>
			<Section px={{ initial: '3', xs: '0' }}>
				<Container>
					<Heading as='h1'>Rapports</Heading>
					<Callout.Root mt='4'>
						<Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='3'>
							{
								(capsules.length)
								? capsules.map((cap, index) => {
									let url = `/reports/${cap.id}`
									return (
										<Box position='relative' key={index}>
											{/* <Link href={url} style={{ all: 'unset', cursor: 'pointer'}}> */}
												<CapsuleReports key={index} capsule={cap} userId={user?.id}/>
											{/* </Link> */}
										</Box>
									)
								})
								: <p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p>
							}
							</Grid>
					</Callout.Root>
				</Container>
			</Section>
		</ScrollArea>
    )
}
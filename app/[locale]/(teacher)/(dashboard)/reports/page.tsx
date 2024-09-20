import { Container, Section, Heading, Callout } from '@radix-ui/themes';
import CapsuleReports from './CapsuleReports';
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
        <Section px={{ initial: '3', xs: '0' }}>
            <Container>
                <Heading as='h1'>Rapports</Heading>
                <Callout.Root mt='4'>
                    {/* <p>Vous retrouverez ici des rapports détaillés concernant vos sessions.</p> */}
					{
						capsules.map((cap, index) => {
							return (
								<CapsuleReports key={index} capsule={cap} userId={user?.id}/>
							)
						})
					}
				</Callout.Root>
            </Container>
        </Section>
    )
}
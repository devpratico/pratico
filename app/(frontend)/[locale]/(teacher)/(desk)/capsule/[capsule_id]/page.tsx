import { Flex, Text, Tooltip, Box } from '@radix-ui/themes';
import Link from 'next/link';
import Image from 'next/image';
import TopBarPortal from '../../_components/TopBarPortal';
import MenuTabs from '../../_components/MenuTabs';
import { Puzzle, Ellipsis, FlaskRound, Play } from 'lucide-react';
import CapsuleTitle from '../../_components/CapsuleTitle';
import CanvasSL from './_components/CanvasSL';
import DoneBtn from './_components/DoneBtn';
import StartBtn from './_components/StartBtn';
import createClient from '@/supabase/clients/server';
import { fetchUser } from '@/app/(backend)/api/user/user.server';
import { redirect } from '@/app/(frontend)/_intl/intlNavigation';
import { StartSessionWarningAlert } from './_components/StartSessionWarningAlert';
import LinkButton from '@/app/(frontend)/[locale]/_components/LinkButton';
import { customerIsSubscribed } from '@/app/(backend)/api/stripe/stripe.server';



export default async function Page({ params: { capsule_id } }: { params: { capsule_id: string } }) {
    const logoScale = 0.25
    const supabase = createClient();

    const { user, error } = await fetchUser();
    if (!user || error)
        throw new Error("User not found");

    const { data } = await supabase.from("rooms").select("code").eq("created_by", user?.id).eq("capsule_id", capsule_id).eq("status", "open").order('created_at', { ascending: false }).limit(1);
    if (data && data.length > 0 && data[0].code)
        redirect(`/room/${data[0].code}`);

    const isSubscribed = await customerIsSubscribed(user?.id);

    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>


                    <Flex gap='5' display={{ initial: 'none', xs: 'flex' }} align='center'>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={420 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>


                        <StartSessionWarningAlert />
                        <CapsuleTitle capsuleId={capsule_id}/>

                    </Flex>

                    { !isSubscribed &&
                        <Box display={{ initial: 'none', md: 'block' }} >
                            <LinkButton
                                href='/subscribe'
                                color='amber'
                                //size='1'
                            >
                                    Débloquer la limite de 10 participants
                            </LinkButton>
                        </Box>
                    }

                    

                    <Flex gap='3' align='center' justify='between' width={{ initial: '100%', xs: 'auto' }}>

                        {/* MenuTabs for Desktop */}
                        <Box display={{ initial: 'none', xs: 'block' }}>
                            <MenuTabs tabs={[
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <Box width='100%' display={{ initial: 'block', xs: 'none' }}/>

                        {/* MenuTabs for Mobile - it has a Home tab and a smaller padding */}
                        <Box display={{ initial: 'block', xs: 'none' }}>
                            <MenuTabs padding='3px' tabs={[
                                { menu: undefined, label: 'Capsule', icon: <FlaskRound /> },
                                { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                                { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                            ]} />
                        </Box>

                        <DoneBtn message='terminer'/>

                    </Flex>

                </Flex>
            </TopBarPortal>

            <CanvasSL />
        </>
    )
}
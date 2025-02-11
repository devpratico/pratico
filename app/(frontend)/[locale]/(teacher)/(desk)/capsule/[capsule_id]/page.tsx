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
import { WarningDialog } from './_components/warningDialog';



export default async function Page({ params: { capsule_id } }: { params: { capsule_id: string } }) {
    const logoScale = 0.25
    const supabase = createClient();
    const dialog = {
        title: "Vous avez lancer une session",
        description: `Toutes les modifications effectuées pendant la session seront effacées\
            quand vous y mettrez fin et vous retrouverez votre capsule originale
            Vous pourrez néanmoins télécharger la capsule modifiée en pdf pendant la session ou\
            dans vos rapports de session`
    }
    const { user, error } = await fetchUser();
    if (!user || error)
        throw new Error("User not found");

    const { data } = await supabase.from("rooms").select("code").eq("created_by", user?.id).eq("capsule_id", capsule_id).eq("status", "open").order('created_at', { ascending: false }).limit(1);
    if (data && data.length > 0 && data[0].code)
        redirect(`/room/${data[0].code}`);

    return (
        <>
            <TopBarPortal>
                <Flex justify={{ initial: 'center', xs: 'between' }} align='center'>


                    <Flex gap='5' display={{ initial: 'none', xs: 'flex' }}>
                        <Link href='/capsules' style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip content={<Text size='2'>Accueil</Text>} side='bottom' style={{ padding: '0.5rem' }}>
                                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
                            </Tooltip>
                        </Link>

                        <CapsuleTitle capsuleId={capsule_id}/>

                        <WarningDialog
                            message={<><Play size={15} strokeWidth='3' />lancer la session</>}
                            title={dialog.title}
                            description={dialog.description}
                            buttonAction={<StartBtn message="continuer" />}
                        />
                        {/* <StartBtn message='lancer la session'/> */}

                    </Flex>

                    

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
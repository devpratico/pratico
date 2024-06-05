import Image from 'next/image';
import { Flex, Box } from "@radix-ui/themes";
import CapsuleTitle from '../CapsuleTitle/CapsuleTitle';
import StartBtn from './buttons/StartBtn';
import MenuBtn from '@/app/[locale]/room/[room_code]/@teacherView/_components/MenuBtn';
import { Puzzle, Ellipsis } from 'lucide-react';
import { isUserAnonymous } from '@/app/[locale]/login/_actions/actions';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';
import DoneBtn from './buttons/DoneBtn';
import FeedbackBtn from './buttons/FeedbackBtn';
import { Link } from '@/app/_intl/intlNavigation';


export default async function CreationMenuBar() {

    const isAnonymous = await isUserAnonymous()
    const logoScale = 0.25

    return (
        <Flex align='center' p='3' gap='5' height='60px' style={{ backgroundColor: 'var(--brand)' }}>

            <Link href='/capsules' style={{display: 'flex', alignItems: 'center'}}>
                <Image src='/images/logo.png' width={386 * logoScale} height={105 * logoScale} alt="Pratico" />
            </Link>

            <CapsuleTitle />
            <StartBtn message='Lancer la session'/>

            <Box flexGrow='1' />

            <MenuBtn menu='polls' message={'activités'}><Puzzle /></MenuBtn>
            <MenuBtn menu='more' message={'plus'}><Ellipsis /></MenuBtn>
            <DoneBtn message='terminé'/>
            <FeedbackBtn />

            {isAnonymous && <LoginBtn message="Se connecter" />}
        </Flex>

    )
}
import Image from 'next/image';
import praticoLogo from '@/public/images/pratico.svg';
import { Flex, Box } from "@radix-ui/themes";
import CapsuleTitle from '../CapsuleTitle/CapsuleTitle';
import StartBtn from './buttons/StartBtn';
import MenuBtn from '@/app/[locale]/room/[room_code]/@teacherView/_components/MenuBtn';
import { Puzzle, Ellipsis } from 'lucide-react';
import { isUserAnonymous } from '@/app/[locale]/room/[room_code]/@teacherView/_actions/actions';
import LoginBtn from '@/app/[locale]/_components/LoginBtn';
import DoneBtn from './buttons/DoneBtn';


export default async function CreationMenuBar() {

    const isAnonymous = await isUserAnonymous()

    return (
        <Flex align='center' p='3' gap='5' height='60px' style={{ backgroundColor: 'var(--brand)' }}>
            <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
            <CapsuleTitle />
            <StartBtn message='Lancer la session'/>

            <Box flexGrow='1' />

            <MenuBtn menu='polls' message={'activités'}><Puzzle /></MenuBtn>
            <MenuBtn menu='more' message={'plus'}><Ellipsis /></MenuBtn>
            <DoneBtn message='terminé'/>

            {isAnonymous && <LoginBtn message="Se connecter" />}
        </Flex>

    )
}
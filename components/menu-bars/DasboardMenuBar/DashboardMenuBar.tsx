import Image from 'next/image';
import MenuBarLayout from '../components/MenuBarLayout/MenuBarLayout';
import UserInfo from '../components/UserInfo/UserInfo';
import praticoLogo from '../../../public/images/pratico.svg';


export default function DashboardMenuBar() {
    return (
        <MenuBarLayout spacerPosition={1}>
            <Image src={praticoLogo} width={100} height={50} alt="Pratico" />
            <UserInfo/>
        </MenuBarLayout>
    )
}
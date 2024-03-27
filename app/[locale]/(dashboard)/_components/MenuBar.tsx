import Image from 'next/image';
import praticoLogo from '../../../../public/images/pratico.svg';
import UserInfo from '@/app/[locale]/(dashboard)/_components/UserInfo';


interface MenuBarProps extends React.HTMLAttributes<HTMLDivElement> {}


export default function MenuBar({ ...props }: MenuBarProps) {

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: 'var(--primary)',
        height: '60px',
        ...props.style,
    };

    const imageContainerStyle: React.CSSProperties = {
        width: '100px',
        height: '100%',
        position: 'relative',
    };


    return (
        <div style={containerStyle}>
            <div style={imageContainerStyle}>
                <Image src={praticoLogo} objectFit='contain' fill alt="Pratico" />
            </div>
            <UserInfo/>
        </div>    
    )
}






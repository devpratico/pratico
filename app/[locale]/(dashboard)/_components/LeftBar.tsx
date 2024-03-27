'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Gamepad2, NotepadText, CircleHelp, Cog } from 'lucide-react';



interface DashboardLeftBarProps extends React.HTMLAttributes<HTMLDivElement> {
    messages: {
        'capsules': string;
        'activities': string;
        'reports': string;
        'help': string;
        'settings': string;
    }
}


export default function LeftBar({ messages, ...props }: DashboardLeftBarProps) {
    let pathname = usePathname();
    pathname = pathname.replace(/\/[a-z]{2}/, ''); // Remove locale from pathname

    const containerStyle: React.CSSProperties = {
        backgroundColor: 'var(--background)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '0.5rem',
        borderRadius: '1rem',
        ...props.style,
    };


    const buttonStyle: React.CSSProperties = {
        textDecoration: 'none',
        padding: '0.8rem 1rem',
        color: 'var(--primary)',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    };

    const activeButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'var(--secondary)',
    };


    return (
        <div style={containerStyle}>
            <Link href="/capsules" style={pathname === '/capsules' ? activeButtonStyle : buttonStyle}>
                <Rocket size={24} style={{marginRight: '0.5rem'}}/>
                {messages['capsules']}
            </Link>

            <Link href="/capsules" style={pathname === '/' ? activeButtonStyle : buttonStyle}>
                <Gamepad2 size={24} style={{marginRight: '0.5rem'}}/>
                {messages['activities']}
            </Link>

            <Link href="/capsules" style={pathname === '/' ? activeButtonStyle : buttonStyle}>
                <NotepadText size={24} style={{marginRight: '0.5rem'}}/>
                {messages['reports']}
            </Link>

            <div style={{flex: 1}}></div>

            <Link href="/capsules" style={pathname === '/' ? activeButtonStyle : buttonStyle}>
                <CircleHelp size={24} style={{marginRight: '0.5rem'}}/>
                {messages['help']}
            </Link>

            <Link href="/settings" style={pathname === '/settings' ? activeButtonStyle : buttonStyle}>
                <Cog size={24} style={{marginRight: '0.5rem'}}/>
                {messages['settings']}
            </Link>
        </div>
    )
}
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Rocket, Puzzle, NotepadText, Cog, BookOpen, FlaskRound } from 'lucide-react';



interface DashboardLeftBarProps extends React.HTMLAttributes<HTMLDivElement> {
    messages: {
        'capsules': string;
        'activities': string;
        'reports': string;
        'resources': string;
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
        <nav style={containerStyle}>
            <Link href="/capsules" style={pathname === '/capsules' ? activeButtonStyle : buttonStyle}>
                <FlaskRound size={24} style={{marginRight: '0.5rem'}}/>
                {messages['capsules']}
            </Link>

            <Link href="/activities" style={pathname === '/activities' ? activeButtonStyle : buttonStyle}>
                <Puzzle size={24} style={{marginRight: '0.5rem'}}/>
                {messages['activities']}
            </Link>

            <Link href="/reports" style={pathname === '/reports' ? activeButtonStyle : buttonStyle}>
                <NotepadText size={24} style={{marginRight: '0.5rem'}}/>
                {messages['reports']}
            </Link>

            <div style={{flex: 1}}></div>

            <Link href="/resources" style={pathname === '/resources' ? activeButtonStyle : buttonStyle}>
                <BookOpen size={24} style={{marginRight: '0.5rem'}}/>
                {messages['resources']}
            </Link>

            <Link href="/settings" style={pathname === '/settings' ? activeButtonStyle : buttonStyle}>
                <Cog size={24} style={{marginRight: '0.5rem'}}/>
                {messages['settings']}
            </Link>
        </nav>
    )
}
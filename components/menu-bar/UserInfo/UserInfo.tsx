'use client'
import styles from './UserInfo.module.css';
import { useAuth } from "@/contexts/AuthContext";
import { useUi } from "@/contexts/UiContext";
import Avatar from "@/components/primitives/Avatar/Avatar";
import Link from 'next/link';


export default function UserInfo() {
    const { setAuthDialogOpen } = useUi();
    const { user, isUserLoading, signOut } = useAuth();
    const userEmail = user?.email
    const avatarLetters = userEmail?.substring(0, 2).toUpperCase() || "TD";
    
    const _signOut = async () => {
        signOut();
        setAuthDialogOpen(true);
    }

    const LoadingIndicator = () => <p>Loading...</p>
    const SignInButton = () => <button onClick={() => setAuthDialogOpen(true)}>Sign in</button>
    const AvatarEmail = () => {
        return (
            <Link href="/account" className={styles.avatarEmailContainer}>
                <p className={styles.email}>{userEmail}</p>
                <Avatar size={40} alt={avatarLetters} />
            </Link>
        )
    }

    return (
        <div>
            {isUserLoading ? <LoadingIndicator /> : userEmail ? <AvatarEmail /> : <SignInButton />}
        </div>
    )
}
'use client'
import { useAuth } from "@/contexts/AuthContext";
import { useUi } from "@/contexts/UiContext";


export default function UserInfo() {
    const { user, isUserLoading, signOut } = useAuth();
    const userEmail = user?.email
    const { setAuthDialogOpen } = useUi();

    const _signOut = async () => {
        signOut();
        setAuthDialogOpen(true);
    }

    return (
        <div>
            {isUserLoading ?
                <p>Loading...</p>
                :
                userEmail ?
                    <span>
                        <p>{userEmail}</p> <button onClick={_signOut}>Sign out</button>
                    </span>
                    :
                    <button onClick={() => setAuthDialogOpen(true)}>Sign in</button>
            }
        </div>
    )
}
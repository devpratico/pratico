'use client'
import { useAuth } from "@/contexts/AuthContext";


export default function UserInfo() {
    const { user, isUserLoading, signOut } = useAuth();
    const userEmail = user?.email

    return (
        <div>
            {isUserLoading ?
                <p>Loading...</p>
                :
                userEmail ?
                    <div>
                        <p>{userEmail}</p> <button onClick={signOut}>Sign out</button>
                    </div>
                    :
                    <p>No user</p>
            }
        </div>
    )
}
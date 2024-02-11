import { getUser, getProfile } from '@/supabase/services/user';

export default async function AccountPage() {

    const { data, error } = await getUser()
    if (error || !data?.user) {
        //redirect('/')
        return <p>error</p>
    }
    const user = data.user

    const { data: profileData, error: profileError } = await getProfile(user.id)
    console.log("🤖",profileData)


    return (
        <div>
            <h1>Account</h1>
            <p>{"email: " + user?.email}</p>
            <p>{"id: " + user?.id}</p>
            {/*<button onClick={() => {signOut();  setAuthDialogOpen(true)}}>Logout</button>*/}
        </div>
    )
}
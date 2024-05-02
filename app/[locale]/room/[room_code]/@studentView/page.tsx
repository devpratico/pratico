import StudentCanvas from './_components/StudentCanvas'
import { fetchUser, fetchNames } from '@/app/[locale]/_actions/user'
import { redirect } from '@/app/_intl/intlNavigation'


export default async function StudentViewPage({ params }: { params: { room_code: string } }) {
    const userId = (await fetchUser()).id
    const { first_name, last_name } = await fetchNames(userId)

    if (!first_name || !last_name) {
        const nextUrl = `/room/${params.room_code}`
        redirect('/form?' + new URLSearchParams({ nextUrl }).toString())
        return null
    }

    return (
        <main style={{ height: '100dvh' }}>
            <StudentCanvas />
        </main>
    )
}
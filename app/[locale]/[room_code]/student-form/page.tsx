'use client'
import StudentForm from "@/components/auth/StudentForm/StudentForm"
import { getUserPreferences,  setUserPreferences } from '@tldraw/tldraw'
import { useRouter } from "next/navigation"


export default function StudentFormPage({ params }: { params: { room_code: string } }) {

    const router = useRouter()

    const onSubmit = (firstName: string, lastName: string) => {
        const userPref = getUserPreferences()
        userPref.name = firstName + " " + lastName
        setUserPreferences(userPref)
        router.push(`/${params.room_code}`)
    }

    return <StudentForm onSubmit={onSubmit} />
}
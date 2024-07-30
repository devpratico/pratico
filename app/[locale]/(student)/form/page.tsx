import StudentForm from "./_components/StudentForm"
import { Flex, Card } from "@radix-ui/themes"
import { Viewport } from "next"

export const viewport: Viewport = {
    themeColor: 'black',
    maximumScale: 1,
    userScalable: false,
}

export default function formPage() {
    return (
        <main style={{ height: '100dvh' }}>
            <Flex align='center' justify='center' style={{ height: '100%' }}>
                <Card size='5'>
                    <StudentForm />
                </Card>
            </Flex>
        </main>
    )
}
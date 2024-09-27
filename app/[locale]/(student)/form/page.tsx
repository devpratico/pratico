import StudentForm from "./_components/StudentForm"
import { Flex, Card, Heading, Separator } from "@radix-ui/themes"
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
					<Flex align='center' justify='center' style={{ height: '100%' }}>
						<Heading size='5'>Bienvenue !</Heading>
					</Flex>
					<Flex align='center' justify='center' style={{ height: '100%' }}>
						<Separator size='3' my='4' />
					</Flex>
                    <StudentForm />
                </Card>
            </Flex>
        </main>
    )
}
import { Section, Button, Flex, Heading, Callout } from '@radix-ui/themes'
import {  ChevronRight, Star, Clock} from 'lucide-react'
import RecentActivities from './RecentActivities'
import CreateActivityBtn from './CreateActivityBtn'


export default function ActivitiesMenu() {
    return (
        <>
            <Section size='1'>
                <CreateActivityBtn />
            </Section>

            <Section size='1'>

                <Heading size='3' trim='end' mb='2'>Mes activités</Heading>

                <Flex direction='column' gap='2'>

                    <Button variant='soft' >
                        <Flex justify='between' align='center' gap='2' width='100%'>
                            Quiz<ChevronRight/>
                        </Flex>
                    </Button>

                    <Button variant='soft' >
                        <Flex justify='between' align='center' gap='2' width='100%'>
                            Sondages<ChevronRight />
                        </Flex>
                    </Button>
                    
                </Flex>
            </Section>
            

            <Section size='1'>
                <Flex align='center' gap='2' mb='2'>
                    <Star size={18}/><Heading size='3' trim='end'>Favoris</Heading>
                </Flex>
                <Callout.Root color='gray'>
                    <Callout.Text>Aucun favori</Callout.Text>
                </Callout.Root>
            </Section>


            <Section size='1'>
                <Flex align='center' gap='2' mb='2'>
                    <Clock size={18}/><Heading size='3' trim='end'>Récents</Heading>
                </Flex>
                <RecentActivities />
            </Section>

        </>
    )
}























import { Section, Button, Flex, Heading, Callout, VisuallyHidden, Dialog } from '@radix-ui/themes'
import {  ChevronRight, Star, Clock} from 'lucide-react'
import SearchParamLink from '../../SearchParamLink'
import CreateActivityBtn from './CreateActivityBtn'
import ActivitiesTable from './ActivitiesTable'


export default function ActivitiesMenu() {
    return (
        <>
            <VisuallyHidden>
                <Dialog.Title>Activités</Dialog.Title>
                <Dialog.Description>Créer, modifier et consulter les activités</Dialog.Description>
            </VisuallyHidden>

            <Section size='1'>
                <CreateActivityBtn />
            </Section>

            <Section size='1'>

                <Heading size='3' trim='end' mb='2'>Mes activités</Heading>

                <Flex direction='column' gap='2'>

                    <SearchParamLink name='menu' value='quizes'>
                        <Button variant='soft' asChild>
                            <Flex justify='between' align='center' gap='2' width='100%'>
                                Quiz <ChevronRight/>
                            </Flex>
                        </Button>
                    </SearchParamLink>

                    <SearchParamLink name='menu' value='polls'>
                        <Button variant='soft' asChild>
                            <Flex justify='between' align='center' gap='2' width='100%'>
                                Sondages <ChevronRight />
                            </Flex>
                        </Button>
                    </SearchParamLink>
                    
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
                <ActivitiesTable showMax={5} noneMessage='Aucune activité récente' />
            </Section>

        </>
    )
}






















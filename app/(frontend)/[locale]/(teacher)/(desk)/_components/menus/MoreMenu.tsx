'use client'
import { Section, Flex, VisuallyHidden, Text } from '@radix-ui/themes'
import * as DialogPrimitive from '@radix-ui/react-dialog';
import StartBtn from '../../capsule/[capsule_id]/_components/StartBtn'
import StopBtn from '../../room/[room_code]/_components/StopBtn'
import { useParams } from 'next/navigation'
import { useNav } from '@/app/(frontend)/_hooks/contexts/useNav';
import { CapsuleToPdfDialog } from '../../capsule/[capsule_id]/_components/CapsuleToPdfDialog';
import { BookOpen, ExternalLink } from 'lucide-react';
import LinkButton from '@/app/(frontend)/[locale]/_components/LinkButton';

/**
 * Content of the 'More' menu that only shows on 'creation' phase (not during session)
 */
function CreationMenu() {
    return (
        <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
            <StartBtn message='Lancer la session' variant='solid' />
        </Flex>
    )
}


/**
 * Content of the 'More' menu that only hsows during the session
 */
function AnimationMenu() {
    return (
        <Flex display={{ initial: 'flex', xs: 'none' }} justify='center'>
            <StopBtn message='Arrêter la session' variant='solid' />
        </Flex>
    )
}


export default function MoreMenu() {
    const params = useParams()
    const isRoom = params.room_code !== undefined
	const { capsule_id } = useParams();
	const { pageIds } = useNav();
    return (
        <>
            <VisuallyHidden>
                <DialogPrimitive.Title>Plus</DialogPrimitive.Title>
                <DialogPrimitive.Description>{`Plus d'options`}</DialogPrimitive.Description>
            </VisuallyHidden>
            <Section size='1'>

				<Flex direction='column' gap='2'>
					{isRoom ? <AnimationMenu /> : <CreationMenu />}
					{
						pageIds && pageIds.length > 0
						? <CapsuleToPdfDialog capsuleId={capsule_id as string} isRoom={isRoom} />
						: <></>
					}
		
					<LinkButton style={{ width: "100%" }} variant="soft" href="https://www.pratico.live/resources" target="_blank" rel="noopener noreferrer">
						<Flex align='center' gap='2'>
							<BookOpen size='21' />
							<Text>Ressources</Text>
							<ExternalLink style={{opacity: "50%"}} size="21" />
						</Flex>
					</LinkButton>

					{/* <Box mt="9" display={{ initial: 'none', xs: 'block' }}>
						<Callout.Root variant='outline'>
							<Callout.Text>
								{`Ici, bientôt, vous retrouverez plus d'options !`}
							</Callout.Text>
						</Callout.Root>
					</Box> */}
				</Flex>

            </Section>
        </>
    )
}
import { getTranslations } from 'next-intl/server';
import { fetchUser } from '../../_actions/user';
import { fetchCapsulesData } from './actions';
import { Section, Heading, Grid, Card, Flex, Text, AspectRatio } from '@radix-ui/themes';
import CreateCapsuleBtn from './_components/CreateCapsuleBtn';
import { Link } from '@/app/_intl/intlNavigation';
import Thumbnail from '../../_components/Thumbnail';
import { TLStoreSnapshot } from 'tldraw';


export const revalidate = 0

export default async function CapsulesPage() {
    const t = await getTranslations("dashboard")
    const userId = (await fetchUser()).id;
    const capsules = await fetchCapsulesData(userId);
    
    return (
        <main style={{padding: '2rem'}}>
            <Section>
                <Heading as='h1'>{t('capsules')}</Heading>

                <CreateCapsuleBtn message={t('create')} />

                <Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='5'>
                    {capsules.map((cap) => {
                        const id = cap.id
                        const title = cap.title || t('untitled')
                        const created_at = new Date(cap.created_at)
                        const snap = cap.tld_snapshot?.[0] as TLStoreSnapshot | undefined

                        let url = `/capsule/${id}`

                        return (
                            <Link href={url} key={id} style={{all:'unset'}}>
                                <Miniature title={title} createdAt={created_at}>
                                    {snap &&  <Thumbnail snapshot={snap} scale={0.2} />}
                                </Miniature>
                            </Link>
                        )
                    })}

                </Grid>

            </Section>
        </main>
    )
}



interface MiniatureProps {
    title?: string;
    createdAt?: Date;
    children?: React.ReactNode;
}


function Miniature({ title, createdAt, children }: MiniatureProps) {
    return (
        <Flex direction='column' gap='1'>
            <Card>
                <AspectRatio ratio={16 / 9}>
                    {children}
                </AspectRatio>
            </Card>
            <Heading as='h2' size='3'>{title}</Heading>
            <Text size='1'>{createdAt?.toLocaleDateString()}</Text>
        </Flex>
    )
}


/*
<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <IconButton radius='full' size='1' variant='soft' style={{ position: 'absolute', top: '0', right: '0', margin: '5px' }}>
            <Ellipsis size='18' />
        </IconButton>
    </DropdownMenu.Trigger>

    <DropdownMenu.Content>

        <DropdownMenu.Item disabled>
            <TextCursor size='13' />
            Renommer
        </DropdownMenu.Item>

        <DropdownMenu.Item disabled>
            <Copy size='13' />
            Dupliquer
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item color='red' disabled>
            <Trash2 size='13' />
            Supprimer
        </DropdownMenu.Item>

    </DropdownMenu.Content>
</DropdownMenu.Root>
*/
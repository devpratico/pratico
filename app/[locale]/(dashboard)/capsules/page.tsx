import { getTranslations } from 'next-intl/server';
import { fetchUser } from '../../_actions/user';
import { fetchCapsulesData } from './actions';
import { Heading, Grid, Card, Flex, Text, AspectRatio, Callout } from '@radix-ui/themes';
import CreateCapsuleBtn from './_components/CreateCapsuleBtn';
import { Link } from '@/app/_intl/intlNavigation';
import Thumbnail from '../../_components/Thumbnail';
import { TLStoreSnapshot } from 'tldraw';
import Menu from './_components/Menu';
import { Telescope } from 'lucide-react';



export const revalidate = 0

export default async function CapsulesPage() {
    const t = await getTranslations("dashboard")
    const userId = (await fetchUser()).id;
    const capsules = await fetchCapsulesData(userId);
    
    return (
        <main style={{padding: '2rem'}}>
            <Heading as='h1'>{t('capsules')}</Heading>

            <CreateCapsuleBtn message={t('create')} />

            {capsules.length === 0 &&
                <Callout.Root>
                    <Callout.Icon>
                        <Telescope />
                    </Callout.Icon>
                    <Callout.Text>
                        Aucune capsule trouvée. Créez-en une pour commencer !
                    </Callout.Text>
                </Callout.Root>
            }

            <Grid columns='repeat(auto-fill, minmax(200px, 1fr))' gap='5'>
                {capsules.map((cap) => {
                    const id = cap.id
                    const title = cap.title || t('untitled')
                    const created_at = new Date(cap.created_at)
                    const snap = cap.tld_snapshot?.[0] as TLStoreSnapshot | undefined

                    let url = `/capsule/${id}`

                    return (
                        <Link href={url} key={id} style={{all:'unset', position:'relative'}}>
                            <Miniature title={title} createdAt={created_at}>
                                {snap &&  <Thumbnail snapshot={snap} scale={0.2} />}
                            </Miniature>
                            <Menu capsuleId={id} />
                        </Link>
                    )
                })}

            </Grid>
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




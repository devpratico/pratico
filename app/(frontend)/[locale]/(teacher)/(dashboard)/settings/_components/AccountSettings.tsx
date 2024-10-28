import { Button, Callout, Flex, Link, Separator } from '@radix-ui/themes';
import { TriangleAlert } from 'lucide-react';
import { SignOutBtn } from './SignOutBtn';
import StripeSettings from './StripeSettings';
import { getUser } from '@/app/(backend)/api/auth/auth.server';


/** The AccountSettings component's state consists of which components should be displayed */
type State = Set<'Plans' | 'AccountManagement' | 'AnonWarning' | 'NoUserWarning'>

/** Depending on the user's data, returns the components that should be displayed */
async function getState({mock}: {mock?: boolean} = {}): Promise<State> {
    if (mock) return new Set(['Plans', 'AccountManagement', 'AnonWarning', 'NoUserWarning']) as State

    const { data: { user } } = await getUser()

    if (!user) return new Set(['NoUserWarning']) as State

    if (user.is_anonymous) return new Set(['AnonWarning']) as State

    return new Set(['Plans', 'AccountManagement']) as State
}


function NoUserWarning() {
    return (
        <Callout.Root color='red' variant='outline'>
            <Callout.Icon><TriangleAlert size={15} /></Callout.Icon>
            <Callout.Text>
                <span>Vous n&apos;êtes pas connecté. Pour profiter pleinement de Pratico,&nbsp;
                    <Link href='/auth?authTab=login'>connectez-vous</Link>
                    &nbsp;ou&nbsp;
                    <Link href='/auth?authTab=signup'>créez un compte</Link>.
                </span>
            </Callout.Text>
        </Callout.Root>
    )
}

function AnonWarning() {
    return (
        <Callout.Root color='gray' variant='outline'>
            <Callout.Icon><TriangleAlert size={15} /></Callout.Icon>
            <Callout.Text>
                <span>Vous êtes actuellement connecté avec une session anonyme.
                    Vos données ne sont pas sauvegardées. Pour profiter pleinement de Pratico,&nbsp;
                    <Link href='/auth?authTab=login'>connectez-vous</Link>
                    &nbsp;ou&nbsp;
                    <Link href='/auth?authTab=signup'>créez un compte</Link>.
                </span>
            </Callout.Text>
        </Callout.Root>
    )
}

function AccountManagement() {
    return (
        <Flex gap='4' wrap='wrap'>
            <Button disabled>Changer son mot de passe</Button>
            <SignOutBtn message={"Se déconnecter"} />
        </Flex>
    )
}


export default async function AccountSettings() {
    const state = await getState()

    return (
        <Flex gap='9' direction='column'>
            {state.has('NoUserWarning') && <NoUserWarning />}
            {state.has('AnonWarning') && <AnonWarning />}
            {state.has('Plans') && <StripeSettings />}
            {state.has('AccountManagement') && <AccountManagement />}
        </Flex>
    )
}
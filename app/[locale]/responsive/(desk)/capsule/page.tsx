import MenuTabs from "../_components/MenuTabs"
import { Flex } from "@radix-ui/themes"
import TopBarPortal from "../_components/TopBarPortal"
import { Puzzle, Ellipsis } from 'lucide-react';


export default function Page() {
    return (
        <>
            <TopBarPortal>
                <Flex justify='between' align='center'>
                    <p>CapsuleTopBar</p>
                    <MenuTabs tabs={[
                        { menu: 'activities', label: 'Activités', icon: <Puzzle /> },
                        { menu: 'more', label: 'Plus', icon: <Ellipsis /> }
                    ]} />
                </Flex>
            </TopBarPortal>

            <p>Desk Capsule (création)</p>
        </>
    )
}
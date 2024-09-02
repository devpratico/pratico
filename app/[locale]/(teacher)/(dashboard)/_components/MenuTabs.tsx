/**
 * This component is a tab navigation for the menu.
 * The current menu is stored in the URL query parameter 'menu'.
 * For example, 'pratico.io/capsule/123?menu=activities' will display the 'activities' menu.
 * When no query parameter is present, none of the tabs are active.
 */
'use client'
import { TabNav, Flex, Text } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import useSearchParams from "@/app/_hooks/useSearchParams"


function TabElement({ menu, children }: { menu: string, children: React.ReactNode }) {
    const { searchParams, getPathnameWithSearchParamToggled } = useSearchParams()

    return (
        <TabNav.Link active={searchParams.get('menu') == menu} asChild>
            <Link href={getPathnameWithSearchParamToggled('menu', menu)} shallow={true} prefetch>
                {children}
            </Link>
        </TabNav.Link>
    )
}



interface MenuTab {
    menu: string
    label: string
    icon: React.ReactNode
}

interface MenuTabsProps {
    tabs: MenuTab[]
}

export default function MenuTabs({ tabs }: MenuTabsProps) {


    return (
        <TabNav.Root className="dark" id='menu-tabs'>
            <CustomTabStyle />

            {tabs.map(tab => (
                <TabElement key={tab.menu} menu={tab.menu}>
                    <Flex direction='column' align='center' gap='1' pt='1'>
                        {tab.icon}
                        <Text as='label' size='1'>{tab.label}</Text>
                    </Flex>
                </TabElement>
            ))}

        </TabNav.Root>
    )
}


/**
 * Sorry about that, it is a hack to customize the tab style:
 * * Make the active tab background white
 * * Make the tab height adapt to the content
 */
export function CustomTabStyle({padding}: {padding?: string}) {
    return (
        <style dangerouslySetInnerHTML={{__html: `
            .rt-BaseTabListTrigger:where([data-state="active"], [data-active])::before {
                background-color: white;
            }

            .rt-BaseTabListTrigger{
                height: unset;
                ${padding ?
                `padding-left: ${padding};
                 padding-right: ${padding};
                `
                :
                ''
            }
            `
            }}
        />
    )
}
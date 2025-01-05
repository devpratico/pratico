/**
 * This component is a tab navigation for the menu.
 * The current menu is stored in the URL query parameter 'menu'.
 * For example, 'pratico.io/capsule/123?menu=activities' will display the 'activities' menu.
 * When no query parameter is present, none of the tabs are active.
 */
'use client'
import { Flex, Text, Tabs } from "@radix-ui/themes"
//import { Link } from "@/app/(frontend)/_intl/intlNavigation"
import useSearchParams from "@/app/(frontend)/_hooks/standalone/useSearchParams"
import { useCallback } from "react"


function TabElement({ menu, children }: { menu: string, children: React.ReactNode }) {
    //const { searchParams, getPathnameWithSearchParamToggled } = useSearchParams()

    return (
        /*<TabNav.Link active={searchParams.get('menu') == menu} asChild>
            <Link href={getPathnameWithSearchParamToggled('menu', menu)} shallow={true} prefetch>
                {children}
            </Link>
        </TabNav.Link>*/
        <Tabs.Trigger value={menu}>
            {children}
        </Tabs.Trigger>
    )
}

/**
 * A tab element for when no menu is selected.
 */
function HomeTabElement({ children }: { children: React.ReactNode }) {
    //const { searchParams, getPathnameWithoutSearchParam } = useSearchParams()

    return (
        /*<TabNav.Link active={!searchParams.get('menu')} asChild>
            <Link href={getPathnameWithoutSearchParam('menu')} shallow={true} prefetch>
                {children}
            </Link>
        </TabNav.Link>*/
        <Tabs.Trigger value={'home'}>
            {children}
        </Tabs.Trigger>
    )
}



interface MenuTab {
    menu?: string
    label: string
    icon: React.ReactNode
}

interface MenuTabsProps {
    padding?: string
    tabs: MenuTab[]
}

export default function MenuTabs({ padding, tabs }: MenuTabsProps) {

    const { searchParams, setSearchParam } = useSearchParams()
    const onValueChange = useCallback((value: string) => {
        setSearchParam('menu', value)
    }, [setSearchParam])



    return (
        <Tabs.Root className="dark" id='menu-tabs' defaultValue="home" value={searchParams.get('menu') || 'home'} onValueChange={onValueChange}>
            <CustomTabStyle padding={padding} />

            <Tabs.List>

            {tabs.map(tab => {
                // If a menu ("chat", "activities", etc.) is defined, use the TabElement
                if (tab.menu) {
                    return (
                        <TabElement key={tab.menu} menu={tab.menu}>
                            <Flex direction='column' align='center' gap='1' pt='1'>
                                {tab.icon}
                                <Text size='1'>{tab.label}</Text>
                            </Flex>
                        </TabElement>
                        // If no menu is defined, use the HomeTabElement
                    )} else {
                    return (
                        <HomeTabElement key='home'>
                            <Flex direction='column' align='center' gap='1' pt='1'>
                                {tab.icon}
                                <Text size='1'>{tab.label}</Text>
                            </Flex>
                        </HomeTabElement>
                    )
                }
            })}
            </Tabs.List>

        </Tabs.Root>
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
/**
 * This component is a tab navigation for the menu.
 * The current menu is stored in the URL query parameter 'menu'.
 * For example, 'pratico.io/capsule/123?menu=activities' will display the 'activities' menu.
 * When no query parameter is present, none of the tabs are active.
 */
'use client'
import { TabNav, Flex, Text } from "@radix-ui/themes"
import { Link } from "@/app/_intl/intlNavigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "@/app/_intl/intlNavigation"


/**
 * Adds a search param to the current ones without removing the others. Returns the new string.
 */
function addSearchParam(searchParams: URLSearchParams, name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
}

/**
 * Removes a search param from the current ones. Returns the new string.
 */
function removeSearchParam(searchParams: URLSearchParams, name: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(name)
    return params.toString()
}

/**
 * Returns the href for the tab. It is different if the tab is active or not.
 */
export function hrefFor(searchParams: URLSearchParams, pathname: string, menu: string) {
    return searchParams.get('menu') == menu ?
        // If the tab is already active, remove the query parameter (closes the tab)
        pathname + '?' + removeSearchParam(searchParams, 'menu')
        :
        // If the tab is not active, add the query parameter (opens the tab)
        pathname + '?' + addSearchParam(searchParams, 'menu', menu)
}



function TabElement({ menu, children }: { menu: string, children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    return (
        <TabNav.Link active={searchParams.get('menu') == menu} asChild>
            <Link href={hrefFor(searchParams, pathname, menu)} shallow={true} prefetch>
                {children}
            </Link>
        </TabNav.Link>
    )
}

/**
 * A tab element for when no menu is selected.
 */
function HomeTabElement({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    return (
        <TabNav.Link active={!searchParams.get('menu')} asChild>
            <Link href={pathname + '?' + removeSearchParam(searchParams, 'menu')} shallow={true}>
                {children}
            </Link>
        </TabNav.Link>
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


    return (
        <TabNav.Root className="dark" id='menu-tabs'>
            <CustomTabStyle padding={padding} />

            {tabs.map(tab => {
                // If a menu ("chat", "activities", etc.) is defined, use the TabElement
                if (tab.menu) {
                    return (
                        <TabElement key={tab.menu} menu={tab.menu}>
                            <Flex direction='column' align='center' gap='1' pt='1'>
                                {tab.icon}
                                <Text as='label' size='1'>{tab.label}</Text>
                            </Flex>
                        </TabElement>
                        // If no menu is defined, use the HomeTabElement
                    )} else {
                    return (
                        <HomeTabElement key='home'>
                            <Flex direction='column' align='center' gap='1' pt='1'>
                                {tab.icon}
                                <Text as='label' size='1'>{tab.label}</Text>
                            </Flex>
                        </HomeTabElement>
                    )
                }
        })}

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
'use client'
import { TabNav, Flex, Text, Button } from "@radix-ui/themes"
import { Puzzle, Cake } from "lucide-react"
import { Link } from "@/app/_intl/intlNavigation"
import { useSearchParams } from "next/navigation"
//import { useRouter } from "@/app/_intl/intlNavigation"
import { useCallback } from "react"
import { usePathname } from "@/app/_intl/intlNavigation"


export default function MenuTabs() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentMenu = searchParams.get('menu')

    // Get a new searchParams string by merging the current
    // searchParams with a provided key/value pair
    const addSearchParam = useCallback((name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set(name, value)
            return params.toString()
        },
        [searchParams]
    )

    // Get a new searchParams string by removing a key/value pair
    const removeSearchParam = useCallback((name: string) => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete(name)
            return params.toString()
        },
        [searchParams]
    )

    function hrefFor(_menu: string) {
        return currentMenu == _menu ?
            pathname + '?' + removeSearchParam('menu')
            :
            pathname + '?' + addSearchParam('menu', _menu)
    }

    return (
        <TabNav.Root className="dark">
            <CustomTabStyle />

            <TabNav.Link active={currentMenu == 'one'} asChild>
                <Link href={hrefFor('one')} shallow>
                    <Flex direction='column' align='center' gap='1' pt='1'>
                        <Puzzle />
                        <Text as='label' size='1'>Activités</Text>
                    </Flex>
                </Link>
            </TabNav.Link>

            <TabNav.Link active={currentMenu == 'two'} asChild>
                <Link href={hrefFor('two')} shallow>
                    Two
                </Link>
            </TabNav.Link>

            <TabNav.Link active={currentMenu == 'three'} asChild>
                <Link href={hrefFor('three')} shallow>
                    Three
                </Link>
            </TabNav.Link>

        </TabNav.Root>
    )
}




/**
 * Sorry about that, it is a hack to customize the tab style:
 * * Make the active tab background white
 * * Make the tab height adapt to the content
 */
function CustomTabStyle() {
    return (
        <style dangerouslySetInnerHTML={{__html: `
            .rt-BaseTabListTrigger:where([data-state="active"], [data-active])::before {
                background-color: white;
            }

            .rt-BaseTabListTrigger{
                height: unset;
            }
                `,}}
        />
    )
}
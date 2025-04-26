"use client"
import {
    Flex,
    Popover,
    IconButton,
    IconButtonProps,
    RadioCards,
    Text,
    Callout,
} from "@radix-ui/themes"
import { ChevronsLeftRight, TriangleAlert } from "lucide-react"
import { useSetActivityNav } from "@/client/hooks/use-set-activity-nav"
import { useTransition } from "react"



function View(props: {
    defaultValue: "animateur" | "libre"
    disabled?: boolean
    onChange?: (value: "animateur" | "libre") => void
    isPending?: boolean
    errorMessage?: string
} & Omit<IconButtonProps, "onChange" | "defaultValue" | "disabled">) {
    const { defaultValue, disabled, onChange, isPending, errorMessage, ...btnProps } = props
    return (
        <Popover.Root>

            <Popover.Trigger>
                <IconButton variant="ghost" {...btnProps}>
                    <ChevronsLeftRight />
                </IconButton>
            </Popover.Trigger>

                <Popover.Content align="center" side="top" maxWidth='300px'>
                    
                    <RadioCards.Root
                        columns='1'
                        size='1'
                        defaultValue={defaultValue}
                        onValueChange={onChange}
                        color={isPending ? "gray" : undefined}
                    >

                        
                        <RadioCards.Item value="animateur" disabled={disabled}>
                            <Flex direction="column" gap="1" width="100%">                            
                                <Text weight="bold">Défilement animateur</Text>
                                <Text color="gray">L&apos;animateur contrôle ce que voient les apprenants</Text>
                            </Flex>
                        </RadioCards.Item>
                        
                        <RadioCards.Item value="libre" disabled={disabled}>
                            <Flex direction="column" gap="1" width="100%">
                                <Text weight="bold">Défilement libre</Text>
                                <Text color="gray">Les apprenants peuvent naviguer librement dans l&apos;activité</Text>
                            </Flex>
                        </RadioCards.Item>

                    </RadioCards.Root>

                    <Callout.Root color="orange" mt='4' style={{display: errorMessage ? undefined : "none"}}>
                        <Callout.Icon>
                            <TriangleAlert />
                        </Callout.Icon>
                        <Callout.Text>
                            {errorMessage}
                        </Callout.Text>
                    </Callout.Root>

                </Popover.Content>

        </Popover.Root>
    )
}


function ActivityNavOptions(props: {
    defaultValue: "animateur" | "libre"
    roomId: number
    disabled?: boolean
} & Omit<IconButtonProps, "onChange" | "defaultValue" | "disabled">) {

    const { defaultValue, roomId, disabled, ...btnProps } = props
    const { set, res, isPending } = useSetActivityNav(roomId)
    const [ tPending, startTransition ] = useTransition()

    const handleChange = (value: "animateur" | "libre") => {
        startTransition(() => {
            set(value)
        })
    }

    return (
            <View
                defaultValue={defaultValue}
                onChange={handleChange}
                isPending={isPending || tPending}
                errorMessage={res.error ? res.error.message : undefined}
                {...btnProps}
            />
    )
}

export default ActivityNavOptions
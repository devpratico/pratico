"use client"
import {
    Flex,
    Popover,
    IconButton,
    IconButtonProps,
    Button,
    RadioCards,
    Text,
    Callout,
} from "@radix-ui/themes"
import { ChevronsLeftRight, TriangleAlert } from "lucide-react"
import { useSetActivityNav } from "@/app/hooks/use-set-activity-nav"
import { useTransition, useEffect, useState } from "react"
import { useRoom } from "@/app/(frontend)/_hooks/contexts/useRoom"
import useActivitySnapshotQuery from "@/app/(frontend)/_hooks/queries/useActivitySnapshotQuery"




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
                <Button {...btnProps}>
                    <ChevronsLeftRight size={28} />
                    Synchrone
                </Button>
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
                                <Text weight="bold">Synchrone</Text>
                                <Text color="gray">L&apos;animateur contrôle le déroulé des questions</Text>
                            </Flex>
                        </RadioCards.Item>
                        
                        <RadioCards.Item value="libre" disabled={disabled}>
                            <Flex direction="column" gap="1" width="100%">
                                <Text weight="bold">Asynchrone</Text>
                                <Text color="gray">Les participants répondent aux questions à leur rythme</Text>
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
    disabled?: boolean
} & Omit<IconButtonProps, "onChange" | "defaultValue" | "disabled">) {

    const { disabled, ...btnProps } = props
    const room = useRoom()
    const roomId = room.room?.id || 0
    const { set, res, isPending } = useSetActivityNav(roomId)
    const { fetchSnapshot } = useActivitySnapshotQuery()
    const [ initialNav, setInitialNav] = useState<"animateur" | "libre">("animateur")

    useEffect(() => {
        fetchSnapshot(`${roomId}`).then(({data, error}) => {
            if (data) setInitialNav(data.navigation)
        });
    }, [fetchSnapshot, setInitialNav, roomId]);

    const [ tPending, startTransition ] = useTransition()

    

    const handleChange = (value: "animateur" | "libre") => {
        startTransition(() => {
            set(value)
        })
    }

    return (
            <View
                defaultValue={initialNav}
                onChange={handleChange}
                isPending={isPending || tPending}
                errorMessage={res.error ? res.error.message : undefined}
                {...btnProps}
            />
    )
}

export default ActivityNavOptions
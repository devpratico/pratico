import { fetchActivitiesOfCurrentUser } from "@/app/(backend)/api/activity/activity.server"
import { Callout, Table, Text, Spinner, Flex } from "@radix-ui/themes"
import { getFormatter } from "next-intl/server"
import { Suspense } from "react"
import StartButton from "./StartButton"
import EditButton from "../../activities/EditButton"



interface ActivitiesTableProps {
    type?: 'quiz' | 'poll' | 'all'
    showMax?: number
    noneMessage: string
}


async function ActivitiesTableServer({ type = 'all', showMax, noneMessage }: ActivitiesTableProps) {
    const formatter = await getFormatter()

    // It's ok to fetch all the activities even if we only need one type,
    // because we already fetched all the activities in the previous page,
    // and the result is cached. Might need more consider
    let { data, error } = await fetchActivitiesOfCurrentUser(showMax)

    // Filter the activities by type
    if (type !== 'all') {
        data = data.filter((activity) => activity.type === type)
    }

    if (!data || data.length == 0 || error) {
        return (
            <Callout.Root color='gray'>
                <Callout.Text>{noneMessage}</Callout.Text>
            </Callout.Root>
        )
    }

    return (
        <Table.Root variant='surface' size='1'>
            <Table.Body>
                {data.map((activity) => (
                    <Table.Row key={activity.id}>

                        <Table.RowHeaderCell>
                            <Text trim='normal'>
                                {activity.object.title !== '' ? activity.object.title : 'Sans titre'}
                            </Text>
                        </Table.RowHeaderCell>

                        <Table.Cell>
                            <Text size='1' color='gray'>
                                {activity.created_at && formatter.dateTime(new Date(activity.created_at))}
                            </Text>
                        </Table.Cell>

                        <Table.Cell pr='0'>
                            <Flex align='center' justify='center' height='100%'>
                                <StartButton activity_id={activity.id} />
                            </Flex>
                        </Table.Cell>

                        <Table.Cell pl='1'>
                            <Flex align='center' justify='center' height='100%'>
                                <EditButton activityId={activity.id} initialActivity={activity.object} />
                            </Flex>
                        </Table.Cell>

                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}


function Loading() {
    return (
        <Callout.Root color='gray'>
            <Callout.Icon><Spinner /></Callout.Icon>
            <Callout.Text>Chargement...</Callout.Text>
        </Callout.Root>
    )
}


export default function ActivitiesTable({ ...props }: ActivitiesTableProps) {
    return (
        <Suspense fallback={<Loading />}>
            <ActivitiesTableServer {...props} />
        </Suspense>
    )
}
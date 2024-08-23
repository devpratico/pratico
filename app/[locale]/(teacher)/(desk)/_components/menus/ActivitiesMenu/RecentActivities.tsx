import { fetchActivitiesOfCurrentUser } from "@/app/api/_actions/activities"
import { Callout, Table, Text, Spinner, Flex } from "@radix-ui/themes"
import { getFormatter } from "next-intl/server"
import { Suspense } from "react"
import StartButton from "./StartButton"
import EditButton from "./EditButton"



async function RecentActivitiesS() {
    const { data, error } = await fetchActivitiesOfCurrentUser(10)
    const formatter = await getFormatter()

    if (!data || data.length==0 || error) {
        return (
            <Callout.Root color='gray'>
                <Callout.Text>Aucun favori</Callout.Text>
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
                                {activity.object.title}
                            </Text>
                        </Table.RowHeaderCell>

                        <Table.Cell>
                            <Text size='1' color='gray'>
                                {activity.created_at && formatter.dateTime(new Date(activity.created_at))}
                            </Text>
                        </Table.Cell>

                        <Table.Cell pr='0'>
                            <Flex align='center' justify='center' height='100%'>
                                <StartButton />        
                            </Flex>
                        </Table.Cell>

                        <Table.Cell pl='1'>
                            <Flex align='center' justify='center' height='100%'>
                                <EditButton activityId={activity.id} initialActivity={activity.object}/>
                            </Flex>
                        </Table.Cell>

                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}

export default function RecentActivities() {
    return (
        <Suspense fallback={<Loading />}>
            <RecentActivitiesS />
        </Suspense>
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
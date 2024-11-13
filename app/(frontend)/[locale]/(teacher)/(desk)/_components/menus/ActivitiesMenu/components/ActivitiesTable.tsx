import { fetchActivitiesOfCurrentUser } from "@/app/(backend)/api/activity/activity.server"
import { Callout, Table, Text, Spinner, Flex, Skeleton } from "@radix-ui/themes"
import { getFormatter } from "next-intl/server"
import React, { Suspense } from "react"
import StartButton from "./StartButton"
import EditButton from "./EditButton"
import { Quiz } from "@/app/_types/quiz"
import { Poll } from "@/app/_types/poll"
import { Poll as Poll2 } from "@/app/_types/poll2"



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

                <SkeletonRow />

                {data.map((activity) => (
                    <Row
                        key={activity.id}
                        title={<Text trim='normal'>{activity.object.title !== '' ? activity.object.title : 'Sans titre'}</Text>}
                        date={<Text size='1' color='gray'>{activity.created_at && formatter.dateTime(new Date(activity.created_at))}</Text>}
                        button1={<StartButton activity_id={activity.id} />}
                        button2={<EditButton activityId={activity.id} initialActivity={activity.object} />}
                    />
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


interface RowProps {
    title: React.ReactNode
    date: React.ReactNode
    button1: React.ReactNode
    button2: React.ReactNode
}

function Row({ title, date, button1, button2 }: RowProps) {
    return (
        <Table.Row>

            <Table.RowHeaderCell>
                {title}
            </Table.RowHeaderCell>

            <Table.Cell>
                {date}
            </Table.Cell>

            <Table.Cell pr='0'>
                <Flex align='center' justify='center' height='100%'>
                    {button1}
                </Flex>
            </Table.Cell>

            <Table.Cell pl='1'>
                <Flex align='center' justify='center' height='100%'>
                    {button2}
                </Flex>
            </Table.Cell>

        </Table.Row>
    )
}

function SkeletonRow() {
    //return null
    return (
        <Row
            title={<Skeleton />}
            date={<Skeleton />}
            button1={<Skeleton />}
            button2={<Skeleton />}
        />
    )
}
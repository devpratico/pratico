import { Heading, Container, Section, Link, DataList, Card, Flex, Table } from "@radix-ui/themes"
import { listAllCoupons, listAllCodes } from "@/app/(backend)/data-access/stripe"
import Stripe from "stripe"
import { getFormatter } from "next-intl/server"
import CreateCodeForm from "./_components/CreateCodesForm"
import { getUserRole } from "@/app/(backend)/data-access/auth"


export default async function Page() {

    // Page protection
    if (process.env.NODE_ENV === 'production') {
        const { role } = await getUserRole()
        if (role !== 'pratico_admin') return <p>Unauthorized</p>
    }

    const coupons = await listAllCoupons()
    const codes = await listAllCodes()


    return (
        <Container m='5'>
            <Section>

                <Heading as='h1'>Admin</Heading>

                <Heading as='h2' size='4' mt='5'>Coupons</Heading>
                <CouponsList coupons={coupons} />
                <Link href='https://dashboard.stripe.com/apikeys' target="_blank">Gérer les coupons</Link>
            </Section>

            <Section>

                <Heading as='h2' size='4' mt='5'>Codes</Heading>
                <CreateCodeForm />

                <CodesTable codes={codes} />


            </Section>

        </Container>
    )
}





// COMPONENTS -------------------------------------------------------------------

function DataListItem({id, value}: {id: string, value: React.ReactNode}) {
    return (
        <DataList.Item>
            <DataList.Label>{id}</DataList.Label>
            <DataList.Value>{value}</DataList.Value>
        </DataList.Item>
    )
}

async function CouponCard({coupon}: {coupon: Stripe.Coupon}) {
    const formatter = await getFormatter({ locale: 'fr'})

    return (
        <Card size='1' variant='classic'>
            <DataList.Root size='1'>
                <DataListItem id='Name' value={coupon.name} />
                <DataListItem id='Valid' value={coupon.valid ? 'Yes' : 'No'} />
                <DataListItem id='ID' value={coupon.id} />
                <DataListItem id='Percent off' value={`${coupon.percent_off}%`} />
                <DataListItem id='Created' value={formatter.dateTime(new Date(coupon.created * 1000))} />
                <DataListItem id='Duration' value={coupon.duration} />
                <DataListItem id='Duration in months' value={coupon.duration_in_months || 'none'} />
                <DataListItem id='Max redemptions' value={coupon.max_redemptions || 'none'} />
                <DataListItem id='Redeem by' value={coupon.redeem_by ? formatter.dateTime(new Date(coupon.redeem_by * 1000)): 'none'} />
                <DataListItem id='Times redeemed' value={coupon.times_redeemed} />
            </DataList.Root>
        </Card>
    )
}

function CouponsList({coupons}: {coupons: Stripe.Coupon[]}) {
    if (!coupons.length) return <p>No coupons found</p>

    return (
        <Flex gap='3'>
            {coupons.map(coupon => (
                <CouponCard key={coupon.id} coupon={coupon} />
            ))}
        </Flex>
    )
}


async function CodeRow({code}: {code: Stripe.PromotionCode}) {
    const formatter = await getFormatter({ locale: 'fr'})

    return (
        <Table.Row>
            <Table.Cell>{code.code}</Table.Cell>
            <Table.Cell>{code.coupon.id}</Table.Cell>
            <Table.Cell>{code.id}</Table.Cell>
            <Table.Cell>{formatter.dateTime(new Date(code.created * 1000))}</Table.Cell>
            <Table.Cell>{code.expires_at ? formatter.dateTime(new Date(code.expires_at * 1000)) : 'never'}</Table.Cell>
            <Table.Cell>{code.max_redemptions || 'none'}</Table.Cell>
            <Table.Cell>{code.times_redeemed}</Table.Cell>
            <Table.Cell>{JSON.stringify(code.metadata)}</Table.Cell>
        </Table.Row>
    )
}

async function CodesTable({codes}: {codes: Stripe.PromotionCode[]}) {
    if (!codes.length) return <p>No codes found</p>

    return (
        <Table.Root size='1' variant='surface' mt='5'>
            <Table.Header>
                <Table.Row>
                    <Table.RowHeaderCell>Code</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Coupon ID</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Code ID</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Created</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Expires at</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Max redemptions</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Times redeemed</Table.RowHeaderCell>
                    <Table.RowHeaderCell>Metadata</Table.RowHeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {codes.map(code => (
                    <CodeRow key={code.id} code={code} />
                ))}
            </Table.Body>
        </Table.Root>
    )
}
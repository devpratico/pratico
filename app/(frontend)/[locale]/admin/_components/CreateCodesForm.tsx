'use client'
import * as Form from "@radix-ui/react-form"
import { Button, Card, TextField, Link } from "@radix-ui/themes"
import Stripe from "stripe"
import createPromotionCodes from "@/app/(backend)/api/stripe/create-promotion-codes/wrapper"
import { useState } from "react"
import { useRouter } from "@/app/(frontend)/_intl/intlNavigation"

type CreateCodeParams = Stripe.PromotionCodeCreateParams



export default function CreateCodeForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submit')
        setIsLoading(true)

        const formData = Object.fromEntries(new FormData(e.currentTarget))
        console.log(formData)

        const coupon = formData['coupon-id'] as string
        const number = (formData['number'] as string).length ? parseInt(formData['number'] as string) : 0
        const max_redemptions = (formData['max-redemptions'] as string).length ? parseInt(formData['max-redemptions'] as string) : undefined

        console.log({ coupon, number })

        const params: CreateCodeParams = {
            coupon,
            max_redemptions
        }

        const { codes, error } = await createPromotionCodes({ number, params })

        router.refresh()

        console.log({ codes, error })

        
        setIsLoading(false)
    }



    return (
        <Card size='1' variant='classic' style={{ maxWidth: '400px' }}>

            <Form.Root style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={onSubmit}>
                <Form.Field name='coupon-id'>
                    <Form.Label>Coupon ID</Form.Label>
                    <Form.Control required asChild><TextField.Root /></Form.Control>
                </Form.Field>

                <Form.Field name='number'>
                    <Form.Label>How many codes?</Form.Label>
                    <Form.Control required asChild type='number'><TextField.Root type='number'/></Form.Control>
                </Form.Field>

                <Form.Field name='expires-at'>
                    <Form.Label>Expires at</Form.Label>
                    <Form.Control asChild disabled><TextField.Root /></Form.Control>
                </Form.Field>

                <Form.Field name='max-redemptions'>
                    <Form.Label>Max redemptions</Form.Label>
                    <Form.Control asChild><TextField.Root type="number" required defaultValue={"1"}/></Form.Control>
                </Form.Field>

                <Form.Field name='metadata'>
                    <Form.Label>Metadata</Form.Label>
                    <Form.Control asChild disabled><TextField.Root /></Form.Control>
                </Form.Field>

                <Link href='https://docs.stripe.com/api/promotion_codes/create' target="_blank">?</Link>

                <Button type='submit' loading={isLoading}>Create</Button>

            </Form.Root>

        </Card>
    )
}
'use client'
import CardDialog from '@/app/(frontend)/[locale]/(teacher)/(desk)/_components/CardDialog'
import { ScrollArea } from '@radix-ui/themes'

export default function ActivityCard() {



    return (
        <CardDialog open={true} preventClose topMargin='0'>
            <ScrollArea>
            {
                <p>Hello</p>
            }
            </ScrollArea>
        </CardDialog>
    )

}
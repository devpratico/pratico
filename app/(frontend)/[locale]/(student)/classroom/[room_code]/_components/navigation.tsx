import { Card, CardProps, Flex } from "@radix-ui/themes"
import Navigator from "@/app/(frontend)/[locale]/(teacher)/(desk)/_components/menus/ActivitiesMenu/components/Navigator"


export default function Navigation(props: {
    total: number
    currentQuestionIndex: number
    setCurrentQuestionIndex: (index: number) => void
} & CardProps) {

    const { total, currentQuestionIndex, setCurrentQuestionIndex, ...cardProps } = props
    
    return (
        <Card variant='classic' {...cardProps} >
            <Navigator
                total={total}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
            />
        </Card>
    )
}
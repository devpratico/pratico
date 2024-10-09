import { Callout } from "@radix-ui/themes";


interface FeedbackProps {
    color: Callout.RootProps['color'];
    message: string;
    icon?: React.ReactNode;
}


export default function Feedback({ color, message, icon }: FeedbackProps) {
    return (
        <Callout.Root color={color}>
            { icon && <Callout.Icon>{icon}</Callout.Icon> }
            <Callout.Text>{message}</Callout.Text>
        </Callout.Root>
    )
}